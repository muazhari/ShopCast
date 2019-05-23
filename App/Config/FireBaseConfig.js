import firebase from 'firebase'

class FireBaseConfig {
  constructor() {
    this.init()
  }

  init = () =>
    firebase.initializeApp({
      apiKey: 'AIzaSyDS9Hb3NHh5g0m5zbmVN3Y-4hUU9M8YkOA',
      authDomain: 'serci-mi.firebaseapp.com',
      databaseURL: 'https://serci-mi.firebaseio.com',
      projectId: 'serci-mi',
      storageBucket: 'serci-mi.appspot.com',
      messagingSenderId: '60580921360',
    })
}

const Fire = new FireBaseConfig()

export default Fire
