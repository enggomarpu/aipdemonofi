import firstLoginSlice from '../../components/authentication/first-login/firstlogin.reducer'
import { firstLoginRootSaga } from "../../components/authentication/first-login/firstLogin.saga";

export default {
    reducer: firstLoginSlice,
    saga: firstLoginRootSaga
};