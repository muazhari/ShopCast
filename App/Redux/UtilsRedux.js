const userType = null
const container = null
const userId = null
const roomName = null
let timeOutMessages = []

// const socketIOIP = 'http://103.221.221.111:3333';
const socketIOIP = 'http://192.168.43.208:3333'
// const rtmpPath = 'rtmp://103.221.221.111/live/';
const rtmpPath = 'rtmp://192.168.43.208/live/'

const getSocketIOIP = () => {
  return this.socketIOIP
}
const getRtmpPath = () => {
  return this.rtmpPath
}

const clearTimeOutMessages = () => {
  for (let i = 0; i < Utils.getTimeOutMessages().length; i += 1) {
    clearTimeout(Utils.getTimeOutMessages()[i])
  }
  timeOutMessages = []
}

const getTimeOutMessages = () => {
  return timeOutMessages
}

const isNullOrUndefined = value => {
  return value === null || value === undefined
}

const getContainer = () => {
  return this.container
}

const setContainer = con => {
  this.container = con
}

const setUserType = type => {
  this.userType = type
}

const getUserType = () => {
  return this.userType
}

const setUserId = id => {
  this.userId = id
}

const getUserId = () => {
  return this.userId
}

const setRoomName = name => {
  this.roomName = name
}

const getRoomName = () => {
  return this.roomName
}

const Utils = {
  isNullOrUndefined,
  getUserType,
  setUserType,
  getContainer,
  setContainer,
  getUserId,
  setUserId,
  getRoomName,
  setRoomName,
  getTimeOutMessages,
  clearTimeOutMessages,
  getSocketIOIP,
  getRtmpPath,
}

export default Utils
