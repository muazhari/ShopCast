import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import RoundedButton from '../Components/RoundedButton'
import styles from './Styles/AuthenticatedScreenStyle'
import AuthActions from '../Redux/AuthRedux'

class AuthenticatedScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation
    const { user } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>You are logged in {user && user.email}</Text>
        <RoundedButton
          text="Go to Another Authenticated Screen"
          onPress={() => navigate('AnotherAuthenticatedScreen')}
        />
        <RoundedButton text="Logout" onPress={this.props.attemptLogout} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.credential,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptLogout: () => dispatch(AuthActions.handleLogout()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticatedScreen)
