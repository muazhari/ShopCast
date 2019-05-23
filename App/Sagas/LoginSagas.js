import { put, call } from 'redux-saga/effects'
import firebase from 'firebase'
import AuthActions from '../Redux/AuthRedux'

// attempts to signin
export function* getLogin({ username, password }) {
  if (password === '') {
    const error = { message: 'BLANK PASSWORD' }
    yield put(AuthActions.loginFailure(error))
  } else {
    try {
      const auth = firebase.auth()
      const result = yield call([auth, auth.signInWithEmailAndPassword], username, password)
      yield put(AuthActions.loginSuccess(result.user))

      console.tron.log(`Firebase signin success. ${result.email}`)
    } catch (err) {
      const error = { code: err.code, message: err.message }
      yield put(AuthActions.loginFailure(error))

      console.tron.log(`Firebase signin failed. ${error.message}`)
    }
  }
}
