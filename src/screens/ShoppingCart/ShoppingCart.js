import React, { useContext, useEffect, useState } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import styles from './styles'
import {
  BackHeader,
  BottomTab,
  FlashMessage,
  TextDefault,
  TextError
} from '../../components'
import ShoppingCard from './ShoppingCard/ShoppingCard'
import BlueBtn from '../../ui/Buttons/BlueBtn'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { getProductById } from '../../firebase'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import { colors } from '../../utils'
import MainBtn from '../../ui/Buttons/MainBtn'

function ShoppingCart(props) {
   const navigation = useNavigation()
   const isFocused = useIsFocused()
   const configuration = useContext(ConfigurationContext)
   const {
     cart,
     updateCart,
     addQuantity: addQuantityContext,
     removeQuantity
   } = useContext(UserContext)
   const [products, setProducts] = useState([])
  // const setLoadingData = useState(true)[1]

  useEffect(() => {
    didFocus()
  }, [cart])

  async function didFocus() {
    try {
      if (cart && cart.length) {
        // Fetch each product by ID from Firebase
        const fetched = await Promise.all(
          cart.map(item => getProductById(item._id))
        )
        const merged = fetched.map((prod, idx) => ({
          ...cart[idx],
          ...prod,
          image: prod.mainImage,
          key: cart[idx].key,
          price: prod.price,
        }))
        setProducts(merged)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products in cart:', error)
    }
  }

  async function checkStock(cartData) {
    let stockCheck = true
    const product = products.find(p => p._id === cartData._id)
    if (product) {
      cartData.selectedAttributes.forEach(item => {
        const attribute = product.attributes.find(
          data => data.attributeId === item.attributeId
        )

        if (!attribute) stockCheck = false
        const option = attribute.options.find(
          op => op.optionId === item.option.optionId
        )
        if (!option) stockCheck = false
        if (!option.stock) stockCheck = false
        if (option.stock > cartData.quantity) {
          stockCheck = true
        } else {
          stockCheck = false
        }
      })
    }
    return stockCheck
  }

  async function addQuantity(key) {
    const cartData = cart.find(c => c.key === key)
    if (cartData) {
      const check = await checkStock(cartData)
      if (check) {
        await addQuantityContext(key)
      } else {
        FlashMessage({
          message: 'لا يوجد مزيد من العناصر في المخزون'
        })
      }
    }
  }

  function empty() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/images/activeOrder.png')}></Image>
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault textColor={colors.fontSecondColor} bold center>
            {'There is no item in the cart.'}
          </TextDefault>
        </View>
        <View style={styles.emptyButton}>
          <MainBtn
            style={{ width: '100%' }}
            onPress={() => navigation.navigate('MainLanding')}
            text="تصفح المنتجات"
          />
        </View>
      </View>
    )
  }

  function calculatePrice(deliveryCharges = 0) {
    let itemTotal = 0
    cart.forEach(cartItem => {
      if (!cartItem.price) {
        return
      }
      itemTotal += cartItem.price * cartItem.quantity
    })
    return (itemTotal + deliveryCharges).toFixed(2)
  }

  function PriceContainer() {
    return (
      <View style={styles.priceBox}>
        <View style={styles.summaryContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.textStyle}>Sub Total</Text>
            <Text style={styles.textStyle}>
              {configuration.currencySymbol} {calculatePrice(0)}
            </Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.rowContainer}>
            <Text style={styles.textStyle}>Delivery</Text>
            <Text style={styles.textStyle}>
              {configuration.currencySymbol}{' '}
              {parseFloat(configuration.deliveryCharges).toFixed(2)}
            </Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.lineStyle} />
          <View style={styles.spacer} />
          <View style={styles.rowContainer}>
            <Text style={styles.textStyle}>Total</Text>
            <Text style={[styles.textStyle, styles.totalStyle]}>
              {configuration.currencySymbol}{' '}
              {calculatePrice(configuration.deliveryCharges)}
            </Text>
          </View>
          <View style={styles.spacer} />
          <BlueBtn
            onPress={() => navigation.navigate('Checkout')}
            text="متابعة"
          />
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <View style={[styles.flex, styles.mainContainer]}>
        <BackHeader title="السلة" backPressed={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <FlatList
            data={Array.isArray(cart) ? cart : []}
            style={styles.flex}
            keyExtractor={item => item.key}
            ListEmptyComponent={empty()}
            contentContainerStyle={styles.subContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ShoppingCard
                key={item.key}
                item={item}
                quantity={item.quantity}
                price={(parseFloat(item.price) * item.quantity).toFixed(2)}
                addQuantity={() => {
                  addQuantity(item.key)
                }}
                removeQuantity={() => {
                  removeQuantity(item.key)
                }}
              />
            )}
          />
          {!!cart.length && <PriceContainer />}
        </View>
        <BottomTab screen="CART" />
      </View>
    </SafeAreaView>
  )
}
export default ShoppingCart
