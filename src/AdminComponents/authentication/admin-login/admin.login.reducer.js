import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  loading: false,
  error: false,
  errorMessage: '',
  showOtp: false,
  otpSucceded: false
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    success: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.showOtp = true;
      state.error = false;
    },
    errorLogin: (state, action) => {
      
      state.errorMessage = action.payload;
      state.loading = false;
      state.error = true;
    },
    verifyOTP: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    verifyOTPSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.verifyError = false;
      state.otpSucceded = true;
      state.errorMessage = '';
      state.type = action.type;
    },
    verifyOTPFail: (state, action) => {
      state.loading = false;
      state.verifyError = true;
      state.errorMessage = action.payload;
    },
    resendOTP: (state, action) => {
      state.loading = true;
      state.resendError = false
    },
    resendOTPSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.resendError = false;
      state.errorMessage = '';
      state.type = action.type;
    },
    resendOTPFail: (state, action) => {
      state.loading = false;
      state.resendError = true;
      state.errorMessage = action.payload;
    },
    
  },
});
export const {
  login,
  success,
  errorLogin,
  verifyOTP,
  verifyOTPSuccess,
  resendOTP,
  resendOTPFail,
  verifyOTPFail,
  resendOTPSuccess,
} = loginSlice.actions;
export default loginSlice.reducer;