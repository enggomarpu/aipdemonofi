import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  login,
  success,
  errorLogin,
  verifyOTP,
  verifyOTPSuccess,
  resendOTP,
  resendOTPSuccess,
  verifyOTPFail,
  resendOTPFail
} from './admin.login.reducer'
import service from "../../../service/service";

export function* loginSaga(action) {
  try {
    const response = yield service.post('admin-login', action.payload);
    yield put(success(response));
  } catch (err) {
   
    yield put(errorLogin(service.getErrorDetails(err.response)));
    
  }
}
export function* verifyOTPSaga(action) {
  const data = {
    Email: action.payload.Email,
    VerificationCode: parseInt(action.payload.VerificationCode),
    Password: action.payload.Password,
    deviceToken: action.payload.deviceToken
  };
  try {
    const response = yield service.post('verify-admin-two-factor', data);
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

export function* loginRootSaga() {
  yield all([
    takeEvery(login, loginSaga),
    takeEvery(verifyOTP, verifyOTPSaga),
    takeEvery(resendOTP, resendOTPSaga)
  ]);
}
