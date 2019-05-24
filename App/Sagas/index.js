import { takeLatest, takeEvery, all } from 'redux-saga/effects'
import API from '../Services/Api'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/AuthRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getLogin } from './LoginSagas'
import { getRegister } from './RegisterSagas'
import { getLogout } from './LogoutSagas'

import { getAuthed } from './AuthedSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.createGitHub()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(LoginTypes.LOGIN_REQUEST, getLogin),
    takeLatest(LoginTypes.REGISTER_REQUEST, getRegister),
    takeLatest(LoginTypes.HANDLE_LOGOUT, getLogout),

    takeLatest(LoginTypes.LOGIN_SUCCESS, getAuthed),
    takeLatest(LoginTypes.REGISTER_SUCCESS, getAuthed),
    takeLatest(LoginTypes.AUTO_LOGIN, getAuthed),
    // takeLatest(ac => ac.type === 'LOGOUT' && Object.keys(ac).length === 1, getLogout),

    // some sagas receive extra parameters in addition to an action
  ])
}
