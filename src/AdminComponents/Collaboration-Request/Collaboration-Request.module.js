import colabRequestSlice from './Collaboration-Request.redux';
import {collaborationRequestRootSaga} from './Collaboration-Request.saga'

export default {
    reducer: colabRequestSlice,
    saga: collaborationRequestRootSaga
};