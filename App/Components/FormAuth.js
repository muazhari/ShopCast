import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

import { Metrics, Colors } from '../Themes'

export default class FormAuth extends React.Component {
  // Create a React ref that will be used to store the
  // TextInput reference

  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
    }
    this.inputRef = null
  }

  handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ isFocused: true })
    // Remember to propagate the `onFocus` event to the
    // parent as well (if set)
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ isFocused: false })
    // Remember to propagate the `onBlur` event to the
    // parent as well (if set)
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  render() {
    const { error, onFocus, onBlur, ...otherProps } = this.props
    const { isFocused } = this.state

    return (
      <TextInput
        placeholderTextColor={!error ? 'white' : 'red'}
        ref={ref => {
          this.state.inputRef = ref
        }}
        onSubmitEditing={this.props.changeFocus}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        // ...and then spread all the other props
        {...otherProps}
      />
    )
  }
}
