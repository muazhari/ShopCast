import { put, call, select } from 'redux-saga/effects'
import firebase from 'firebase'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'

export const { selectIsLoggedIn } = AuthSelectors

// attempts to logout
export function* getLogout(action) {
  const isLoggedIn = yield select(selectIsLoggedIn)
  if (isLoggedIn) {
    try {
      const auth = firebase.auth()
      yield call([auth, auth.signOut])
      yield put(AuthActions.logout())

      console.tron.log('Firebase logout success.')
    } catch (err) {
      const error = { code: err.code, message: err.message }
      // yield put(AuthActions.loginFailure(error))

      console.tron.log(`Firebase logout failed. ${error.message}`)
    }
  }
}
