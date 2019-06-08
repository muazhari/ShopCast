import React from 'react'
import {
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  // Button,
  // Text
} from 'react-native'

import { Button, Icon, Text } from 'react-native-elements'
import Touchable from 'react-native-platform-touchable'

import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import AuthActions from '../Redux/AuthRedux'
import styles from './Styles/SigninScreenStyles'
import { Images, Metrics, Colors } from '../Themes'

import FormAuth from '../Components/StatusBar'

class SigninScreen extends React.Component {
  isAttempting = false

  keyboardDidShowListener = {}

  keyboardDidHideListener = {}

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      passwordVisible: true,
      visibleHeight: Metrics.screenHeight,
      buttonLoginHeight: Metrics.screenHeight * 0.3,
      inputRefs: [],
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
      buttonLoginHeight: Metrics.screenHeight * 0.07,
    })
  }

  keyboardDidHide = e => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      buttonLoginHeight: Metrics.screenHeight * 0.3,
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

  handleLoginFailure = () => {
    this.isAttempting = false
    this.props.attemptFailure(null)
  }

  handleChangeUsername = text => {
    this.setState({ username: text })
  }

  handleChangePassword = text => {
    this.setState({ password: text })
  }

  handleSwitchPasswordView = oldVisibility => {
    this.setState({ passwordVisible: !oldVisibility })
  }

  render() {
    const { username, password, passwordVisible, buttonLoginHeight } = this.state
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
          isVisible={!!error}
          style={{
            backgroundColor: 'white',
            marginHorizontal: Metrics.screenWidth * 0.1,
            marginVertical: Metrics.screenHeight * 0.33,
            borderRadius: 15,
          }}>
          <View
            style={{
              alignItems: 'center',
              // paddingHorizontal: Metrics.screenWidth * 0.,
              // paddingVertical: Metrics.screenHeight * 0.05,
            }}>
            <View
              style={{
                alignItems: 'center',
                paddingBottom: Metrics.screenHeight * 0.02,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: (Metrics.screenWidth + Metrics.screenHeight) * 0.015,
                  width: Metrics.screenWidth * 0.65,
                  height: Metrics.screenHeight * 0.13,
                }}>
                {error && error.message}
              </Text>
            </View>
            <Button
              raised
              buttonStyle={{
                borderRadius: 10,
                width: Metrics.screenWidth * 0.65,
                height: Metrics.screenHeight * 0.065,
              }}
              title="OK"
              onPress={this.handleLoginFailure}
            />
          </View>
        </Modal>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: Metrics.screenWidth * 0.1,
            paddingBottom: Metrics.screenWidth * 0.05,
          }}>
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Icon color="black" name="ios-arrow-back" type="ionicon" size={35} />
            <Text
              style={{
                marginHorizontal: Metrics.screenWidth * 0.03,
                fontWeight: 'bold',
                color: 'black',
              }}>
              back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pageContent}>
          <View style={styles.form}>
            <View style={styles.row}>
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
              <View style={[styles.lineStyle, { borderColor: Colors.oxford }]} />
            </View>

            <View style={styles.row}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TextInput
                  ref={ref => {
                    this.password = ref
                  }}
                  style={[textInputStyle, { width: Metrics.screenWidth * 0.69 }]}
                  value={password}
                  editable={editable}
                  keyboardType="default"
                  returnKeyType="go"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisible}
                  onChangeText={this.handleChangePassword}
                  underlineColorAndroid="transparent"
                  onSubmitEditing={this.handlePressLogin}
                  placeholder="Password"
                />

                <TouchableOpacity
                  hitSlop={{ top: 20, left: 20, right: 25, bottom: 20 }}
                  style={{ right: Metrics.screenWidth * 0.01 }}
                  onPress={() => this.handleSwitchPasswordView(passwordVisible)}>
                  <Icon name={passwordVisible ? 'ios-eye-off' : 'ios-eye'} type="ionicon" />
                </TouchableOpacity>
              </View>
              <View style={[styles.lineStyle, { borderColor: Colors.oxford }]} />
            </View>

            <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{ fontFamily: 'Poppins-Regular', fontWeight: 'bold', color: Colors.bluish }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            raised
            loading={fetching}
            disabled={!editable}
            containerStyle={{ top: buttonLoginHeight }}
            buttonStyle={styles.loginButton}
            titleStyle={styles.loginText}
            onPress={this.handlePressLogin}
            title="Log in"
          />
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
)(SigninScreen)
