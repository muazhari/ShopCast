import React, { PropTypes } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation,
  // Button,
} from 'react-native'

import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import styles from './Styles/LoginScreenStyles'
import { Images, Metrics } from '../Themes'
import AuthActions from '../Redux/AuthRedux'

class LoginScreen extends React.Component {
  // static propTypes = {
  //   dispatch: PropTypes.func,
  //   fetching: PropTypes.bool,
  //   attemptLogin: PropTypes.func,
  // }

  isAttempting = false

  keyboardDidShowListener = {}

  keyboardDidHideListener = {}

  constructor(props) {
    super(props)
    this.state = {
      username: 'kharisma.azhari02@gmail.com',
      password: '123456',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
    }
    this.isAttempting = false
  }

  componentWillReceiveProps(newProps) {
    this.forceUpdate()
    // Did the login attempt complete?
    if (this.isAttempting && !newProps.fetching) {
      this.props.navigation.goBack()
    }
  }

  componentDidMount() {
    //
  }

  componentWillMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = e => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: { width: 100, height: 70 },
    })
  }

  keyboardDidHide = e => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
    })
  }

  handlePressLogin = () => {
    const { username, password } = this.state
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
  }

  handlePressRegister = () => {
    const { username, password } = this.state
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptRegister(username, password)
  }

  handleChangeUsername = text => {
    this.setState({ username: text })
  }

  handleChangePassword = text => {
    this.setState({ password: text })
  }

  render() {
    const { username, password } = this.state
    const { fetching, error } = this.props
    const editable = !fetching
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly
    return (
      <ScrollView
        contentContainerStyle={{ justifyContent: 'center' }}
        style={[styles.container, { height: this.state.visibleHeight }]}
        keyboardShouldPersistTaps="always">
        <Modal
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          isVisible={error}
          style={{
            backgroundColor: 'white',
            marginHorizontal: Metrics.screenWidth * 0.1,
            marginVertical: Metrics.screenHeight * 0.33,
            borderRadius: 15,
          }}>
          <View style={{}}>
            <Text
              style={{
                textAlign: 'center',
                marginHorizontal: Metrics.screenWidth * 0.1,
                marginBottom: Metrics.screenHeight * 0.09,
              }}>
              {error && error.message}
            </Text>
            <Button
              raised
              buttonStyle={{ borderRadius: 10 }}
              containerStyle={{ marginHorizontal: Metrics.screenWidth * 0.1 }}
              title="OK"
              onPress={() => {
                this.props.attemptFailure(null)
              }}
            />
          </View>
        </Modal>
        <Image source={Images.logo} style={[styles.topLogo, this.state.topLogo]} />
        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Username / Email</Text>
            <TextInput
              ref={ref => {
                this.username = ref
              }}
              style={textInputStyle}
              value={username}
              editable={editable}
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.handleChangeUsername}
              underlineColorAndroid="transparent"
              onSubmitEditing={() => this.password.focus()}
              placeholder="Username"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Password</Text>
            <TextInput
              ref={ref => {
                this.password = ref
              }}
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType="default"
              returnKeyType="go"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangePassword}
              underlineColorAndroid="transparent"
              onSubmitEditing={this.handlePressLogin}
              placeholder="Password"
            />
          </View>

          <View style={[styles.loginRow]}>
            <Button
              disabled={!editable}
              containerStyle={styles.loginButtonWrapper}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginText}
              onPress={this.handlePressLogin}
              title="Sign In"
            />
            <Button
              disabled={!editable}
              containerStyle={styles.loginButtonWrapper}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginText}
              onPress={this.handlePressRegister}
              title="Sign Up"
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.auth.fetching,
    error: state.auth.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptLogin: (username, password) => dispatch(AuthActions.loginRequest(username, password)),

    attemptRegister: (username, password) =>
      dispatch(AuthActions.registerRequest(username, password)),

    attemptFailure: error => dispatch(AuthActions.loginFailure(error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
