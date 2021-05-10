import { takeEvery, put, all, call } from "redux-saga/effects";
import {
  getData,
  setData,
  saveData,
  success,
  error,
  saveDataSuccess
}
  from "./interestsexpertise.reducer";

import service from "../../../shared/http.service";

export function* getDataSaga(action) {
  try {
    let response = yield service.get('user/profile', {});
    yield put(setData(response.data));

    let responseInt = yield service.get('all-interests', {});
    yield put(setData({ AllInterests: responseInt.data }));

    let responseSki = yield service.get('all-skills', {});
    yield put(setData({ AllSkills: responseSki.data }));

    yield put(success());
  } catch (err) {
    yield put(error(service.getErrorDetails(err.response)));
  }
}

export function* saveDataSaga(action) {
  try {
    let response = yield service.put('user/profile', action.payload);
    yield put(saveDataSuccess())
    } catch (err) {
    yield put (error(service.getErrorDetails(err.response)));
  }
}

export function* getInterestSkillsRootSaga() {
  yield all([
    takeEvery(getData, getDataSaga),
    takeEvery(saveData, saveDataSaga),
  ]);
  // yield all([
  //   takeEvery(getUserInterSkills, getUserInterSkillSaga),
  //   takeEvery(getAllInterests, getAllInterestsSaga),
  //   takeEvery(getAllSkills, getAllSkillsSaga),
  //   takeEvery(putInterSkills, putInterSkillsSaga)
  // ]);
}
