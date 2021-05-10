import createProfileSlice from './createProfile.reducer';
import { createProfileRootSaga } from './createProfile.saga';

export default {
    reducer: createProfileSlice,
    saga: createProfileRootSaga
};
