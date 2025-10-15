import React, { useContext } from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../context/User'
import { scale, colors } from '../../utils'
import { Ionicons, SimpleLineIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'

function BottomTab(props) {
  const navigation = useNavigation()
  const { isLoggedIn, cartCount, orders } = useContext(UserContext)
  // Count pending orders
  const pendingOrdersCount = orders ? orders.filter(o => ['PENDING','DISPATCHED','ACCEPTED'].includes(o.status)).length : 0
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MainLanding')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'HOME' && styles.active
        ]}>
        <View style={styles.imgContainer}>
          <SimpleLineIcons
            name="home"
            color={colors.fontSecondColor}
            size={scale(20)}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchResults')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'SEARCH' && styles.active
        ]}>
        <View style={styles.imgContainer}>
          <Ionicons
            name="search"
            size={scale(27)}
            color={colors.fontSecondColor}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) navigation.navigate('ProfileDashboard')
          else navigation.navigate('SignIn')
        }}
        style={[
          styles.footerBtnContainer,
          props.screen === 'PROFILE' && styles.active
        ]}>
        <View style={styles.profileContainer}>
          <SimpleLineIcons
            name="user"
            size={scale(20)}
            color={colors.fontSecondColor}
          />
          {isLoggedIn &&
            (orders
              ? orders.filter(o =>
                ['PENDING', 'DISPATCHED', 'ACCEPTED'].includes(o.orderStatus)
              ).length > 0
              : false) && <View style={styles.profileBadge} />}
        </View>
      </TouchableOpacity>
      {/* Only show Orders button for logged in users */}
      {isLoggedIn && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          style={[
            styles.footerBtnContainer,
            props.screen === 'ORDERS' && styles.active
          ]}>
          <View style={styles.shoppingContainer}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={scale(24)}
              color={colors.fontSecondColor}
            />
            {pendingOrdersCount > 0 && (
              <View style={styles.shoppingBadgeContainer}>
                <Text style={styles.shoppingBadgeStyle}>{pendingOrdersCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {/* Instagram button for all users */}
      <TouchableOpacity
        onPress={() => Linking.openURL('https://www.instagram.com/alsoulajan/')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'INSTAGRAM' && styles.active
        ]}>
        <View style={styles.imgContainer}>
          <FontAwesome
            name="instagram"
            size={scale(24)}
            color={colors.fontSecondColor}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default BottomTab
