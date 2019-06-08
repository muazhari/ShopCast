import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.shape,
  container: {
    paddingTop: Metrics.screenHeight * 0.04,
    backgroundColor: Colors.snow,
  },
  pageContent: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    paddingHorizontal: Metrics.screenWidth * 0.15,
    paddingBottom: Metrics.screenWidth * 0.8,
  },
  form: {
    // backgroundColor: 'yellow',
    width: Metrics.screenWidth * 0.75,
    borderRadius: 4,
  },
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
    // paddingHorizontal: Metrics.doubleBaseMargin,
  },
  rowLabel: {
    color: Colors.charcoal,
  },
  textInput: {
    height: Metrics.screenHeight * 0.06,
    color: Colors.coal,
  },
  textInputReadonly: {
    height: 40,
    color: Colors.steel,
  },
  loginRow: {
    paddingBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'row',
  },
  loginButton: {
    // borderWidth: 1,
    // borderColor: Colors.charcoal,
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenHeight * 0.075,
    borderRadius: 18,
    backgroundColor: Colors.bluish,
    padding: 6,
  },
  loginText: {
    // textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.silver,
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
})
