import { put, select } from 'redux-saga/effects'
import { is } from 'ramda'
import firebase from 'firebase'
import GithubActions, { GithubSelectors } from '../Redux/GithubRedux'

import LoggedInActions, { isLoggedIn, selectLoggedInStatus } from '../Redux/LoginRedux'
import AppStateActions from '../Redux/AppStateRedux'

// exported to make available for tests
export const { selectAvatar } = GithubSelectors

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
  }
  const avatar = yield select(selectAvatar)

  // only get if we don't have it yet
  if (!is(String, avatar)) {
    yield put(GithubActions.userRequest('muazhari'))
  }

  try {
    const Fire = require('../Config/FireBaseConfig')
    yield put(AppStateActions.setRehydrationComplete())
    console.tron.log('Firebase connected. ✨')
  } catch (error) {
    console.tron.log(`Firebase error. ${{ error }}`)
    yield put(AppStateActions.setRehydrationStatus(error))
  }

  const isLoggedIn = yield select(selectLoggedInStatus)
  if (isLoggedIn) {
    yield put(LoggedInActions.autoLogin())
  }
}
