import React, { useState, useContext } from 'react'
import {
  View,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import * as Notifications from 'expo-notifications';
import styles from './styles'
import { colors, alignment } from '../../utils'
import TextField from '../../ui/Textfield/Textfield'
import MainBtn from '../../ui/Buttons/MainBtn'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextDefault } from '../../components'
import UserContext from '../../context/User'
import { useNavigation } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown'
import { signUpUser } from '../../firebase'
import { showMessage } from 'react-native-flash-message';
import { RadioBtn } from '../../components/RadioBtn/RadioBtn'

// قائمة الدول مع رموز الاتصال والأعلام
const countries = [
  { label: 'ليبيا', value: 'libya', flag: '🇱🇾', code: '+218' },
  { label: 'مصر', value: 'egypt', flag: '🇪🇬', code: '+20' },
  { label: 'تونس', value: 'tunisia', flag: '🇹🇳', code: '+216' },
  { label: 'الجزائر', value: 'algeria', flag: '🇩🇿', code: '+213' }
];

function SignUp(props) {
  const navigation = useNavigation()
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('libya')
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // ليبيا كبلد افتراضي
  const [nameError, setNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [countryError, setCountryError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [generalError, setGeneralError] = useState(null)
  const [userType, setUserType] = useState(null)
  const [userTypeError, setUserTypeError] = useState(null)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const { isLoggedIn } = useContext(UserContext)

  // Check if user is already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('MainLanding')
    }
  }, [isLoggedIn])

  function validateCredentials() {
    let result = true

    setEmailError(null)
    setPasswordError(null)
    setNameError(null)
    setCountryError(null)
    setUserTypeError(null)
    setPhoneError(null)
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email.trim())) {
      setEmailError('يرجى إدخال عنوان بريد إلكتروني صحيح')
      result = false
    }
    if (!password || password.length < 6) {
      setPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      result = false
    }
    if (!fullname || fullname.length < 3) {
      setNameError('الاسم الكامل مطلوب')
      result = false
    }
    if (!country) {
      setCountryError('الرجاء اختيار البلد')
      result = false
    }
    if (!userType) {
      setUserTypeError('يجب اختيار نوع الحساب')
      result = false
    }
    if (!phone || phone.length < 7) {
      setPhoneError('يرجى إدخال رقم هاتف صحيح')
      result = false
    }
    return result
  }

  async function handleSignUp() {
    try {
      setLoading(true)
      setGeneralError(null)
      // دمج رمز الدولة مع رقم الهاتف
      const fullPhone = `${selectedCountry.code}${phone.trim()}`;
      const userData = {
        name: fullname.trim(),
        phone: fullPhone,
        country: country,
        photoURL: '',
        withdrawalMethod: '', // حقل وسيلة السحب فارغ
        userType: userType, // add user type
      }
      const user = await signUpUser(email.trim(), password, userData)
      console.log('User signed up successfully:', user.uid)

      // Show creating account message and wait for Firestore propagation
      showMessage({
        message: 'جاري انشاء حسابك...',
        type: 'info',
        position: 'top',
        duration: 1500
      })
      await new Promise(resolve => setTimeout(resolve, 1200));

      showMessage({
        message: 'تم إنشاء الحساب بنجاح',
        type: 'success',
        position: 'top'
      })

      navigation.navigate('MainLanding')
    } catch (error) {
      console.error('Sign up error:', error)
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'البريد الإلكتروني مستخدم بالفعل'
          break
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح'
          break
        case 'auth/weak-password':
          errorMessage = 'كلمة المرور ضعيفة'
          break
        case 'auth/operation-not-allowed':
          errorMessage = 'إنشاء الحسابات غير مسموح حالياً'
          break
        default:
          errorMessage = error.message || 'حدث خطأ أثناء إنشاء الحساب'
      }
      
      setGeneralError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle, { writingDirection: 'rtl' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.flex}>
          <View style={styles.container}>
            <View style={styles.body}>
              <View style={styles.header}>
                <TextDefault
                  textColor={colors.fontMainColor}
                  H5
                  bold
                  style={{ ...alignment.PLsmall }}>
                  {'تسجيل عضوية جديدة'}
                </TextDefault>
              </View>
              <View style={styles.main}>
                <ImageBackground
                  style={styles.bodyContainerBackground}
                  source={require('../../assets/images/formBackground.png')}
                  resizeMode="cover">
                  <View style={styles.mainTop}>
                    <TextDefault textColor={colors.fontMainColor} H4 bold>
                      {'أهلاً و سهلاً بك في الصولجان ❤️'}
                    </TextDefault>
                    <TextDefault textColor={colors.fontSecondColor}>
                      {'انشئ حسابك معنا وأبدأ الربح أو التبضع'}
                    </TextDefault>
                    {generalError && (
                      <View style={styles.generalErrorBox}>
                        <TextDefault textColor={colors.errorColor} style={{textAlign: 'center'}}>
                          {generalError}
                        </TextDefault>
                      </View>
                    )}
                  </View>
                  <View style={styles.mainMid}>
                    <View style={alignment.MBsmall}>
                      <TextField
                        error={!!nameError}
                        placeholder="الاسم الكامل"
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="next"
                        onChange={event => {
                          setFullname(event.nativeEvent.text.trim())
                        }}
                      />
                      {!!nameError ? (
                        <TextDefault textColor={colors.errorColor} small>
                          {nameError}
                        </TextDefault>
                      ) : (
                        <TextDefault textColor={colors.fontThirdColor} small style={styles.legalNameText}>
                          الرجاء استخدام الاسم الكامل القانوني
                        </TextDefault>
                      )}
                    </View>
                    <View style={alignment.MBsmall}>
                      <TextField
                        error={!!emailError}
                        placeholder="البريد الإلكتروني"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onChange={event => {
                          setEmail(event.nativeEvent.text.toLowerCase().trim())
                        }}
                      />
                      {!!emailError && (
                        <TextDefault textColor={colors.errorColor} small>
                          {emailError}
                        </TextDefault>
                      )}
                    </View>
                    <View style={alignment.MBsmall}>
                      <Dropdown
                        style={[styles.simpleDropdown, !!countryError && { borderColor: colors.errorColor }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={countries}
                        search={false}
                        maxHeight={200}
                        labelField="label"
                        mode="flat"
                        valueField="value"
                        placeholder="اختر البلد"
                        value={country}
                        renderRightIcon={() => null}
                        onChange={item => {
                          setCountry(item.value);
                          setSelectedCountry(item);
                          setCountryError(null);
                        }}
                        renderItem={item => (
                          <View style={styles.dropdownItem}>
  <TextDefault style={styles.flagText}>{item.flag}</TextDefault>
  <TextDefault style={styles.countryItemText}>{item.label}</TextDefault>
  <TextDefault style={styles.codeText}>{item.code}</TextDefault>
                          </View>
                        )}
                      />
                      {!!countryError && (
                        <TextDefault textColor={colors.errorColor} small>
                          {countryError}
                        </TextDefault>
                      )}
                    </View>
                    <View style={alignment.MBsmall}>
                      <View style={styles.phoneInputContainer}>
                        <View style={styles.phonePrefix}>
                          <TextDefault style={styles.flagText}>{selectedCountry.flag}</TextDefault>
                          <TextDefault style={styles.codeText}>{selectedCountry.code}</TextDefault>
                        </View>
                        <TextField
                          error={!!phoneError}
                          placeholder="رقم الهاتف"
                          keyboardType="phone-pad"
                          returnKeyType="next"
                          containerStyle={styles.phoneInput}
                          inputStyle={{ textAlign: 'left' }}
                          onChange={event => setPhone(event.nativeEvent.text.trim())}
                        />
                      </View>
                      {!!phoneError && (
                        <TextDefault textColor={colors.errorColor} small>
                          {phoneError}
                        </TextDefault>
                      )}
                    </View>
                    <View style={alignment.MBsmall}>
                      <TextField
                        error={!!passwordError}
                        placeholder="كلمة المرور"
                        password={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
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
                  </View>
                  <View style={{width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                    <TextDefault bold style={{marginBottom: 6}}>{'هل أنت:'}</TextDefault>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 10}}
                        onPress={() => setUserType('Seller')}
                      >
                        <View style={{
                          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: userType === 'Seller' ? colors.brownColor : colors.fontThirdColor, alignItems: 'center', justifyContent: 'center', marginRight: 6
                        }}>
                          {userType === 'Seller' && <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: colors.brownColor}} />}
                        </View>
                        <TextDefault>{'بائع'}</TextDefault>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 10}}
                        onPress={() => setUserType('Customer')}
                      >
                        <View style={{
                          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: userType === 'Customer' ? colors.brownColor : colors.fontThirdColor, alignItems: 'center', justifyContent: 'center', marginRight: 6
                        }}>
                          {userType === 'Customer' && <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: colors.brownColor}} />}
                        </View>
                        <TextDefault>{'متسوق'}</TextDefault>
                      </TouchableOpacity>
                    </View>
                    {userTypeError && (
                      <TextDefault textColor={colors.errorColor} small style={{marginTop: 5}}>
                        {userTypeError}
                      </TextDefault>
                    )}
                  </View>
                  <View style={styles.mainBot}>
                    <View style={styles.botBtnContainer}>
                      <MainBtn
                        loading={loading}
                        onPress={async() => {
                          if (validateCredentials()) {
                            await handleSignUp()
                          }
                        }}
                        text="إنشاء حساب"
                      />
                    </View>
                    <View style={styles.mixedLine}>
                      <TextDefault textColor={colors.fontSecondColor}>
                        {'لديك حساب؟ '}
                        <TextDefault
                          style={styles.ftTextUnderline}
                          textColor={colors.fontMainColor}
                          onPress={() => navigation.navigate('SignIn')}>
                          {'سجل الدخول'}
                        </TextDefault>
                      </TextDefault>
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

export default SignUp
