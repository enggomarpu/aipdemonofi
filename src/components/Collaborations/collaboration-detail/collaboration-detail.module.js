import collaborationDetailSlice from './collaboration-detail.redux';
import {collaborationDetailRootSaga} from './collaboration-detail.saga'

export default {
    reducer: collaborationDetailSlice,
    saga: collaborationDetailRootSaga
};