import firebase from 'firebase'

import { call, put } from 'redux-saga/effects'
import AuthActions from '../Redux/AuthRedux'
// import { SignUpSelectors } from '../Redux/SignUpRedux'

export function* getSignUp({ username, password }) {
  if (password === '') {
    const error = { message: 'BLANK PASSWORD' }
    yield put(AuthActions.signupFailure(error))
  } else {
    try {
      const auth = firebase.auth()
      const result = yield call([auth, auth.createUserWithEmailAndPassword], username, password)
      yield put(AuthActions.signupSuccess(username))

      console.tron.log(`Firebase signup success. ${result.email}`)
    } catch (error) {
      const err = { code: error.code, message: error.message }
      yield put(AuthActions.signupFailure(err))

      console.tron.log(`Firebase signup failed. ${error.message}`)
    }
  }
}
