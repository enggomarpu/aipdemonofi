import loginSlice from './admin.login.reducer'
import { loginRootSaga } from "./admin.login.saga";

export default {
    reducer: loginSlice,
    saga: loginRootSaga
};