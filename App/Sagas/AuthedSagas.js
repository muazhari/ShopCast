import { call, put, select, take } from 'redux-saga/effects'
import firebase from 'firebase'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'

import Utils from '../Config/Utils'

export const { selectIsLoggedIn, selectGetCredential } = AuthSelectors

// attempts to signin
export function* getAuthed(action) {
  const isLoggedIn = yield select(selectIsLoggedIn)
  const authCredential = yield select(selectGetCredential)

  try {
    Utils.setUserId(authCredential.email)
    yield put({ type: 'AUTH_SUCCESS' })
    console.tron.log(`Utils.getUserId() ✨${Utils.getUserId()}. ✨`)
  } catch (err) {
    console.tron.log(`Utils.getUserId() failed. ${err.message}`)
  }
}
