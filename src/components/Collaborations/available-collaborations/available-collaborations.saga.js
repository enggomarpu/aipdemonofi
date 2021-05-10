import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  getData,
  setData,
  saveData,
  success,
  error
} from './available-collaborations.redux'
import service from "../../../service/service";

export function* getDataSaga(action) {
  try {
    let response = yield service.get('collaboration-request/all-approved', {});
    yield put(setData(response.data));
    yield put(success());
  } catch(err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* availableCollabrationRootSaga() {
    yield all([
        //all listen multiple calls
      takeEvery(getData, getDataSaga),
    ]);
  }

