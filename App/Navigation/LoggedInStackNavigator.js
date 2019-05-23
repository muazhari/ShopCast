import { createStackNavigator } from 'react-navigation'
import AuthenticatedScreen from '../Containers/AuthenticatedScreen'
import AnotherAuthenticatedScreen from '../Containers/AnotherAuthenticatedScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default createStackNavigator(
  {
    AuthenticatedScreen: { screen: AuthenticatedScreen },
    AnotherAuthenticatedScreen: { screen: AnotherAuthenticatedScreen },
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'AuthenticatedScreen',
    navigationOptions: {
      headerStyle: styles.header,
    },
  }
)
