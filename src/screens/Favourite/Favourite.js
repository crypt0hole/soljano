import React, { useContext, useState, useEffect } from 'react'
import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { colors, scale } from '../../utils'
import MainBtn from '../../ui/Buttons/MainBtn'
import { Feather, FontAwesome } from '@expo/vector-icons'
import {
  TextError,
  TextDefault,
  BackHeader,
  BottomTab,
  Spinner
} from '../../components'
import { removeFromWishlist, getWishlist } from '../../firebase/userService'
import UserContext from '../../context/User'
import { getProductById } from '../../firebase/productService'

function Favourite(props) {
  const navigation = useNavigation()
  const [indexDelete, indexSetterDelete] = useState(-1)
  const { profile, loadingProfile, errorProfile } = useContext(UserContext)
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [loadingMutation, setLoadingMutation] = useState(false)

  useEffect(() => {
    if (profile) {
      fetchWishlistProducts()
    } else if (!loadingProfile) {
      setLoadingWishlist(false)
    }
  }, [profile, loadingProfile])

  const fetchWishlistProducts = async () => {
    try {
      setLoadingWishlist(true)
      const wishlistIds = await getWishlist(profile.uid)
      const productPromises = wishlistIds.map(id => getProductById(id))
      const products = await Promise.all(productPromises)
      setWishlistProducts(products.filter(p => p)) // Filter out any null products
    } catch (error) {
      console.error('Error fetching wishlist products:', error)
    } finally {
      setLoadingWishlist(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      setLoadingMutation(true)
      await removeFromWishlist(profile.uid, productId)
      // Refresh wishlist after removal
      fetchWishlistProducts()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setLoadingMutation(false)
    }
  }

  function emptyView() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/images/wishlist.png')}></Image>
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault textColor={colors.fontSecondColor} bold center>
            {'Your favourite product is missing.'}
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
      <View style={[styles.grayBackground, styles.flex]}>
        <BackHeader
          title={'Favourite'}
          backPressed={() => navigation.goBack()}
        />
        {loadingProfile || loadingWishlist ? (
          <Spinner />
        ) : errorProfile ? (
          <TextError text={'User Context: ' + errorProfile.message} />
        ) : (
          <FlatList
            data={Array.isArray(wishlistProducts) ? wishlistProducts : []}
            style={styles.flex}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyView}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                disabled={loadingMutation}
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate('ProductDescription', { product: item })
                }
                style={styles.cardContainer}>
                <View style={styles.leftContainer}>
                  <Image
                    source={{
                      uri:
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : 'https://res.cloudinary.com/ecommero/image/upload/v1597658445/products/su6dg1ufmtfuvrjbhgtj.png'
                    }}
                    resizeMode="cover"
                    style={[styles.imgResponsive, styles.roundedBorder]}
                  />
                </View>
                <View style={styles.rightContainer}>
                  <View style={styles.subRightContainer}>
                    <View style={styles.titleContainer}>
                      <TextDefault
                        style={{ maxWidth: '90%' }}
                        textColor={colors.fontMainColor}
                        numberOfLines={1}>
                        {item.title}
                      </TextDefault>
                      <TouchableOpacity
                        disabled={loadingMutation}
                        onPress={() => {
                          indexSetterDelete(index)
                          handleRemove(item.id)
                        }}
                        style={styles.removeButton}>
                        {loadingMutation && indexDelete === index ? (
                          <Spinner size="small" />
                        ) : (
                          <FontAwesome
                            name="trash-o"
                            size={scale(20)}
                            color={colors.fontSecondColor}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.priceContainer}>
                      <TextDefault textColor={colors.fontMainColor} H5 bold>
                        {item.price}
                      </TextDefault>
                      <TextDefault
                        textColor={colors.fontSecondColor}
                        style={styles.priceText}>
                        {' SR'}
                      </TextDefault>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <BottomTab screen="Favourite" />
      </View>
    </SafeAreaView>
  )
}

export default Favourite
