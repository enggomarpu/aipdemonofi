import loginSlice from './login.reducer'
import { loginRootSaga } from "./login.saga";

export default {
    reducer: loginSlice,
    saga: loginRootSaga
};