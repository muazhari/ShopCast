// import { combineReducers } from 'redux'
import { persistCombineReducers } from 'redux-persist'
import ReduxPersist from '../Config/ReduxPersist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas'

const config = ReduxPersist.storeConfig

/* ------------- Assemble The Reducers ------------- */
export const reducers = persistCombineReducers(config, {
  nav: require('./NavigationRedux').reducer,
  login: require('./LoginRedux').reducer,
  appState: require('./AppStateRedux').reducer,
  github: require('./GithubRedux').reducer,
  search: require('./SearchRedux').reducer,
})

export default () => {
  let { store, sagasManager, sagaMiddleware } = configureStore(reducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas)
      })
    })
  }

  return store
}
