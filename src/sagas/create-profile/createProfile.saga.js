import { takeEvery, put, all } from "redux-saga/effects";
import axios from 'axios';
import httpService from "../../shared/http.service";
import service from "../../service/service";


import { getUser, getUserSuccess, getUserFail, postUser, postUserSuccess, postUserFail } from "../../reducers/create-profile/createProfile.reducer";

export function* getUserSaga(action) {

  try {
    //const response = yield httpService.get('user/profile')
    const response = yield service.get('user/profile')
    //const response = yield axios.get(`http://dev-affiliate.aipartnershipscorp.com:8081/user/profile`, action.payload);
    yield put(getUserSuccess(response))
    //console.log(response);
  } catch (err) {
    console.log('createprofilegeterror called')
    //yield put(getUserFail(service.getErrorDetails(err.response)));


  }
}
export function* postUserSaga(action) {
  try {
    const response = yield service.put(`user/profile`, action.payload);
    //const response = yield axios.put(`http://dev-affiliate.aipartnershipscorp.com:8081/user/profile`, action.payload);
    yield put(postUserSuccess(response))

    //console.log(response);
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
