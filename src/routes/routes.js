import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import navigationService from './navigationService'
import * as Notifications from 'expo-notifications'
import * as Screen from '../screens'
import Orders from '../screens/Orders/Orders'
import WithdrawalRequests from '../screens/Orders/WithdrawalRequests'

const NavigationStack = createStackNavigator()

function RootNavigator() {
  return (
    <NavigationStack.Navigator screenOptions={{ headerShown: false }}>
      <NavigationStack.Screen
        name="MainLanding"
        component={Screen.MainLanding}
      />
      <NavigationStack.Screen
        name="ProductListing"
        component={Screen.ProductListing}
      />
      <NavigationStack.Screen
        name="ProductDescription"
        component={Screen.ProductDescription}
      />
      <NavigationStack.Screen
        name="ProfileDashboard"
        component={Screen.ProfileDashboard}
      />
      <NavigationStack.Screen
        name="SearchResults"
        component={Screen.SearchResults}
      />
      <NavigationStack.Screen name="Orders" component={Orders} />
      <NavigationStack.Screen name="WithdrawalRequests" component={WithdrawalRequests} />
      <NavigationStack.Screen
        name="EditingProfile"
        component={Screen.EditingProfile}
      />
      <NavigationStack.Screen
        name="PreviousOrders"
        component={Screen.PreviousOrders}
      />
      <NavigationStack.Screen
        name="Favourite"
        component={Screen.Favourite}
      />
      <NavigationStack.Screen
        name="ShoppingCart"
        component={Screen.ShoppingCart}
      />
      <NavigationStack.Screen
        name="OrderDetail"
        component={Screen.OrderDetail}
      />
      <NavigationStack.Screen name="SignIn" component={Screen.SignIn} />
      <NavigationStack.Screen name="SignUp" component={Screen.SignUp} />
    </NavigationStack.Navigator>
  )
}

function AppContainer() {
  function _handleNotification(notification) {
    try {
      if (notification?.origin === 'selected') {
        if (notification?.data?.order) {
          navigationService.navigate('OrderDetail', {
            _id: notification?.data?._id || null
          })
        }
      }
    } catch (e) {
      console.log('Notification error:', e)
    }
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
      })
    })
    const subscription =
      Notifications.addNotificationResponseReceivedListener(_handleNotification)
    return () => subscription.remove()
  }, [])

  return (
    <NavigationContainer
      ref={ref => {
        navigationService.setGlobalRef(ref)
      }}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default AppContainer
