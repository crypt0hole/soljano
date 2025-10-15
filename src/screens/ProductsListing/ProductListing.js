import React, { useEffect, useState } from 'react'
import { View, FlatList, Image } from 'react-native'
import styles from './styles'
import ProductCard from '../../ui/ProductCard/ProductCard'
import MainBtn from '../../ui/Buttons/MainBtn'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { getProductsByCategory } from '../../firebase'
import {
  Spinner,
  TextError,
  TextDefault,
  BackHeader,
  BottomTab
} from '../../components'
import { colors } from '../../utils'

function ProductListing(props) {
  const route = useRoute()
  const navigation = useNavigation()
  const id = route.params?.id ?? null
  const categoryName = route.params?.category ?? null
  const passedProducts = route.params?.products ?? null
  const title = route.params?.title ?? 'Products'
  
  const [products, setProducts] = useState(passedProducts || [])
  const [loading, setLoading] = useState(passedProducts ? false : true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If products are passed via params, don't fetch from Firebase
    if (passedProducts) {
      setProducts(passedProducts)
      setLoading(false)
      return
    }
    
    // Otherwise fetch from Firebase
    const fetchData = async () => {
      try {
        const data = await getProductsByCategory(id)
        setProducts(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, passedProducts])
  function emptyView() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/images/noProducts.png')}></Image>
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault textColor={colors.fontSecondColor} bold center>
            {'There is no product.'}
          </TextDefault>
        </View>
        <View style={styles.emptyButton}>
          <MainBtn
            style={{ width: '100%' }}
            onPress={() => navigation.navigate('MainLanding')}
            text="Browse Product"
          />
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <View style={[styles.flex, styles.container]}>
        <BackHeader
          title={title}
          backPressed={() => navigation.goBack()}
        />
        {error ? (
          <TextError text={error.message} />
        ) : loading ? (
          <Spinner />
        ) : (
          <View style={styles.categoryContainer}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item, idx) => (
                <ProductCard key={item.id || idx} styles={styles.productCard} {...item} />
              ))
            ) : (
              emptyView()
            )}
          </View>
        )}
        <BottomTab screen="HOME" />
      </View>
    </SafeAreaView>
  )
}

export default ProductListing
