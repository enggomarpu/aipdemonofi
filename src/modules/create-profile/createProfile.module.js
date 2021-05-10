import createProfileSlice from '../../reducers/create-profile/createProfile.reducer';
import { createProfileRootSaga } from '../../sagas/create-profile/createProfile.saga';

export default {
    reducer: createProfileSlice,
    saga: createProfileRootSaga
};
