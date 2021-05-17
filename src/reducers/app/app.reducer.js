import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {}
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appUser: (state, action) => {
      state.userInfo = action.payload;
    }
  },
});
export const { appUser } = appSlice.actions;
export default appSlice.reducer;