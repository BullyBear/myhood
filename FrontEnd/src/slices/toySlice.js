import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAllToys } from '../API/toyAPI';


export const fetchToysFromAPI = createAsyncThunk(
  'toys/fetchToys',
  async () => {
    const data = await getAllToys();
    return data;
  }
);

const toySlice = createSlice({
  name: 'toys',
  initialState: {
    toys: [],
    toyBox: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToyToBox: (state, action) => {
      const toy = action.payload;
      state.toyBox.push(toy);
    },
    removeToyFromCarousel: (state, action) => {
      const toy = action.payload;
      state.toys = state.toys.filter(t => t.id !== toy.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToysFromAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.toys = action.payload;
      })
      .addCase(fetchToysFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addToyToBox, removeToyFromCarousel } = toySlice.actions;

export default toySlice.reducer;
