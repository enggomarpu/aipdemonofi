import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  loading: false,
  error: false,
  errorMessage: '',
  withoutToken: false,
  showOtp: false,
  resendError: false,
  codeSent: false, 
  showTermConds: false,
  isVerified: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {

    firstLogin: (state, action) => {
      state.loading = true;
      state.error = false;
    },

    firstLoginSuccess: (state, action) => {
      console.log('firstloginsuccess', action);
      state.loading = false;
      state.isVerified = true;      
      state.error = false
     
    },
    
    firstLoginFail: (state, action) => {
      
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload;

    },

    login: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    // firstLogin: (state, action) => {
    //   state.loading = false
    // },
    loginSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.error = false;
      state.showOtp = true;
      state.withoutToken = false;
    },
    loginError: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
      state.error = true;
    },
    getWithoutToken: (state, action) => {
      state.error = false
    },
    getWithoutTokenSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.error = false;
      state.withoutToken = true;
    },
    getWithoutTokenFail: (state, action) => {
      state.error = true;
      state.errorMessage = action.payload;
    },
    verifyOTP: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    verifyOTPSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
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
      state.loading = false;
      state.errorMessage = '';
      state.codeSent = state.codeSent;
    },
    resendOTPFail: (state, action) => {
      state.loading = false;
      state.resendError = true;
      state.errorMessage = action.payload;
    }
   
  },
});
export const {
  login,
  firstLogin,
  firstLoginSuccess, 
  firstLoginFail,
  loginSuccess,
  loginError,
  getWithoutToken,
  getWithoutTokenSuccess,
  getWithoutTokenFail,
  verifyOTP,
  verifyOTPSuccess,
  verifyOTPFail,
  resendOTP, 
  resendOTPSuccess,
  resendOTPFail

} = loginSlice.actions;
export default loginSlice.reducer;