import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from 'react-native'
import styles from './styles'
import * as Notifications from 'expo-notifications'
import { colors, scale } from '../../utils'
import { TextDefault, Spinner } from '../../components'
import TextField from '../../ui/Textfield/Textfield'
import ForgotPassword from './ForgotPassword/ForgotPassword'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SimpleLineIcons } from '@expo/vector-icons'

import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import { FlashMessage } from '../../components/FlashMessage/FlashMessage'
import MainBtn from '../../ui/Buttons/MainBtn'
import AlternateBtn from '../../ui/Buttons/AlternateBtn'
import { signInUser } from '../../firebase'

function SignIn(props) {
  const navigation = useNavigation()
  const route = useRoute()
  const cartAddress = route.params?.backScreen ?? null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loginButton, loginButtonSetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useContext(UserContext)
  const [generalError, setGeneralError] = useState(null)

  function showModal() {
    setModalVisible(true)
  }

  function hideModal() {
    setModalVisible(false)
  }

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      if (cartAddress === 'Cart') navigation.goBack()
      else navigation.navigate('MainLanding')
    }
  }, [isLoggedIn])

  function validateCredentials() {
    let result = true
    setEmailError(null)
    setPasswordError(null)
    console.log('email', email, 'password', password)
    if (!email) {
      setEmailError('البريد الإلكتروني مطلوب')
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(email.toLowerCase()) !== true) {
        setEmailError('بريد إلكتروني غير صحيح')
        result = false
      }
    }
    if (!password) {
      setPasswordError('كلمة المرور مطلوبة')
      result = false
    }
    return result
  }

  async function handleSignIn() {
    try {
      setLoading(true)
      setGeneralError(null)
      const user = await signInUser(email.toLowerCase(), password)
      console.log('User signed in successfully:', user.uid)
      
      FlashMessage({
        message: 'تم تسجيل الدخول بنجاح',
        type: 'success',
        position: 'top'
      })
      
      if (cartAddress === 'Cart') navigation.goBack()
      else navigation.navigate('MainLanding')
    } catch (error) {
      console.error('Sign in error:', error)
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول'
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'المستخدم غير موجود'
          break
        case 'auth/wrong-password':
          errorMessage = 'كلمة المرور غير صحيحة'
          break
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح'
          break
        case 'auth/user-disabled':
          errorMessage = 'تم تعطيل هذا الحساب'
          break
        case 'auth/too-many-requests':
          errorMessage = 'محاولات كثيرة، حاول لاحقاً'
          break
        default:
          errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول'
      }
      
      setGeneralError(errorMessage)
    } finally {
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  function rennderLogin() {
    return (
      <MainBtn
        loading={loading && loginButton === 'Login'}
        onPress={async () => {
          loginButtonSetter('Login')
          if (validateCredentials()) {
            await handleSignIn()
          } else {
            loginButtonSetter(null)
          }
        }}
        text="تسجيل الدخول"
      />
    )
  }

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <ForgotPassword modalVisible={modalVisible} hideModal={hideModal} />
            <View style={styles.body}>
              <View style={styles.bodyHeader}>
                <SimpleLineIcons
                  name="user"
                  size={scale(22)}
                  color={colors.brownColor}
                  style={{ marginRight: scale(10) }}
                />
                <TextDefault
                  style={styles.headerText}
                  textColor={colors.fontMainColor}
                  H5
                  bold>
                  {'دخول الأعضاء'}
                </TextDefault>
              </View>
              <View style={styles.bodyContainer}>
                <ImageBackground
                  style={styles.bodyContainerBackground}
                  source={require('../../assets/images/formBackground.png')}>
                  <View style={styles.logoContainer}>
                    <Image
                      source={require('../../../assets/icon.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.bcTexts}>
                    <TextDefault textColor={colors.fontMainColor} H3 bold>
                      {'مرحباً بك مجدداً!'}
                    </TextDefault>
                    <TextDefault textColor={colors.fontSecondColor} style={{marginTop: 5}}>
                      {'سجل دخولك للمتابعة'}
                    </TextDefault>
                    {generalError && (
                      <View style={styles.generalErrorBox}>
                        <TextDefault textColor={colors.errorColor} style={{textAlign: 'center'}}>
                          {generalError}
                        </TextDefault>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.bcMain}>
                    <View>
                      <TextField
                        error={!!emailError}
                        placeholder="البريد الإلكتروني"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChange={event => {
                          setEmail(event.nativeEvent.text.trim())
                        }}
                      />
                      {!!emailError && (
                        <TextDefault textColor={colors.errorColor} small>
                          {emailError}
                        </TextDefault>
                      )}
                    </View>
                    <View>
                      <TextField
                        error={!!passwordError}
                        placeholder="كلمة المرور"
                        password={true}
                        value={password}
                        onChange={event => {
                          setPassword(event.nativeEvent.text.trim())
                        }}
                      />
                      {!!passwordError && (
                        <TextDefault textColor={colors.errorColor} small>
                          {passwordError}
                        </TextDefault>
                      )}
                    </View>
                    {rennderLogin()}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.forgotPasswordText}
                      onPress={() => showModal()}>
                      <TextDefault textColor={colors.google}>
                        {'نسيت كلمة المرور؟'}
                      </TextDefault>
                    </TouchableOpacity>
                    <View style={styles.registerBtnContainer}>
                      <AlternateBtn
                        onPress={() => navigation.navigate('SignUp')}
                        text="إنشاء حساب"
                      />
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignIn
