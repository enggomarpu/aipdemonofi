import { takeEvery, put, all } from "redux-saga/effects";
import {
    rejectCollaborationRequest,
    approveCollaborationRequest,
    rejectSuccess,
    approveSuccess,
    getAllComments,
    commentsSuccess,
    error,
    success
} from './request-view.reducer'
import service from "../../../service/service";

export function* approveCollaborationRequestSaga(action) {
  try {
    const response = yield service.get(`collaboration-request/admim-approve-collab-request/${action.payload.CollaborationRequestId}`, {});
    yield put(approveSuccess());
    yield put(success());
  } catch (err) {
      console.log(err);
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* getAllCommentsSaga(action) {
  try {
    const response = yield service.get(`collaboration-request/all-comments/${action.payload.CollaborationRequestId}`, {});
    yield put(commentsSuccess(response.data));
    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}
export function* rejectCollaborationRequestSaga(action) {
  console.log('reject comments', action);
  try {
    const response = yield service.post(`collaboration-request/admim-reject-collab-request/${action.payload.CollaborationRequestId}`, action.payload.data );
    yield put(rejectSuccess());
    yield put(success());
  } catch (err) {
      console.log(err);
    yield put(error(service.getErrorDetails(err.response)));
  }
}
export function* CollaborationViewRootSaga() {
  yield all([
    takeEvery(rejectCollaborationRequest, rejectCollaborationRequestSaga),
    takeEvery(approveCollaborationRequest, approveCollaborationRequestSaga),
    takeEvery(getAllComments, getAllCommentsSaga)
    
  ]);
}
