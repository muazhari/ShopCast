import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setRehydrationComplete: null,
  setRehydrationStatus: null,
})

export const AppStateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rehydrationComplete: false,
  rehydrationStatus: null,
})

/* ------------- Reducers ------------- */

// rehydration is complete
export const setRehydrationComplete = (state: Object) => {
  return { ...state, rehydrationComplete: true }
}

// rehydration is complete
export const setRehydrationStatus = (state, { status }) => {
  return { ...state, rehydrationStatus: status }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_REHYDRATION_COMPLETE]: setRehydrationComplete,
  [Types.SET_REHYDRATION_STATUS]: setRehydrationStatus,
})

/* ------------- Selectors ------------- */

// Is rehydration complete?
export const isRehydrationComplete = (state: Object) => state.rehydrationComplete
