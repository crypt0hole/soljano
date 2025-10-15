import React, { useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { TextDefault } from '../../components'
import { useNavigation } from '@react-navigation/native'

function ProductCard(props) {
  const navigation = useNavigation()
  const [loadingMutation, setLoadingMutation] = useState(false)

  return (
    <TouchableOpacity
      disabled={loadingMutation}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('ProductDescription', { product: props })
      }
      style={[styles.cardContainer, props.styles]}>
      
      <View style={styles.topCardContainer}>
        <Image
          source={
            props.mainImage || props.image
              ? { uri: props.mainImage || props.image }
              : require('../../assets/images/productPlaceholder.jpg')
          }
          style={styles.imgResponsive}
        />
      </View>

      <View style={styles.botCardContainer}>
        <View style={styles.botSubCardContainer}>
          <TextDefault
            style={styles.productName}
            numberOfLines={2}>
            {props.name || props.title || ''}
          </TextDefault>
          <TextDefault style={styles.price}>
            {`${!isNaN(Number(props.price)) ? Number(props.price).toFixed(2) : '0.00'} د.ل`}
          </TextDefault>
        </View>
      </View>
      
    </TouchableOpacity>
  )
}

export default ProductCard
