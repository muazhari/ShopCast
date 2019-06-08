import { Alert } from 'react-native'
import io from 'socket.io-client'
import moment from 'moment'
import Utils from '../Config/Utils'
import LiveStatus from '../Config/liveStatus'

const socket = null

const getSocket = () => {
  return socket
}

const connect = () => {
  socket = io.connect(Utils.getSocketIOIP(), { transports: ['websocket'] })
}

const handleOnConnect = () => {
  socket.on('connect', data => {
    console.log('connect')
  })
}

const emitRegisterLiveStream = (roomName, userId) => {
  socket.emit('register-live-stream', {
    roomName,
    userId,
  })
}

const emitBeginLiveStream = (roomName, userId) => {
  socket.emit(
    'begin-live-stream',
    {
      roomName,
      userId,
    },
    () => {
      console.log('register-live-stream')
    }
  )
}

const emitFinishLiveStream = (roomName, userId) => {
  socket.emit(
    'finish-live-stream',
    {
      roomName,
      userId,
    },
    () => {
      console.log('register-live-stream')
    }
  )
}

const emitCancelLiveStream = (roomName, userId) => {
  socket.emit('cancel-live-stream', {
    roomName,
    userId,
  })
}

const emitJoinServer = (roomName, userId) => {
  socket.emit(
    'join-server',
    { roomName, userId },
    // countViewer verified by server.
    data => {
      if (data) {
        const { countViewer, liveStatus } = data
        Utils.getContainer().setState({
          countViewer,
          liveStatus,
        })
      }
    }
  )
  // bug coating, didn't truly fixed, because of socket server emit is faster than countViewer client state, temporary solution is increment it manually, the rest is normalize by another socket, 'emit' from server and restated by 'on handler' client.
  // Utils.getContainer().state.countViewer += 1;
}

// increment viewer in-client
const handleOnClientJoin = () => {
  socket.on('join-client', data => {
    console.log('join-client')
    const { countViewer } = data
    Utils.getContainer().setState({ countViewer })
  })
}

const emitLeaveServer = (roomName, userId) => {
  socket.emit('leave-server', {
    roomName,
    userId,
  })
}

const handleOnLeaveClient = () => {
  socket.on('leave-client', data => {
    console.log('leave-client')
    const { countViewer } = data
    Utils.getContainer().setState({ countViewer })
  })
}

const handleOnSendHeart = () => {
  socket.on('send-heart', () => {
    console.log('send-heart')
    countHeart = Utils.getContainer().state.countHeart
    Utils.getContainer().setState({ countHeart: countHeart + 1 })
  })
}

const emitSendHeart = roomName => {
  socket.emit('send-heart', {
    roomName,
  })
}

const handleOnSendMessage = () => {
  socket.on('send-message', data => {
    const { userId, message, productId, productImageUrl, productUrl } = data
    listMessages = Utils.getContainer().state.listMessages
    const newListMessages = listMessages.slice()
    newListMessages.push({
      userId,
      message,
      productId,
      productImageUrl,
      productUrl,
    })
    Utils.getContainer().setState({ listMessages: newListMessages })
  })
}

const emitSendMessage = (roomName, userId, message, productId, productImageUrl, productUrl) => {
  socket.emit('send-message', {
    roomName,
    userId,
    message,
    productId,
    productImageUrl,
    productUrl,
  })
}

const emitReplay = (roomName, userId) => {
  socket.emit(
    'replay',
    {
      roomName,
      userId,
    },
    result => {
      if (!Utils.isNullOrUndefined(result)) {
        const { createdAt } = result
        const { messages } = result
        const start = moment(createdAt)
        for (let i = 0; i < messages.length; i += 1) {
          const end = moment(messages[i].createdAt)
          const duration = end.diff(start)
          const timeout = setTimeout(() => {
            const { userId, message, productId, productImageUrl, productUrl } = messages[i]
            listMessages = Utils.getContainer().state.listMessages
            const newListMessages = listMessages.slice()
            newListMessages.push({
              userId,
              message,
              productId,
              productImageUrl,
              productUrl,
            })
            Utils.getContainer().setState({ listMessages: newListMessages })
          }, duration)
          Utils.getTimeOutMessages().push(timeout)
        }
      }
    }
  )
}

const handleOnChangedLiveStatus = () => {
  socket.on('changed-live-status', data => {
    const { roomName, userId, liveStatus } = data
    const currentLiveStatus = Utils.getContainer().state.liveStatus
    const currentRoomName = Utils.getRoomName()
    const currentUserType = Utils.getUserType()

    if (roomName === currentRoomName) {
      if (currentUserType === 'STREAMER') {
        //
      } else if (currentUserType === 'VIEWER') {
        if (liveStatus === LiveStatus.CANCEL) {
          Alert.alert('Alert', 'Streamer has been canceled streaming', [
            {
              text: 'Close',
              onPress: () => {
                SocketUtils.emitLeaveServer(Utils.getRoomName(), Utils.getUserId())
                Utils.getContainer().props.navigation.goBack()
              },
            },
          ])
        }
        if (liveStatus === LiveStatus.FINISH) {
          Alert.alert('Alert', 'Streamer finish streaming')
        }

        Utils.getContainer().setState({ liveStatus })
      } else if (currentUserType === 'REPLAY') {
        //
      }
    }
  })
}

const handleOnNotReady = () => {
  socket.on('not-ready', () => {
    console.log('not-ready')
    Utils.getContainer().alertStreamerNotReady()
    // countViewer = Utils.getContainer().state.countViewer;
    // Utils.getContainer().setState({ countViewer: countViewer + 1 });
  })
}

const SocketUtils = {
  getSocket,
  connect,
  handleOnConnect,
  emitRegisterLiveStream,
  emitBeginLiveStream,
  emitFinishLiveStream,
  handleOnClientJoin,
  emitJoinServer,
  emitCancelLiveStream,
  handleOnSendHeart,
  emitSendHeart,
  handleOnSendMessage,
  emitSendMessage,
  emitLeaveServer,
  handleOnLeaveClient,
  emitReplay,
  handleOnChangedLiveStatus,
  handleOnNotReady,
}
export default SocketUtils
