import verifyOTPSlice from './verifyOtp.reducer'
import { verifyOTPRootSaga } from "./verifyOtp.saga";

export default {
    reducer: verifyOTPSlice,
    saga: verifyOTPRootSaga
};