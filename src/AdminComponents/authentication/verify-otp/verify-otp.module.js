import verifyOTPSlice from './verify-otp.reducer'
import { verifyOTPRootSaga } from "./verify-otp.saga";

export default {
    reducer: verifyOTPSlice,
    saga: verifyOTPRootSaga
};