import { put, call } from 'redux-saga/effects'
import firebase from 'firebase'
import LoginActions from '../Redux/LoginRedux'

// attempts to login
export function* login({ username, password }) {
  let LoginStatus

  // dispatch successful logins
  const handleLoginSuccess = user => {
    LoginStatus = put(LoginActions.loginSuccess(user))
  }

  // dispatch failure
  const handleLoginFailure = error => {
    LoginStatus = put(LoginActions.loginFailure(error))
  }

  if (password === '') {
    handleLoginFailure('BLANK PASSWORD')
  } else {
    try {
      const auth = firebase.auth()
      const result = yield call([auth, auth.signInWithEmailAndPassword], username, password)
      handleLoginSuccess(username)

      console.tron.log(`Firebase login success. ${result}`)
    } catch (err) {
      const error = { code: err.code, message: err.message }
      handleLoginFailure(error)

      console.tron.log(`Firebase login failed. ${error.message}`)
    }
  }
  yield LoginStatus
}
