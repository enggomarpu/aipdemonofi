import verifyOTPSlice from '../../components/authentication/verify-otp/verifyOtp.reducer'
import { verifyOTPRootSaga } from "../../components/authentication/verify-otp/verifyOtp.saga";

export default {
    reducer: verifyOTPSlice,
    saga: verifyOTPRootSaga
};