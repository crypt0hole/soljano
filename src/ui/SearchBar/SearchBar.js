import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import styles from './styles'
import { colors, scale } from '../../utils'
import { Ionicons } from '@expo/vector-icons'

function SearchBar(props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textfield}
        placeholder={props.placeholder}
        placeholderTextColor={colors.primaryBlackColor}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0}
        onPress={props.onPress}>
        <Ionicons
          name="search"
          size={scale(25)}
          color={colors.buttonBackground}
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar
