import { put, select, take, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { is } from 'ramda'
import firebase from 'firebase'
import { AsyncStorage } from 'react-native'

// import GithubActions, { GithubSelectors } from '../Redux/GithubRedux'

import LoggedInActions, { selectLoggedInStatus } from '../Redux/AuthRedux'
import AppStateActions from '../Redux/AppStateRedux'

import Utils from '../Config/Utils'

// exported to make available for tests
// export const { selectAvatar } = GithubSelectors

function getAuthChannel() {
  if (!this.authChannel) {
    this.authChannel = eventChannel(emit => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => emit({ user }))
      return unsubscribe
    })
  }
  return this.authChannel
}

// process STARTUP actions
export function* startup(action) {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    console.tron.display({
      name: '🔥 IGNITE 🔥',
      preview: "Hello, I'm an example of how to log via Reactotron.",
      value: {
        '💃': 'Welcome to the future!',
      },
    })

    console.tron.onCustomCommand('Clear Redux-Persist AsyncStorage', async (payload: string) => {
      await AsyncStorage.clear()
      console.tron.log('async storage cleared.')
    })
  }

  try {
    require('../Config/FireBaseConfig')
    const channel = yield call(getAuthChannel)
    const result = yield take(channel)

    if (result.user) {
      yield put(LoggedInActions.autoLogin(result.user))
    } else {
      yield put(AppStateActions.setRehydrationComplete())
    }
    console.tron.log('✨ Firebase connected. ✨')
  } catch {
    yield put(AppStateActions.setRehydrationStatus(error))
    console.tron.log(`Firebase error. ${{ error }}`)
  }

  // const isLoggedIn = yield select(selectLoggedInStatus)
  // if (isLoggedIn) {
  //   yield put(LoggedInActions.autoLogin())
  // }
}
