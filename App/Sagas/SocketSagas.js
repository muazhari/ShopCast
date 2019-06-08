import { takeEvery, eventChannel } from 'redux-saga'
import { put, call, take } from 'redux-saga/effects'
import SocketActions from '../Redux/SocketRedux'

function* createEventChannel(mySocket) {
  return eventChannel(emit => {
    mySocket.onmessage(message => emit(message.data))
    return () => {
      mySocket.close()
    }
  })
}

function* initSocket() {
  const mySocket = new WebSocket('ws://www.xyz.com/socketServer', 'protocol')
  const channel = yield call(createEventChannel, mySocket)
  while (true) {
    const { message } = yield take(channel)
    yield put({ type: WEBSOCKET_MESSAGE_RECEIVED, message })
  }
}
