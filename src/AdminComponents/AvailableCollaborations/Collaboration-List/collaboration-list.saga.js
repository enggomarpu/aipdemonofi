import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  get,
  getSuccess,
  getCollaboration,
  getCollaborationSuccess,
  deleteCollaboration,
  deleteSuccess,
  success,
  error,
} from './collaboration-list.reducer'
import service from "../../../service/service";

export function* getDataSaga(action) {
  try {
    const response = yield service.get('collaboration-request', {});
    yield put(getSuccess(response.data));
    yield put(success());
  } catch (err) {
      console.log(err);
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* deleteCollaborationSaga(action) {
  try {
    const response = yield service.delete(`collaboration-request/${action.payload.CollaborationRequestId}`, {});
    yield put(deleteSuccess());
    yield put(success());
  } catch (err) {
      console.log(err);
    yield put(error(service.getErrorDetails(err.response)));
  }
} 

export function* getCollaborationSaga(action) {
  try {
    const response = yield service.get(`collaboration-request/${action.payload.CollaborationRequestId}`, {});
    yield put(getCollaborationSuccess(response.data));
    yield put(success());
  } catch (err) {
      console.log(err);
    yield put(error(service.getErrorDetails(err.response)));
  }
}


export function* CollaborationRootSaga() {
  yield all([
    takeEvery(get, getDataSaga),
    takeEvery(deleteCollaboration, deleteCollaborationSaga),
    takeEvery(getCollaboration, getCollaborationSaga),
  ]);
}
