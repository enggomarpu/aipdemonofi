import availableCollabrationSlice from './available-collaborations.redux';
import {availableCollabrationRootSaga} from './available-collaborations.saga'

export default {
    reducer: availableCollabrationSlice,
    saga: availableCollabrationRootSaga
};