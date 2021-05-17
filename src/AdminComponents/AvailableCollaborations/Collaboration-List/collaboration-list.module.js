import CollaborationSlice from './collaboration-list.reducer'
import { CollaborationRootSaga } from "./collaboration-list.saga";

export default {
    reducer: CollaborationSlice,
    saga: CollaborationRootSaga
};