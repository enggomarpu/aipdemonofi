import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: false,
  stateUpdated: false,
  errorMessage: ''
};

const availableCollabrationSlice = createSlice({
  name: 'available_collaboration',
  initialState,
  reducers: {
    getData: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    setData: (state, action) =>{
      state.data = action.payload;
      state.stateUpdated = true;
      state.loading = true;
      state.error = false;
    },
    saveData: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    success: (state, action) => {
      state.loading = false;
      state.error = false;
    },
    error: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
      state.error = true;
    }
  }
});
export const {
  getData,
  setData,
  saveData,
  success,
  error
} = availableCollabrationSlice.actions;
export default availableCollabrationSlice.reducer;