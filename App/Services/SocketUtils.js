import { Alert } from 'react-native'
import io from 'socket.io-client'
import moment from 'moment'
import Utils from '../Config/Utils'
import LiveStatus from '../Config/liveStatus'

let socket = null

const getSocket = () => {
  return socket
}

const connect = () => {
  socket = io.connect(Utils.getSocketIOIP(), { transports: ['websocket'] })
}

const handleOnConnect = () => {
  socket.on('connect', data => {
    console.tron.log('connect')
  })
}

const emitClientDisconnect = () => {
  socket.emit('disconnect', data => {
    console.tron.log('by client disconnect')
  })
}

const emitLobbyJoin = (lobbyName, userId) => {
  socket.emit('lobby-pre-join', { lobbyName, userId }, data => {
    if (data) {
      const { countLobbers, liveRooms } = data
      Utils.getContainer(lobbyName).setState({
        liveRooms,
        countLobbers,
      })
    }
  })
}

const handleOnLobbyJoin = () => {
  socket.on('lobby-post-join', data => {
    if (data) {
      const { lobbyName, liveRooms, countLobbers } = data
      console.tron.log('lobby-post-join', data)

      Utils.getContainer(lobbyName).setState({
        liveRooms,
        countLobbers,
      })
    }
  })
}

const emitLobbyLeave = (lobbyName, userId) => {
  socket.emit('lobby-pre-leave', {
    lobbyName,
    userId,
  })
}

const handleOnLobbyLeave = () => {
  socket.on('lobby-post-leave', data => {
    if (data) {
      // const { countLobbers, lobbyName } = data
      // Utils.getContainer(lobbyName).setState({ countLobbers })
    }
  })
  console.tron.log('lobby-post-leave')
}

const emitRoomJoin = (roomName, userId) => {
  socket.emit(
    'room-pre-join',
    { roomName, userId },
    // countViewer verified by server.
    data => {
      if (data) {
        const { countViewer, liveStatus } = data
        Utils.getContainer('liveRoom').setState({
          countViewer,
          liveStatus,
        })
      }
    }
  )
  console.tron.log('room-pre-join')
  // bug coating, didn't truly fixed, because of socket server emit is faster than countViewer client state, temporary solution is increment it manually, the rest is normalize by another socket, 'emit' from server and restated by 'on handler' client.
  // Utils.getContainer('liveRoom').state.countViewer += 1;
}

// increment viewer in-client
const handleOnRoomJoin = () => {
  socket.on('room-post-join', data => {
    if (data) {
      const { countViewer } = data
      Utils.getContainer('liveRoom').setState({ countViewer })
    }
  })
  console.tron.log('room-post-join')
}

const emitRoomLeave = (roomName, userId) => {
  socket.emit(
    'room-pre-leave',
    {
      roomName,
      userId,
    },
    data => {
      if (data) {
        const { lobbyName } = data
        emitLobbyJoin(lobbyName, userId)
      }
    }
  )

  console.tron.log('room-pre-leave')
}

const handleOnRoomLeave = () => {
  socket.on('room-post-leave', data => {
    console.tron.log('room-post-leave')
    if (data) {
      const { countViewer } = data
      Utils.getContainer('liveRoom').setState({ countViewer })
    }
  })
  console.tron.log('room-post-leave')
}

const emitRegisterLiveStream = (roomName, userId) => {
  socket.emit('register-live-stream', {
    roomName,
    userId,
  })
  console.tron.log('register-live-stream')
}

const emitBeginLiveStream = (roomName, userId) => {
  socket.emit('begin-live-stream', {
    roomName,
    userId,
  })
  console.tron.log('begin-live-stream')
}

const emitFinishLiveStream = (roomName, userId) => {
  socket.emit('finish-live-stream', {
    roomName,
    userId,
  })
  console.tron.log('finish-live-stream')
}

const emitCancelLiveStream = (roomName, userId) => {
  socket.emit('cancel-live-stream', {
    roomName,
    userId,
  })
  console.tron.log('cancel-live-stream')
}

const emitRoomSendHeart = roomName => {
  socket.emit('send-heart', {
    roomName,
  })
  console.tron.log('room-pre-send-heart')
}

const handleOnRoomSendHeart = () => {
  socket.on('room-post-send-heart', () => {
    countHeart = Utils.getContainer('liveRoom').state.countHeart
    Utils.getContainer('liveRoom').setState({ countHeart: countHeart + 1 })
  })

  console.tron.log('room-post-send-heart')
}

const emitRoomSendMessage = (roomName, userId, message, productId, productImageUrl, productUrl) => {
  socket.emit('room-pre-send-message', {
    roomName,
    userId,
    message,
    productId,
    productImageUrl,
    productUrl,
  })

  console.tron.log('room-pre-send-message')
}

const handleOnRoomSendMessage = () => {
  socket.on('room-post-send-message', data => {
    const { userId, message, productId, productImageUrl, productUrl } = data
    listMessages = Utils.getContainer('liveRoom').state.listMessages
    const newListMessages = listMessages.slice()
    newListMessages.push({
      userId,
      message,
      productId,
      productImageUrl,
      productUrl,
    })
    Utils.getContainer('liveRoom').setState({
      listMessages: newListMessages,
    })
  })

  console.tron.log('room-post-send-message')
}

const emitRoomLiveReplay = (roomName, userId) => {
  socket.emit(
    'room-live-replay',
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
            listMessages = Utils.getContainer('liveRoom').state.listMessages
            const newListMessages = listMessages.slice()
            newListMessages.push({
              userId,
              message,
              productId,
              productImageUrl,
              productUrl,
            })
            Utils.getContainer('liveRoom').setState({
              listMessages: newListMessages,
            })
          }, duration)
          Utils.getTimeOutMessages().push(timeout)
        }
      }
    }
  )
  console.tron.log('room-live-replay')
}

const handleOnRoomChangedLiveStatus = () => {
  socket.on('room-changed-live-status', data => {
    const { roomName, userId, liveStatus } = data
    const currentLiveStatus = Utils.getContainer('liveRoom').state.liveStatus
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
                Utils.getContainer('liveRoom').props.navigation.goBack()
              },
            },
          ])
        }
        if (liveStatus === LiveStatus.FINISH) {
          Alert.alert('Alert', 'Streamer finish streaming')
        }

        Utils.getContainer('liveRoom').setState({ liveStatus })
      } else if (currentUserType === 'REPLAY') {
        //
      }
    }
  })

  console.tron.log('room-changed-live-status')
}

const handleOnRoomNotReady = () => {
  socket.on('room-not-ready', () => {
    Utils.getContainer('liveRoom').alertStreamerNotReady()
    // countViewer = Utils.getContainer('liveRoom').state.countViewer;
    // Utils.getContainer('liveRoom').setState({ countViewer: countViewer + 1 });
  })

  console.tron.log('room-not-ready')
}

const SocketUtils = {
  getSocket,
  connect,
  handleOnConnect,
  emitClientDisconnect,

  emitLobbyJoin,
  handleOnLobbyJoin,
  emitLobbyLeave,
  handleOnLobbyLeave,

  emitRegisterLiveStream,
  emitBeginLiveStream,
  emitFinishLiveStream,
  emitCancelLiveStream,

  emitRoomJoin,
  handleOnRoomJoin,
  emitRoomLeave,
  handleOnRoomLeave,

  emitRoomSendHeart,
  handleOnRoomSendHeart,

  emitRoomSendMessage,
  handleOnRoomSendMessage,

  emitRoomLiveReplay,
  handleOnRoomChangedLiveStatus,
  handleOnRoomNotReady,
}
export default SocketUtils
