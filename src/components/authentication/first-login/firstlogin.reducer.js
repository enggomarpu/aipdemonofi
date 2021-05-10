import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  loading: false,
  error: false,
  errorMessage: '',
  isVerified: false
};

const firstLoginSlice = createSlice({
  name: 'firstLogin',
  initialState,
  reducers: {

    firstLogin: (state, action) => {
      state.loading = true;
      state.error = false;
    },

    firstLoginSuccess: (state, action) => {
     
      state.loading = false;
      state.isVerified = true;      
      state.error = false
     
    },
    
    firstLoginFail: (state, action) => {
      
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload;

    },
   
  },
});

export const {
  firstLogin,
  firstLoginSuccess,
  firstLoginFail,
  
} = firstLoginSlice.actions;

export default firstLoginSlice.reducer;