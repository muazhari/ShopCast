import React from 'react'
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { Button } from 'react-native-elements'
import Utils from '../Config/Utils'
import AuthActions from '../Redux/AuthRedux'

import { Images, Metrics } from '../Themes'

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: Utils.getUserId(),
  })

  constructor(props) {
    super(props)
    // this.state = {}
  }

  onReplayButtonClicked = roomName => {
    if (!Utils.isNullOrUndefined(Utils.getContainer())) {
      if (Utils.getContainer().state.listMessages.length > 0) {
        Utils.getContainer().setState({ listMessages: [] })
      }
    }
    Utils.setUserType('REPLAY')
    Utils.setRoomName(roomName)
    this.props.navigation.navigate('LiveStreamScreen')
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" /> */}

        <Button
          raised
          title={Utils.getUserId() ? 'Stream Ready' : 'Stream not Ready.'}
          titileStyle={styles.text}
          disabled={!Utils.getUserId()}
          onPress={() => {
            Utils.setUserType('STREAMER')
            Utils.setRoomName(Utils.getUserId())
            this.props.navigation.navigate('LiveStreamScreen')
          }}
        />
        <View style={styles.line}>
          <Button
            raised
            buttonStyle={styles.button1}
            titleStyle={styles.text}
            title="View User1 Live Stream"
            onPress={() => {
              Utils.setUserType('VIEWER')
              Utils.setRoomName('user1')
              this.props.navigation.navigate('LiveStreamScreen')
            }}
          />

          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.onReplayButtonClicked('user1')}>
            <Image source={require('../Images/assets/ico_play.png')} style={styles.iconPlay} />
          </TouchableOpacity>
        </View>

        <View style={styles.line}>
          <Button
            raised
            buttonStyle={styles.button2}
            titleStyle={styles.text}
            title="View User2 Live Stream"
            onPress={() => {
              Utils.setUserType('VIEWER')
              Utils.setRoomName('user2')
              this.props.navigation.navigate('LiveStreamScreen')
            }}
          />
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.onReplayButtonClicked('user2')}>
            <Image source={require('../Images/assets/ico_play.png')} style={styles.iconPlay} />
          </TouchableOpacity>
        </View>
        <View style={styles.line}>
          <Button
            raised
            buttonStyle={styles.button3}
            titleStyle={styles.text}
            title="View User3 Live Stream"
            onPress={() => {
              Utils.setUserType('VIEWER')
              Utils.setRoomName('user3')
              this.props.navigation.navigate('LiveStreamScreen')
            }}
          />
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.onReplayButtonClicked('user3')}>
            <Image source={require('../Images/assets/ico_play.png')} style={styles.iconPlay} />
          </TouchableOpacity>
        </View>

        <View style={styles.line}>
          <Button
            raised
            title="Logout"
            buttonStyle={styles.buttonLogout}
            titleStyle={styles.text}
            onPress={this.props.attemptLogout}
          />
        </View>
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
)(ListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button1: {
    paddingVertical: Metrics.screenHeight * 0.035,
    paddingHorizontal: Metrics.screenWidth * 0.05,
    backgroundColor: '#34495e',
    borderRadius: 10,
  },
  button2: {
    paddingVertical: Metrics.screenHeight * 0.035,
    paddingHorizontal: Metrics.screenWidth * 0.05,
    backgroundColor: '#1abc9c',
    borderRadius: 10,
  },
  button3: {
    paddingVertical: Metrics.screenHeight * 0.035,
    paddingHorizontal: Metrics.screenWidth * 0.05,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  buttonLogout: {
    paddingVertical: Metrics.screenHeight * 0.035,
    paddingHorizontal: Metrics.screenWidth * 0.05,
    backgroundColor: '#e05922',
    borderRadius: 10,
  },
  text: {
    fontSize: Metrics.screenWidth * 0.055,
    color: 'white',
  },
  line: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPlay: {
    width: Metrics.screenWidth * 0.18,
    height: Metrics.screenWidth * 0.18,
    marginLeft: 10,
  },
  iconPlay: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
})
