import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['credential'],
  loginFailure: ['error'],
  registerRequest: ['username', 'password'],
  registerSuccess: ['username'],
  registerFailure: ['error'],
  logout: ['error'],
  handleLogout: null,
  autoLogin: ['credential'],
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  credential: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = state => {
  return { ...state, fetching: true }
}

// we've successfully logged in
export const success = (state, { credential }) => {
  return { ...state, fetching: false, error: null, credential }
}

// we've had a problem logging in
export const failure = (state, { error }) => {
  return { ...state, fetching: false, error }
}

// we've logged out
export const logout = (state, { error }) => {
  if (!error) {
    return INITIAL_STATE
  }
  const newState = INITIAL_STATE
  return { ...newState, error }
}

export const handleLogout = state => INITIAL_STATE

// startup saga invoked autoLogin
export const autoLogin = (state, { credential }) => {
  return { ...state, credential }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.REGISTER_REQUEST]: request,
  [Types.REGISTER_SUCCESS]: success,
  [Types.REGISTER_FAILURE]: failure,
  [Types.LOGOUT]: logout,
  [Types.HANDLE_LOGOUT]: handleLogout,
  [Types.AUTO_LOGIN]: autoLogin,
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
  // Is the current user logged in?
  selectIsLoggedIn: state => state.credential !== null,
}
