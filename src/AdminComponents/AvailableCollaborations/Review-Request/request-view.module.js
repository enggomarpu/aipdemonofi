import CollaborationViewSlice from './request-view.reducer';
import {CollaborationViewRootSaga} from "./request-view.saga";

export default {
    reducer: CollaborationViewSlice,
    saga: CollaborationViewRootSaga
};