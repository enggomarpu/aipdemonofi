import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: {},
  loading: false,
  error: false,
  type: '',
  getError: false,
  postError: false,
  errorMessage: '',
  isData: false,
  
};

const createProfileSlice = createSlice({
  name: 'createProfile',
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.loading = true;
      state.getError = false;
    },
    getUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      //state.errorM = true;
      state.errorMessage = ''
      state.isData = true;
      state.getError = false
      state.type = action.type;
    },
    getUserFail: (state, action) => {
      //state.user = { ...state.user, ...action.payload.data };
      state.loading = false;
      state.getError = true;
      state.errorMessage = action.payload;
      state.type = action.type;
    },
    postUser: (state, action) => {
        //state.user = { ...state.user, ...action.payload.data };
        state.loading = false;
        state.postError = false;
        state.type = action.type;
      },
    postUserSuccess: (state, action) => {
    //state.user = { ...state.user, ...action.payload.data };
    state.loading = false;
    state.postError = false;
    state.errorMessage = ''
    state.type = action.type;
    },
    
    postUserFail: (state, action) => {
    //state.user = { ...state.user, ...action.payload.data };
    state.loading = false;
    state.postError = true;
    state.errorMessage = action.payload;
    state.type = action.type;
    },
      
  },
});

export const {
    getUser,
    getUserSuccess,
    getUserFail,
    postUser,
    postUserSuccess,
    postUserFail
} = createProfileSlice.actions;

export default createProfileSlice.reducer;