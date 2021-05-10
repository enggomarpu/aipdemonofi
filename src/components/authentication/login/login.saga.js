import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  login,
  loginSuccess,
  loginError,
  getWithoutToken,
  getWithoutTokenSuccess,
  getWithoutTokenFail,
  verifyOTP,
  verifyOTPSuccess,
  verifyOTPFail,
  firstLogin,
  firstLoginSuccess,
  firstLoginFail,
  resendOTP,
  resendOTPSuccess,
  resendOTPFail

} from './login.reducer'
import service from "../../../service/service";

export function* loginSaga(action) {
  try {
    const response = yield service.post('login', action.payload);
    yield put(loginSuccess(response));
    // if (response.data.IsFirstLogin) {
    //   yield call(firstLogin, firstLoginSaga);
    // }
  } catch (err) {
    yield put(loginError(service.getErrorDetails(err.response)));
  }
}

export function* verifyOTPSaga(action) {
  const data = {
    Email: action.payload.Email,
    Password: action.payload.Password,
    VerificationCode: parseInt(action.payload.VerificationCode),
    deviceToken: action.payload.deviceToken
  };
  try {
    const response = yield service.post('verify-affiliate-two-factor', data);
    localStorage.setItem("user-info", JSON.stringify(response.data));
    yield put(verifyOTPSuccess(response));
  } catch (err) {
    yield put(verifyOTPFail(service.getErrorDetails(err.response)));
  }
}

export function* getWithoutTokenSaga(action) {
  try {
    const response = yield service.get(`user-first-login-detail/${action.payload}`);
    yield localStorage.setItem("user-info", JSON.stringify(response.data));
    yield put(getWithoutTokenSuccess(response));
  } catch (err) {
    yield put(getWithoutTokenFail(service.getErrorDetails(err.response)));
  }
}

export function* firstLoginSaga(action) {
  try {
    const response = yield service.get(`user/verify-token/${action.payload}`)
    //const response = yield axios.get(`http://dev-affiliate.aipartnershipscorp.com:8081/user/verify-token/${action.payload}`);
    yield put(firstLoginSuccess(response));
    //console.log(response);
  } catch (err) {
    yield put(firstLoginFail(service.getErrorDetails(err.response)));
    
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
    takeEvery(getWithoutToken, getWithoutTokenSaga),
    takeEvery(verifyOTP, verifyOTPSaga),
    takeEvery(firstLogin, firstLoginSaga),
    takeEvery(resendOTP, resendOTPSaga)
    
  ]);
}
