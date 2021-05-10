import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  get,
  getCommentSuccess,
  getComment,
  success,
  error,
  getSuccess,
  saveSuccess,
  save
} from './collaboration-detail.redux'
import service from "../../../service/service";

export function* getDataSaga(action) {
  try {
    let response = yield service.get('collaboration-request/' + action.payload.CollaborationRequestId, {});
    let data =response.data;
    response = yield service.get('collaboration-request/check-collaboration-comment/' + action.payload.CollaborationRequestId, {});
    yield put(getSuccess({requestdata: data, checkCollaboration: response.data}));
    yield put(success());
  } catch(err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* getCommentDataSaga(action) {
  try {
    let data = {};
    let response = yield service.put(`collaboration-request/get-request-comment/${action.payload}`, {});
    data = response.data;
    data.Comment = data.CollaborationRequestComment;
    yield put(getCommentSuccess(data));
    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* saveDataSaga(action) {
  try {
    let response;
    if(action.payload.commentId){
    response = yield service.put(`collaboration-request/update-request-comment/${action.payload.commentId}`, action.payload.data);
    }
    else{
      response = yield service.put(`collaboration-request/request-to-collaborate/${action.payload.requestId}`, action.payload.data);

    }
    yield put(saveSuccess());
    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* collaborationDetailRootSaga() {
    yield all([
        //all listen multiple calls
      takeEvery(get, getDataSaga),
    takeEvery(save, saveDataSaga),
    takeEvery(getComment, getCommentDataSaga),
    ]);
  }

