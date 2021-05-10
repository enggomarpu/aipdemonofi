import { takeEvery, put, all } from "redux-saga/effects";
import axios from 'axios';
//import httpService from "../../shared/http.service";

import { firstLogin, firstLoginSuccess, firstLoginFail, } from "./firstlogin.reducer";
import service from "../../../service/service";

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



export function* firstLoginRootSaga() {
  yield all([
    takeEvery(firstLogin, firstLoginSaga),
  ]);
}
  