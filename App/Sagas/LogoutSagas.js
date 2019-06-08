import { call, put, select } from 'redux-saga/effects'
import firebase from 'firebase'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import Utils from '../Config/Utils'
import SocketUtils from '../Services/SocketUtils'

export const { selectIsLoggedIn } = AuthSelectors

// attempts to logout
export function* getLogout(action) {
  const isLoggedIn = yield select(selectIsLoggedIn)

  try {
    if (isLoggedIn) {
      const auth = firebase.auth()
      yield call([auth, auth.signOut])

      yield SocketUtils.emitClientDisconnect()
      Utils.setUserId(null)

      yield put(AuthActions.logoutSuccess())

      console.tron.log('Firebase logout success.')
    }
  } catch (err) {
    const error = { code: err.code, message: err.message }
    yield put(AuthActions.loginFailure(error))

    console.tron.log(`Firebase logout failed. ${error.message}`)
  }
}
