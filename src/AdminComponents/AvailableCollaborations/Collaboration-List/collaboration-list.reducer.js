import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: false,
  errorMessage: '',
  CollabationRequestData: {}
};

const CollaborationSlice = createSlice({
  name: 'collaborationlist',
  initialState,
  reducers: {
    get: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    getSuccess: (state, action) => {
      state.data = action.payload;
      state.type = action.type;
    },
    getCollaboration: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    getCollaborationSuccess: (state, action) => {
      state.CollabationRequestData = { ...state.data, ...action.payload };
      state.type = action.type;
    },
    deleteCollaboration: (state, action) => {
      state.loading = true;
      state.error = false;
      state.type = action.type;
    },
    deleteSuccess:(state, action) => {
      state.loading = false;
      state.error = false;
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
   
  },
});
export const {
  get,
  getSuccess,
  getCollaboration,
  getCollaborationSuccess,
  deleteCollaboration,
  deleteSuccess,
  success,
  error,
 
} = CollaborationSlice.actions;
export default CollaborationSlice.reducer;