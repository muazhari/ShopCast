import { put, call } from 'redux-saga/effects'
import firebase from 'firebase'
import AuthActions from '../Redux/AuthRedux'

// attempts to signup
export function* getRegister({ username, password }) {
  if (password === '') {
    const error = { message: 'BLANK PASSWORD' }
    yield put(AuthActions.registerFailure(error))
  } else {
    try {
      const auth = firebase.auth()
      const result = yield call([auth, auth.createUserWithEmailAndPassword], username, password)
      yield put(AuthActions.egisterSuccess(username))

      console.tron.log(`Firebase signup success. ${result.email}`)
    } catch (err) {
      const error = { code: err.code, message: err.message }
      yield put(AuthActions.registerFailure(error))

      console.tron.log(`Firebase signup failed. ${error.message}`)
    }
  }
}
