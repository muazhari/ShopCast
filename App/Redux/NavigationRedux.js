import { NavigationActions, StackActions } from 'react-navigation'
import AppNavigation from '../Navigation/AppNavigation'

const { navigate } = NavigationActions
const { reset } = StackActions
const { getStateForAction } = AppNavigation.router

const INITIAL_STATE = getStateForAction(navigate({ routeName: 'LoadingScreen' }))
const NOT_LOGGED_IN_STATE = getStateForAction(
  reset({
    index: 0,
    actions: [navigate({ routeName: 'NotLoggedInStack' })],
  }),
  getStateForAction(NavigationActions.init())
)
const LOGGED_IN_STATE = getStateForAction(
  reset({
    index: 0,
    actions: [navigate({ routeName: 'LoggedInStack' })],
  }),
  getStateForAction(NavigationActions.init())
)
/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
// const navigateTo = routeName => () => navigate({ routeName })

export const reducer = (state = INITIAL_STATE, action) => {
  console.tron.log(`[Navigation Redux] Action Type listened : ${action.type}`)
  let newState
  switch (action.type) {
    case 'SET_REHYDRATION_COMPLETE':
      return NOT_LOGGED_IN_STATE
    case 'LOGOUT':
      return NOT_LOGGED_IN_STATE
    case 'LOGIN_SUCCESS':
      return LOGGED_IN_STATE
    case 'AUTO_LOGIN':
      return LOGGED_IN_STATE
    default:
      newState = getStateForAction(action, state)
  }

  return newState || state
}
