import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  errorMessage: '',
  rejected: false,
  approved: false,
  comments: [],
  CollabationRequestData: {}
};

const CollaborationViewSlice = createSlice({
  name: 'collaborationViewRequest',
  initialState,
  reducers: {

    rejectCollaborationRequest: (state, action) => {
      state.loading = true;
      state.error = false;
      state.type = action.type;
    },

    approveCollaborationRequest: (state, action) => {
      state.loading = false;
      state.error = false;
      state.type = action.type;
    },
    rejectSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.type = action.type;
    },
    getAllComments: (state, action) => {
      state.loading = false;
      state.error = false;
    },
    commentsSuccess: (state, action) => {
      state.comments = action.payload
      state.loading = false;
      state.error = false;
    },
    approveSuccess: (state, action) => {
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
      state.error = true;
    },

  },
});
export const {
  rejectCollaborationRequest,
  approveCollaborationRequest,
  rejectSuccess,
  approveSuccess,
  commentsSuccess,
  getAllComments,
  error,
  success

} = CollaborationViewSlice.actions;
export default CollaborationViewSlice.reducer;
