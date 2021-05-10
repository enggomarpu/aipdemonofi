import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interExp: {},
  loading: false,
  error: false,
  errorMessage: '',
  dataPutted: false,
  dataSet: false
};

const interexperSlice = createSlice({
  name: 'interexp',
  initialState,
  reducers: {
    getData: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    setData: (state, action) => {
      state.interExp = {...state.interExp, ...action.payload};
      state.loading = false;
      state.error = false;
      state.dataSet = true;
    },
    saveData: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    saveDataSuccess: (state, action) => {
      state.dataPutted = true;
    },
    success: (state, action) => {
      state.loading = false;
      state.error = false;
    },
    error: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
      state.error = true;
    },
  },
});
export const {
  getData,
  setData,
  saveData,
  success,
  error,
  saveDataSuccess
} = interexperSlice.actions;
export default interexperSlice.reducer;