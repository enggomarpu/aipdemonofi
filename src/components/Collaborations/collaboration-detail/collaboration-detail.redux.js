import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  comment: {},
  loading: false,
  error: false,
  stateUpdated: false,
  errorMessage: ''
};

const collaborationDetailSlice = createSlice({
  name: 'collaboration_detail',
  initialState,
  reducers: {
    get: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    getSuccess: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      state.type = action.type;
    },
    getComment: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    getCommentSuccess: (state, action) => {
      state.comment = { ...state.data, ...action.payload };
      state.type = action.type;
    },
    save: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    saveSuccess: (state, action) => {
      state.type = action.type;
    },
    success: (state, action) => {
      state.loading = false;
      state.type = '';
    },
    error: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
      state.type = action.type;
    },
    resetState: (state, action) => {
      state.data={};
      state.comment={};
    }
  }
});
export const {
  get,
  getSuccess,
  getComment,
  getCommentSuccess,
  save,
  saveSuccess,
  success,
  error,
  resetState
} = collaborationDetailSlice.actions;
export default collaborationDetailSlice.reducer;