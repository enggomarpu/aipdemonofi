import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  loading: false,
  error: false,
  errorMessage: '',
  type: '',
  stateUpdated: false,
  dataPutted: false,
  putFail: false,
  userInterests: [],
  userSkills: [],
  allInterests: [],
  allSkills: []

};

const interexperSlice = createSlice({
  name: 'interexp',
  initialState,
  reducers: {
    getUserInterSkills: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    getUserInterSkillsSuccess: (state, action) => {
      console.log('interest expertise reducer called', action.payload)
      state.userInterests = action.payload.data.Interests;
      state.userSkills = action.payload.data.Skills;
      state.stateUpdated = true;
      state.loading = false;
      state.error = false;
    },
    getUserInterSkillsFail: (state, action) => {
      state.error = true;
      state.loading = false
    },
    getAllInterests: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    getAllInterestsSuccess: (state, action) => {
      console.log('allinterests', action.payload)
      state.allInterests = action.payload.data
      state.loading = false;
      //state.stateUpdated = true
      state.error = false;
    },
    getAllInterestsFail: (state, action) => {
      state.error = true;
      state.loading = false
    },
    getAllSkills: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    getAllSkillsSuccess: (state, action) => {
      console.log('allskills', action.payload)
      state.allSkills = action.payload.data;
      state.loading = false;
      state.error = false;
    },
    getAllSkillsFail: (state, action) => {
      state.loading = false
      state.error = true;
    },
    putInterSkills: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    putInterSkillsSuccess: (state, action) => {

      state.loading = false;
      state.error = false;
      state.dataPutted = true;

    },
    putInterSkillsFail: (state, action) => {
      state.error = true;
      state.errorMessage = action.payload
      state.putFail = true;
    }

  },
});
export const {

  getUserInterSkills,
  getUserInterSkillsSuccess,
  getUserInterSkillsFail,
  getAllInterests,
  getAllInterestsSuccess,
  getAllInterestsFail,
  getAllSkills,
  getAllSkillsSuccess,
  getAllSkillsFail,
  putInterSkills,
  putInterSkillsSuccess,
  putInterSkillsFail


} = interexperSlice.actions;
export default interexperSlice.reducer;