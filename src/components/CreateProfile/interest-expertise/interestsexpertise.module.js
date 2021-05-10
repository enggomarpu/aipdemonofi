import interexperSlice from './interestsexpertise.reducer';
import { getInterestSkillsRootSaga } from './interestsexpertise.saga';

export default {
    reducer: interexperSlice,
    saga: getInterestSkillsRootSaga
};
