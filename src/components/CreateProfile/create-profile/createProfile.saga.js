import { takeEvery, put, all } from "redux-saga/effects";
import service from "../../../service/service";


import { 
  getUser, getUserSuccess, getUserFail, postUser, 
  postUserSuccess, postUserFail } from "./createProfile.reducer";

export function* getUserSaga(action) {
try {
    const response = yield service.get('user/profile', {})
    yield put(getUserSuccess(response))
    
} catch (err) {
  yield put(getUserFail(service.getErrorDetails(err.response)));
  }
}
export function* postUserSaga(action) {
  try {
    const response = yield service.put(`user/profile`, action.payload);
    yield put(postUserSuccess(response))
  } catch (err) {
    yield put(postUserFail(service.getErrorDetails(err.response)));
  }
}

export function* createProfileRootSaga() {
  yield all([
    takeEvery(getUser, getUserSaga),
    takeEvery(postUser, postUserSaga),

  ]);
}
