import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  data: {},
  loading: false,
  errorMessage: '',
  type: ''
};

const colabRequestSlice = createSlice({
  name: 'colab_request',
  initialState,
  reducers: {
    get: (state, action) => {
      state.loading = true;
      state.type = action.type;
    },
    getSuccess: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      state.data.StartDate = format(new Date(state.data.StartDate), 'yyyy-MM-dd');
      state.data.EndDate = format(new Date(state.data.EndDate), 'yyyy-MM-dd');
      state.data.PriorityLevel = {
        value: state.data.PriorityLevel,
        label: state.data.PriorityLevel
      };
      state.data.RequestSkills = state.data.RequestSkills.map((item) => {
        return {
          value: item.SkillId,
          label: item.SkillName,
        }
      });
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
    }
  }
});
export const {
  get,
  getSuccess,
  save,
  saveSuccess,
  success,
  error
} = colabRequestSlice.actions;
export default colabRequestSlice.reducer;