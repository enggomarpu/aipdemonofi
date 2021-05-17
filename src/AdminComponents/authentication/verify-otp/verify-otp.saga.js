import { takeEvery, put, all } from "redux-saga/effects";
import {
  verifyOTP,
  verifyOTPSuccess,
  resendOTP,
  resendOTPSuccess,
  verifyOTPFail,
  resendOTPFail
} from './verify-otp.reducer'
import service from "../../../service/service";


export function* verifyOTPSaga(action) {
  const data = {
    Email: action.payload.Email,
    VerificationCode: parseInt(action.payload.VerificationCode)
  };
  try {
    const response = yield service.post('verify-two-factor', data);
    localStorage.setItem("user-info", JSON.stringify(response.data));
    yield put(verifyOTPSuccess(response));
  } catch (err) {
    yield put(verifyOTPFail(service.getErrorDetails(err.response)));
  }
}

export function* resendOTPSaga(action) {
  const data = {
    Email: action.payload.Email
  };
  try {
    const response = yield service.post('resend-two-factor', data);
    yield put(resendOTPSuccess(response));
  } catch (err) {
    yield put(resendOTPFail(service.getErrorDetails(err.response)));
  }
}

export function* verifyOTPRootSaga() {
  yield all([
    takeEvery(verifyOTP, verifyOTPSaga),
    takeEvery(resendOTP, resendOTPSaga)
  ]);
}
  