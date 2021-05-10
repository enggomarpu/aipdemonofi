import loginSlice from '../../components/authentication/login/login.reducer'
import { loginRootSaga } from "../../components/authentication/login/login.saga";

export default {
    reducer: loginSlice,
    saga: loginRootSaga
};