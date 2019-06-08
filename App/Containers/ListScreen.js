import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TitleView,
} from 'react-native'
import { connect } from 'react-redux'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Utils from '../Config/Utils'
import AuthActions from '../Redux/AuthRedux'
import SocketUtils from '../Services/SocketUtils'

import { Images, Metrics } from '../Themes'

class ListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      liveRooms: [],
      countLobbers: 0,
      containerName: 'liveRoom',
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', null),
  })

  componentWillMount = async () => {
    this.props.navigation.setParams({ title: this.props.user.email })
    //--------------------------------------------------------------------------
    await Utils.setUserId(this.props.user.email)
    await Utils.setContainer('mainLobby', this)
    await SocketUtils.emitLobbyJoin('mainLobby', Utils.getUserId())
    //--------------------------------------------------------------------------
    console.tron.log(`${Utils.getUserId()} Lobby Joined`)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.navigation.getParam('title', null) !== this.props.user.email) {
      this.props.navigation.setParams({ title: this.props.user.email })
    }
  }

  componentDidMount = async () => {
    //
  }

  componentWillUnmount = async () => {
    await SocketUtils.emitLobbyLeave('mainLobby')
  }

  onReplayButtonClicked = roomName => {
    if (!Utils.isNullOrUndefined(Utils.getContainer(this.state.containerName))) {
      if (Utils.getContainer(this.state.containerName).state.listMessages.length > 0) {
        Utils.getContainer(this.state.containerName).setState({ listMessages: [] })
      }
    }
    Utils.setUserType('REPLAY')
    Utils.setRoomName(roomName)
    this.props.navigation.navigate('LiveStreamScreen')
  }

  renderListRooms = () => {
    const { liveRooms } = this.state
    return (
      <View style={styles.wrapListMessages}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true })
          }}>
          {liveRooms.length > 0 &&
            liveRooms.map((item, index) => {
              const { roomName, liveStatus, countViewer, countHeart, countMessage } = item
              return (
                <View style={styles.chatItem} key={index}>
                  <View style={styles.messageItem}>
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        Utils.setUserType('VIEWER')
                        Utils.setRoomName(roomName)
                        this.props.navigation.navigate('LiveStreamScreen')
                      }}>
                      <View>
                        <Text style={styles.name}>RoomName: {roomName}</Text>
                        <Text style={styles.content}>Live: {liveStatus}</Text>
                        <Text style={styles.content}>Views: {countViewer}</Text>
                        <Text style={styles.content}>
                          Rank Score: {countViewer * countHeart * countMessage}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <Button
                      raised
                      buttonStyle={styles.button1}
                      titleStyle={styles.text}
                      title="View User1 Live Stream"
                      onPress={() => {
                        Utils.setUserType('VIEWER')
                        Utils.setRoomName('kharisma.azhari02@gmail.com')
                        this.props.navigation.navigate('LiveStreamScreen')
                      }}
                    />
                  </View>
                </View>
              )
            })}
        </ScrollView>
      </View>
    )
  }

  render() {
    // this.setState({ credential: this.props.user })

    return (
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" /> */}

        <Button
          raised
          title={Utils.getUserId() ? 'Stream Ready' : 'Stream not Ready.'}
          titileStyle={styles.text}
          disabled={!Utils.getUserId()}
          onPress={async () => {
            await SocketUtils.emitLobbyLeave('mainLobby')
            await Utils.setUserType('STREAMER')
            await Utils.setRoomName(Utils.getUserId())
            this.props.navigation.navigate('LiveStreamScreen')
          }}
        />

        {this.renderListRooms()}
        {/* <View style={styles.line}>
          <Button
            raised
            buttonStyle={styles.button1}
            titleStyle={styles.text}
            title="View User1 Live Stream"
            onPress={() => {
              Utils.setUserType('VIEWER')
              Utils.setRoomName('kharisma.azhari02@gmail.com')
              this.props.navigation.navigate('LiveStreamScreen')
            }}
          />

          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.onReplayButtonClicked('kharisma.azhari02@gmail.com')}>
            <Image source={require('../Assets/Images/live-room/ico_play.png')} style={styles.iconPlay} />
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
              Utils.setRoomName('kharisma.azhari021@gmail.com')
              this.props.navigation.navigate('LiveStreamScreen')
            }}
          />
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.onReplayButtonClicked('kharisma.azhari021@gmail.com')}>
            <Image source={require('../Assets/Images/live-room/ico_play.png')} style={styles.iconPlay} />
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
            <Image source={require('../Assets/Images/live-room/ico_play.png')} style={styles.iconPlay} />
          </TouchableOpacity>
        </View> */}

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
    totalCharge: state.auth.credential.email,
    user: state.auth.credential,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptLogout: () => dispatch(AuthActions.logoutRequest()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListScreen)

const styles = StyleSheet.create({
  wrapListMessages: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: Metrics.screenWidth / 1.5,
    width: Metrics.screenWidth,
    zIndex: 2,
  },
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  messageItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    fontSize: 13,
  },
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
