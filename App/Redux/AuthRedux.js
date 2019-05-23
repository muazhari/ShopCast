import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signinRequest: ['username', 'password'],
  signinSuccess: ['username'],
  signinFailure: ['error'],
  signupRequest: ['username', 'password'],
  signupSuccess: ['username'],
  signupFailure: ['error'],
  logout: null,
  autoSignIn: null,
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  username: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => {
  return { ...state, fetching: true }
}

// we've successfully logged in
export const success = (state, { username }) => {
  return { ...state, fetching: false, error: null, username }
}

// we've had a problem logging in
export const failure = (state, { error }) => {
  return { ...state, fetching: false, error }
}

// we've logged out
export const logout = state => INITIAL_STATE

// startup saga invoked autoSignIn
export const autoSignIn = state => state

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGNIN_REQUEST]: request,
  [Types.SIGNIN_SUCCESS]: success,
  [Types.SIGNIN_FAILURE]: failure,
  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure,
  [Types.LOGOUT]: logout,
  [Types.AUTO_SIGNIN]: autoSignIn,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = authState => authState.username !== null

export const selectLoggedInStatus = state => isLoggedIn(state.auth)
