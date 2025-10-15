import React, { useState, useEffect } from 'react'
import { Platform, View, StatusBar, I18nManager } from 'react-native'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import { ConfigurationProvider } from './src/context/Configuration'
import { UserProvider } from './src/context/User'
import { colors } from './src/utils/colors'
import FlashMessage from 'react-native-flash-message'

// المسارات والترجمات
import './src/utils/translations'
import { enableRTL } from './src/utils/I18nManager'

// استدعاء الملاح (Routes)
import AppContainer from './src/routes/routes'

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // تحميل الخطوط المطلوبة
        await Font.loadAsync({
          'Poppins-Regular': require('./src/assets/font/Poppins/Poppins-Regular.ttf'),
          'Poppins-Bold': require('./src/assets/font/Poppins/Poppins-Bold.ttf'),
          'DGAgnadeen-Regular': require('./src/assets/font/Poppins/DGAgnadeen-Regular.ttf'),
          'DGAgnadeen-Light': require('./src/assets/font/Poppins/DGAgnadeen-Light.ttf')
        })

        // صلاحيات الإشعارات
        await permissionForPushNotificationsAsync()
      } catch (e) {
        console.warn(e)
      } finally {
        setFontLoaded(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    enableRTL();
  }, []);

  async function permissionForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') return

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.brownColor
      })
    }
  }

  if (!fontLoaded) return null

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.headerbackground}
      />
      <ConfigurationProvider>
        <UserProvider>
          <AppContainer />
        </UserProvider>
      </ConfigurationProvider>
      <FlashMessage position="top" />
    </View>
  )
}
