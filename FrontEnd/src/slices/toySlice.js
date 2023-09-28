import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { getToysWithinRadius, getAllToys, getToyById, createToy as createToyAPI, updateToy as updateToyAPI, deleteToy as deleteToyAPI, addToyToToyboxAPI } from '../API/toyAPI';



//const initialState = { toys: [], swipedToys: [], toyImages: [], loading: false, error: null };
const initialState = { toys: [], toyBox: [], toyImages: [], swipedToys: [], loading: false, error: null };



console.log("Initial state:", initialState);

// Async action to handle uploading images and creating a toy
export const createAndUploadToy = createAsyncThunk('toy/createAndUpload', async (payload) => {
  const { images, user, latitude, longitude, S3Client, BUCKET_NAME } = payload;
  // ... Existing logic for uploading images and creating a toy
  const response = await createToyAPI(toyData);
  return response;
});



export const addToyToToybox = createAsyncThunk(
  'toy/addToyToToybox',
  async ({ userId, toyId }, { rejectWithValue }) => {
    try {
      const response = await addToyToToyboxAPI(userId, toyId);
      console.log("addToyToToybox response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const fetchToysFromAPI = createAsyncThunk('toy/fetchToys', async () => {
  try {
    console.log('[fetchToysFromAPI] - Fetching toys from API');
    const toys = await getAllToys();
    console.log('[fetchToysFromAPI] - Fetched toys:', toys);
    // Assuming each toy has fields image_url_one, image_url_two, etc.
    // Add toy images to the toys fetched from the API
    const toyImages = toys.map((toy) => [
      toy.image_url_one,
      toy.image_url_two,
      toy.image_url_three,
      toy.image_url_four,
      toy.image_url_five,
    ].filter(Boolean)); // remove null or undefined values
    return { toys, toyImages };
  } catch (error) {
    console.error('[fetchToysFromAPI] - Error fetching toys:', error.message);
    throw error;
  }
});




// export const fetchToysWithinRadiusFromAPI = createAsyncThunk(
//   'toy/fetchToysWithinRadius',
//   async ({ latitude, longitude, user_id, mode = 'uninteracted' }) => {
//     try {
//       const toys = await getToysWithinRadius(latitude, longitude, user_id, mode);
//       return toys;
//     } catch (error) {
//       console.error('[fetchToysWithinRadiusFromAPI] - Error fetching toys within radius:', error.message);
//       throw error;
//     }
//   }
// );



export const fetchToysWithinRadiusFromAPI = createAsyncThunk(
  'toy/fetchToysWithinRadius',
  async ({ latitude, longitude }) => {
    try {
      console.log('[fetchToysWithinRadiusFromAPI] - BEFORE');
      const toys = await getToysWithinRadius(latitude, longitude);
      console.log('[fetchToysWithinRadiusFromAPI] - AFTER', toys);
      return toys;
    } catch (error) {
      console.error('[fetchToysWithinRadiusFromAPI] - Error fetching toys within radius:', error.message);
      throw error;
    }
  }
);



export const fetchToyByIdFromAPI = createAsyncThunk('toy/fetchToyById', async (toyId) => {
  try {
    const toy = await getToyById(toyId);
    return toy; // Return the fetched toy directly
  } catch (error) {
    console.error('Error fetching toy by ID:', error.message);
    throw error;
  }
});



export const createToyInAPI = createAsyncThunk('toy/create', async (toyData) => {
  const response = await createToyAPI(toyData);
  return response;
});


export const updateToyInAPI = createAsyncThunk('toy/update', async ({ toyId, toyData }) => {
  const response = await updateToyAPI(toyId, toyData);
  return response;
});

// export const updateToyInAPI = createAsyncThunk('toy/update', async ({ toyId, toyData }) => {
//   const response = await updateToyAPI(toyId, { image_urls: toyData.image_urls });
//   return response;
// });



export const deleteToyInAPI = createAsyncThunk('toy/delete', async (toyId) => {
  console.log('deleteToyInAPI - Invoked');
  const response = await deleteToyAPI(toyId);
  console.log('deleteToyInAPI!', response)
  //return response;
  return { ...response, id: toyId };  
});


// export const deleteToyInAPI = createAsyncThunk('toy/delete', async (toyId) => {
//   try {
//     await deleteToyAPI(toyId);
//     return toyId; // Return the deleted toyId on success
//   } catch (error) {
//     console.error('[deleteToyInAPI] - Error deleting toy:', error.message);
//     throw error;
//   }
// });



const toySlice = createSlice({
  name: 'toy',
  initialState: initialState,
  //initialState: { toys: [] },
  reducers: {
    resetState: (state) => {
      return initialState;
    },
  //   updateToyImages: (state, action) => {
  //     const { userId, toyImages } = action.payload;
  //     const toy = state.toys.find((toy) => toy.userId === userId);
  //     if (toy) {
  //         toy.images = toyImages;
  //     } else {
  //         state.toys.push({
  //             userId: userId,
  //             images: toyImages
  //         });
  //         state.toyImages.push(...toyImages); 
  //     }
  // },  
  updateToyImages: (state, action) => {
    const { toyId, toyImages } = action.payload;
    const toy = state.toys.find((toy) => toy.id === toyId);
    if (toy) {
        toy.images = toyImages;
    }
},
    removeToyFromCarousel: (state, action) => {
      const toyIdToRemove = action.payload;
      state.toys = state.toys.filter(toy => toy.id !== toyIdToRemove);
    },
    addSwipedToy: (state, action) => {
      state.swipedToys.push(action.payload);
    },
    // addSwipedToy: (state, action) => {
    //   const { userId, toyId } = action.payload;
    //   if (!userId || !toyId) return;
    //   if (!state.userSwipedToys[userId]) {
    //     state.userSwipedToys[userId] = [];
    //   }
    //   if (!state.userSwipedToys[userId].includes(toyId)) {
    //     state.userSwipedToys[userId].push(toyId);
    //   }
    // },

    clearToys: (state) => {
      state.toys = [];
    },
    // clearToys: (state) => {
    //   state.swipedToys = [];
    // },
    
    loadToy: (state, action) => {
      console.log("Current state before updating toy:", state.toys);
      const toy = action.payload;
      console.log('[loadToy] - Loading toy data:', toy);
      const index = state.toys.findIndex(t => t.id === toy.id);
      if (index === -1) { // if the toy isn't already in the list
        state.toys.push(toy);
      } else {
        state.toys[index] = toy; // update existing toy data
      }
    },
    loadToys: (state, action) => {
      state.toys = action.payload.toys;
      state.toyImages = action.payload.toyImages; // Set toyImages from the action payload
    },

    // removeToyFromCarousel: (state, action) => {
    //   const toyToRemove = action.payload;  // Assuming the payload is just the toy object
    //   if (!Array.isArray(state.toys)) {
    //     console.error('state.toys is not an array or is undefined');
    //     return;
    //   }
    //   state.toys = state.toys.filter((item) => item.id !== toyToRemove.id);
    // },
    
    
    toyAdded: (state, action) => {
      state.toys.push(action.payload);
    },
    toyUpdated: (state, action) => {
      console.log('toy updated action.payload:', action.payload);  
      const index = state.toys.findIndex(toy => toy.id === action.payload.id);
      if (index !== -1) {
        state.toys[index] = action.payload;
      }
    },
  //   toyDeleted: (state, action) => {
  //     console.log('toy deleted:', action.payload); 
  //     const id = action.payload;
  //     state.toys = state.toys.filter(toy => toy.id !== id);
  //   }
  // },
  toyDeleted: (state, action) => {
    console.log('toy deleted:', action.payload); 
    const toyId = action.payload; // Update this line
    state.toys = state.toys.filter(toy => toy.id !== toyId);
  },
  
  extraReducers: (builder) => {
    builder


    .addCase(addToyToToybox.fulfilled, (state, action) => {
      const newToy = action.payload.toy;
      const existingToyIndex = state.toyBox.findIndex(toy => toy.id === newToy.id);
      
      if (existingToyIndex === -1) {
         state.toyBox.push(newToy);
      }
   })
   
    
  
    
    
    // .addCase(addToyToToybox.fulfilled, (state, action) => {
    //   console.log("Toy added to toybox:", state); 
    // })
    .addCase(addToyToToybox.rejected, (state, action) => {
      console.error("Error adding toy to toybox:", action.error.message);
      state.error = action.error.message;
  })
  
  
    .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
      state.toys = action.payload;
      state.toyImages = action.payload.toyImages;
      console.log('toyslice action.payload - fetchToysFromAPI.fulfilled', action.payload)
      //console.log('toyslice action.payload.toys - fetchToysFromAPI.fulfilled', action.payload.toys)
      state.loading = false;
    })
    .addCase(fetchToysWithinRadiusFromAPI.fulfilled, (state, action) => {
      state.toys = action.payload;
      console.log('toyslice action.payload - fetchToysWithinRadiusFromAPI.fulfilled', action.payload)
      //console.log('toyslice action.payload.toys - fetchToysWithinRadiusFromAPI.fulfilled', action.payload.toys)
      state.loading = false;
    })
    .addCase(fetchToysFromAPI.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(fetchToysWithinRadiusFromAPI.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(fetchToysFromAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addCase(fetchToysWithinRadiusFromAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
      
      // .addCase(createToyInAPI.fulfilled, (state, action) => {
      //   const newToy = {
      //     ...action.payload,
      //     images: Array.isArray(action.payload.images) ? action.payload.images : []  // Handle 'images' as an array
      //   };
      //   state.toys.push(newToy);
      // })
      .addCase(createToyInAPI.fulfilled, (state, action) => {
        console.log('[createToyInAPI.fulfilled] - Toy created successfully');
        state.toys.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      // .addCase(updateToyInAPI.fulfilled, (state, action) => {
      //   const index = state.toys.findIndex(toy => toy.id === action.payload.id);
      //   if(index !== -1) {
      //     state.toys[index] = {
      //       ...action.payload,
      //       images: Array.isArray(action.payload.images) ? action.payload.images : []  // Handle 'images' as an array
      //     };
      //   }
      // })
      .addCase(updateToyInAPI.fulfilled, (state, action) => {
        const index = state.toys.findIndex((toy) => toy.id === action.payload.id);
        if (index !== -1) {
          state.toys[index] = action.payload;
        }
      })
      
      .addCase(fetchToyByIdFromAPI.fulfilled, (state, action) => {
        console.log("Fetched toy by ID:", action.payload);
        const existingToyIndex = state.toys.findIndex(t => t.id === action.payload.id);
        
        if (existingToyIndex !== -1) {
          state.toys[existingToyIndex] = action.payload;
        } else {
          state.toys.push(action.payload);
        }
        
        state.loading = false;
        state.error = null;
      }) 
      .addCase(deleteToyInAPI.fulfilled, (state, action) => {
        console.log('[deleteToyInAPI.fulfilled] - Toy deleted successfully');
        const toyId = action.payload.id; // Assuming your action.payload has the id property
        state.toys = state.toys.filter(toy => toy.id !== toyId);
        state.loading = false;
        state.error = null;
      }) 
      .addCase(deleteToyInAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })  
      // .addCase(deleteToyInAPI.fulfilled, (state, action) => {
      //   console.log('[deleteToyInAPI.fulfilled] - Toy deleted successfully');
      //   state.toys = state.toys.filter(toy => toy.id !== action.payload.id);
      //   state.loading = false;
      //   state.error = null;
      // })
      // .addCase(deleteToyInAPI.fulfilled, (state, action) => {
      //   console.log('Toy successfully deleted:', action.payload);
      //   const id = action.payload;
      //   state.toys = state.toys.filter(toy => toy.id !== id);
      // })
      .addMatcher((action) => {
        return action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected') || action.type.endsWith('/pending');
      }, (state, action) => {
        console.log('Action:', action.type);
        console.log('New State:', state);
      })
    }
  }
});

export const { clearToys, loadToy, loadToys, addProfileToUserBox, removeToyFromCarousel, addSwipedToy, toyAdded, toyUpdated, toyDeleted, resetState, updateToyImages} = toySlice.actions;

export default toySlice.reducer;
