import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  loading: false,
  verifyError: false,
  resendError: false,
  type: '',
  errorMessage: ''
};

const verifyOtpSlice = createSlice({
  name: 'verifyOtp',
  initialState,
  reducers: {
    verifyOTP: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    verifyOTPSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.verifyError = false;
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
    }
  },
});

export const {
  verifyOTP,
  verifyOTPSuccess,
  resendOTP,
  resendOTPFail,
  verifyOTPFail,
  resendOTPSuccess,
  error
} = verifyOtpSlice.actions;

export default verifyOtpSlice.reducer;