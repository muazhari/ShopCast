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
export const selectAvatar = null

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
    console.tron.log("Hello, I'm an example of how to log via Reactotron.")

    // logging an object for better clarity
    console.tron.log({
      message: 'pass objects for better logging',
      someGeneratorFunction: selectAvatar,
    })

    // fully customized!
    const subObject = { a: 1, b: [1, 2, 3], c: true }
    subObject.circularDependency = subObject // osnap!
    console.tron.display({
      name: '🔥 IGNITE 🔥',
      preview: 'You should totally expand this',
      value: {
        '💃': 'Welcome to the future!',
        subObject,
        someInlineFunction: () => true,
        someGeneratorFunction: startup,
        someNormalFunction: selectAvatar,
      },
    })

    console.tron.onCustomCommand('Clear Redux-Persist AsyncStorage', async (payload: string) => {
      await AsyncStorage.clear()
      console.tron.log('async storage cleared.')
    })
  }
  // const avatar = yield select(selectAvatar)
  //
  // only get if we don't have it yet
  // if (!is(String, avatar)) {
  //   yield put(GithubActions.userRequest('muazhari'))
  // }

  try {
    require('../Config/FireBaseConfig')
    console.tron.log('✨ Firebase connected. ✨')
    const channel = yield call(getAuthChannel)
    const result = yield take(channel)

    if (result.user) {
      yield put(LoggedInActions.autoLogin(result.user))
    } else {
      yield put(AppStateActions.setRehydrationComplete())
    }
  } catch (error) {
    console.tron.log(`Firebase error. ${{ error }}`)
    yield put(AppStateActions.setRehydrationStatus(error))
  }

  // const isLoggedIn = yield select(selectLoggedInStatus)
  // if (isLoggedIn) {
  //   yield put(LoggedInActions.autoLogin())
  // }
}
