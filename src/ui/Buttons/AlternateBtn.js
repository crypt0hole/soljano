import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { alternateBtn as styles } from './styles'
import { TextDefault } from '../../components'

/* Config/Constants
============================================================================= */

/* =============================================================================
<TextField />
A TextInput covered by a white background View, greyish border, black text. has 100% width and mod scale 38 height.
--------------------------------------------------------------------------------

Props:
  ?
  onPress Event: send the function to be called for onPress event
  text: send the Text for button
============================================================================= */
const AlternateBtn = props => (
  <View style={styles.backgroundColor}>
    <TouchableOpacity
      activeOpacity={0}
      onPress={props.onPress}
      style={styles.main_alt_btn}>
      <TextDefault style={styles.btn_text}> {props.text} </TextDefault>
    </TouchableOpacity>
  </View>
)

export default AlternateBtn
