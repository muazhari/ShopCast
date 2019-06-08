import React from 'react'
import { StyleSheet, View, StatusBar, Platform } from 'react-native'

// here, we add the spacing for iOS
// and pass the rest of the props to React Native's StatusBar

const styles = StyleSheet.create({
  IOS_height: {
    height: 20,
  },
  Android_height: {
    height: 0,
  },
})

export default function(props) {
  const { style, ...otherProps } = props

  const styleMerger = [Platform.OS === 'ios' ? styles.IOS_height : styles.Android_height, style]

  return (
    <View style={styleMerger}>
      <StatusBar {...otherProps} />
    </View>
  )
}
