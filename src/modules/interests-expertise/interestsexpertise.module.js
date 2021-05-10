import interexperSlice from '../../reducers/interests-expertise/interestsexpertise.reducer';
import { getInterestSkillsRootSaga } from '../../sagas/interests-expertise/interestsexpertise.saga';

export default {
    reducer: interexperSlice,
    saga: getInterestSkillsRootSaga
};
