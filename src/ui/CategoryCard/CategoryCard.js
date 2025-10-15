import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { TextDefault } from '../../components'

function CategoryCard(props) {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductListing', {
          title: props.cardLabel,
          category: props.cardLabel
        })
      }
      style={[styles.container, props.style]}>
      <View style={styles.textViewContainer}>
        <TextDefault numberOfLines={1} H5>
          {props.cardLabel}
        </TextDefault>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(CategoryCard)
