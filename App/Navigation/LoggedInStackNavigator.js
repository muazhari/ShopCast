import { createStackNavigator } from 'react-navigation'
import AuthenticatedScreen from '../Containers/AuthenticatedScreen'
import AnotherAuthenticatedScreen from '../Containers/AnotherAuthenticatedScreen'

import ListScreen from '../Containers/ListScreen'
import LiveStreamScreen from '../Containers/LiveStreamScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default createStackNavigator(
  {
    ListScreen: { screen: ListScreen },
    LiveStreamScreen: { screen: LiveStreamScreen },
    AuthenticatedScreen: { screen: AuthenticatedScreen },
    AnotherAuthenticatedScreen: { screen: AnotherAuthenticatedScreen },
  },
  {
    // Default config for all screens
    // headerMode: 'none',
    initialRouteName: 'ListScreen',
    // navigationOptions: {
    //   headerStyle: styles.header,
    // },
  }
)
