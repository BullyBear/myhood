import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { getToysWithinRadius, getAllToys, getToyById, createToy as createToyAPI, updateToy as updateToyAPI, deleteToy as deleteToyAPI } from '../API/toyAPI';



//const initialState = { toys: [], loading: false, error: null };
//const initialState = { toys: [], swipedToyIds: [], loading: false, error: null };

const initialState = { toys: [], swipedToys: [], loading: false, error: null };





console.log("Initial state:", initialState);

// Async action to handle uploading images and creating a toy
export const createAndUploadToy = createAsyncThunk('toy/createAndUpload', async (payload) => {
  const { images, user, latitude, longitude, S3Client, BUCKET_NAME } = payload;
  // ... Existing logic for uploading images and creating a toy
  const response = await createToyAPI(toyData);
  return response;
});


// Fetch toys from the API
export const fetchToysFromAPI = createAsyncThunk('toy/fetchToys', async () => {
  try {
    console.log('[fetchToysFromAPI] - Fetching toys from API');
    const toys = await getAllToys();
    console.log('[fetchToysFromAPI] - Fetched toys:', toys);
    return toys;
  } catch (error) {
    console.error('[fetchToysFromAPI] - Error fetching toys:', error.message);
    throw error;
  }
});

// Fetch toys within a certain radius from the API
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
    removeToyFromCarousel: (state, action) => {
      const toyIdToRemove = action.payload;
      state.toys = state.toys.filter(toy => toy.id !== toyIdToRemove);
    },
    addSwipedToy: (state, action) => {
      console.log("addswipedtoyreducer", state);
      if (!state.swipedToys) {
        state.swipedToys = [];
      }
      console.log("swipedToys before push: ", state.swipedToys);
      state.swipedToys.push(action.payload);
    },
    
    clearToys: (state) => {
      state.toys = [];
    },
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
      state.toys = action.payload;
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
    .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
      state.toys = action.payload;
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

export const { clearToys, loadToy, loadToys, addProfileToUserBox, removeToyFromCarousel, addSwipedToy, toyAdded, toyUpdated, toyDeleted } = toySlice.actions;

export default toySlice.reducer;
