import React, { useContext } from 'react'
import { TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { Spinner, TextError, TextDefault } from '../../../components'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../../context/User'
import { colors, scale } from '../../../utils'
import { Feather } from '@expo/vector-icons'

/* Config/Constants
============================================================================= */

function cardContainer(props) {
  const navigation = useNavigation()
  const {
    orders,
    loadingOrders,
    errorOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders
  } = useContext(UserContext)

  function emptyView() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../../assets/images/activeOrder.png')}
          />
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault textColor={colors.fontMainColor} center H4>
            لا توجد طلبات نشطة حالياً
          </TextDefault>
        </View>
      </View>
    )
  }

  function renderOrders() {
    if (loadingOrders || !orders) return <Spinner />
    if (errorOrders) return (
      <View style={styles.errorContainer}>
        <TextDefault textColor={colors.errorColor}>
          {typeof errorOrders === 'string' ? errorOrders : (errorOrders?.message || 'حدث خطأ')}
        </TextDefault>
      </View>
    )

    const filteredOrders = Array.isArray(orders) 
      ? orders.filter(o => {
          const status = String(o?.orderStatus || '').toUpperCase();
          return ['PENDING', 'DISPATCHED', 'ACCEPTED'].includes(status);
        }) 
      : [];

    if (filteredOrders.length === 0) {
      return emptyView();
    }

    return (
      <ScrollView 
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.mainCardContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            activeOpacity={1}
            onPress={() => navigation.navigate('OrderDetail', { _id: item._id })}
            style={styles.cardContainer}>
            <View style={styles.leftContainer}>
              <Image
                source={{
                  uri:
                    item?.items[0]?.image ??
                    'https://res.cloudinary.com/ecommero/image/upload/v1597658445/products/su6dg1ufmtfuvrjbhgtj.png'
                }}
                resizeMode="cover"
                style={[styles.imgResponsive, styles.roundedBorder]}
              />
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.subRightContainer}>
                <View style={styles.titleContainer}>
                  <TextDefault style={styles.titleStyle} numberOfLines={1}>
                    {String(item?.orderId || 'بدون رقم')}
                  </TextDefault>
                  <View style={styles.rightArrowContainer}>
                    <Feather
                      name="chevron-right"
                      size={scale(20)}
                      color={colors.fontSecondColor}
                    />
                  </View>
                </View>
                <View style={styles.subTitleContainer}>
                  <TextDefault numberOfLines={1} style={styles.subTtitleStyle}>
                    {String(item?.items?.[0]?.product || 'بدون اسم منتج')}
                  </TextDefault>
                </View>
                <View style={styles.actionsContainer}>
                  <View style={styles.subActionsContainer}>
                    <TextDefault style={styles.statusStyle} numberOfLines={1}>
                      {String(item?.orderStatus || 'معلق')}
                    </TextDefault>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>
                        navigation.navigate('TrackOrder', { _id: item?._id })
                      }
                      style={styles.actionContainer}>
                      <TextDefault style={styles.actionStyle}>
                        {'تتبع'}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  return renderOrders();
}

export default cardContainer
