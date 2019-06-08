import { createStackNavigator } from 'react-navigation'
import LoginScreen from '../Containers/LoginScreen'
import SigninScreen from '../Containers/SigninScreen'
// import SignupScreen from '../Containers/SigninScreen'
import InitialScreen from '../Containers/SigninScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default createStackNavigator(
  {
    // InitialScreen: {
    //   screen: InitialScreen,
    //   navigationOptions: {},
    // },
    // SignupScreen: {
    //   screen: SignupScreen,
    //   navigationOptions: {},
    // },
    SigninScreen: {
      screen: SigninScreen,
      navigationOptions: {},
    },
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'SigninScreen',
    navigationOptions: {
      headerStyle: styles.header,
    },
  }
)
