import { createStackNavigator, createAppContainer } from 'react-navigation'
import InitialScreen from '../Containers/InitialScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  InitialScreen: { screen: InitialScreen },
  {
    LaunchScreen: { screen: LaunchScreen }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'LaunchScreen',
    navigationOptions: {
      headerStyle: styles.header
    }
  }
)

export default createAppContainer(PrimaryNav)
