import firstLoginSlice from './firstlogin.reducer'
import { firstLoginRootSaga } from "./firstLogin.saga";

export default {
    reducer: firstLoginSlice,
    saga: firstLoginRootSaga
};