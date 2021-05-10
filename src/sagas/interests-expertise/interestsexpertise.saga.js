import { takeEvery, put, all } from "redux-saga/effects";
import { 
  getAllSkills, getAllSkillsSuccess, getAllSkillsFail, 
  getUserInterSkills, getUserInterSkillsSuccess, getUserInterSkillsFail,
  getAllInterests, getAllInterestsSuccess, getAllInterestsFail, putInterSkillsSuccess, putInterSkillsFail, putInterSkills 
  } 
  from "../../reducers/interests-expertise/interestsexpertise.reducer";

import service from "../../service/service";

export function* getUserInterSkillSaga(action) {
  try {
    const response = yield service.get('user/profile');
    //yield put(getWithoutTokenSuccess(response));
    console.log('successs userinter skills', response);
    yield put(getUserInterSkillsSuccess(response));
  } catch (err) {
    console.log('error userinter skills');
    yield put(getUserInterSkillsFail(service.getErrorDetails(err.response)));
  } 
}
export function* getAllInterestsSaga(action) {
  try {
    const response = yield service.get('all-interests')
    yield put(getAllInterestsSuccess(response))
  } catch (err) {
    yield put(getAllInterestsFail(service.getErrorDetails(err.response)));
  } 
}
export function* getAllSkillsSaga(action) {
  try {
    const response = yield service.get('all-skills')
    yield put(getAllSkillsSuccess(response))
  } catch (err) {
    yield put(getAllSkillsFail(service.getErrorDetails(err.response)));
  } 
}
export function* putInterSkillsSaga(action) {
  try {
    const response = yield service.put('user/profile', action.payload)
    yield put(putInterSkillsSuccess(response))
  } catch (err) {
    yield put(putInterSkillsFail(service.getErrorDetails(err.response)));
  } 
}
export function* getInterestSkillsRootSaga() {
  yield all([
    takeEvery(getUserInterSkills, getUserInterSkillSaga),
    takeEvery(getAllInterests, getAllInterestsSaga),
    takeEvery(getAllSkills, getAllSkillsSaga),
    takeEvery(putInterSkills, putInterSkillsSaga)

  ]);
}
  