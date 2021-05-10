import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  success,
  error,
  getSuccess,
  saveSuccess,
  get,
  save
} from './Collaboration-Request.redux'
import service from "../../service/service";

export function* getDataSaga(action) {
  try {
    let data = {};
    if (action.payload) {
      let response = yield service.get(`collaboration-request/${action.payload}`, {});
      data = response.data;
    }
    let response = yield service.get('all-skills', {});
    let skills = response.data.map((item) => {
      return {
        value: item.SkillId,
        label: item.SkillName,
      }
    });
    let priorityOptions = [
      { label: "High", value: "High" },
      { label: "Low", value: "Low" }
    ];
    yield put(getSuccess({ ...data, skills: skills, priorityOptions: priorityOptions }));
    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* saveDataSaga(action) {
  try {
    let response;
    action.payload.data.PriorityLevel = action.payload.data.PriorityLevel.value;
    if(action.payload.requestId){
      response = yield service.put(`collaboration-request/${action.payload.requestId}`, action.payload.data);
    }
    else{
      response = yield service.post(`collaboration-request`, action.payload.data);
    }
    yield put(saveSuccess());
    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* collaborationRequestRootSaga() {
  yield all([
    takeEvery(get, getDataSaga),
    takeEvery(save, saveDataSaga)
  ]);
}


