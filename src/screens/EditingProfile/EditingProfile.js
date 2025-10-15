import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  Image,
  Alert
} from 'react-native'
import styles from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  BottomTab,
  TextDefault,
  BackHeader,
  FlashMessage
} from '../../components'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons'
import { scale, colors } from '../../utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import MainBtn from '../../ui/Buttons/MainBtn'
import { updateUserProfile } from '../../firebase/userService'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import { showMessage } from 'react-native-flash-message'
import { db } from '../../firebase';
import { firebaseConfig } from '../../firebase/firebaseConfig';
import { getAuth, updateEmail as firebaseUpdateEmail, sendEmailVerification } from 'firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// ImgBB API Key
const IMGBB_API_KEY = '8cf974da9876d1e9db6a1d4e279430a0';

// خيارات طريقة السحب
const withdrawalOptions = [
  { label: 'تحويل مصرفي', value: 'bank_transfer' },
  { label: 'استلام كاش', value: 'cash' },
  { label: 'بطاقة مصرفية', value: 'credit_card' }
];

function EditingProfile(props) {
  const userContext = useContext(UserContext);
  const { profile, setProfile, orders, cart } = userContext;
  console.log('EditingProfile render', { profile, orders, cart });
  const route = useRoute()
  const [userEmail, setUserEmail] = useState(profile?.email ?? '')
  const [name, nameSetter] = useState(profile?.name ?? '')
  const [phone, phoneSetter] = useState(profile?.phone ?? '')
  const [country] = useState(profile?.country ?? '')
  const [withdrawalMethod, setWithdrawalMethod] = useState(profile?.withdrawalMethod ?? 'bank_transfer')
  const [withdrawalDetails, withdrawalDetailsSetter] = useState(profile?.withdrawalDetails ?? '')
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  
  // متغيرات للصورة
  const [image, setImage] = useState(profile?.photoURL || null)
  const [uploading, setUploading] = useState(false)
  
  // حقول إضافية لطريقة السحب
  const [bankName, setBankName] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  // ترجمة أسماء الدول إلى العربية
  const translateCountry = (country) => {
    const countries = {
      'Libya': 'ليبيا',
      'Egypt': 'مصر',
      'Tunisia': 'تونس',
      'Algeria': 'الجزائر',
      'libya': 'ليبيا',
      'egypt': 'مصر',
      'tunisia': 'تونس',
      'algeria': 'الجزائر',
      'ليبيا': 'ليبيا',
      'مصر': 'مصر',
      'تونس': 'تونس',
      'الجزائر': 'الجزائر'
    };
    return countries[country] || country || '-';
  }
  
  const backScreen = route.params ? route.params.backScreen : null
  const [nameError, nameErrorSetter] = useState(null)
  const [emailError, emailErrorSetter] = useState(null)
  const [withdrawalDetailsError, withdrawalDetailsErrorSetter] = useState(null)
  const navigation = useNavigation()
  const [loadingMutation, setLoadingMutation] = useState(false)
  
  // عند تحميل الصفحة، إذا كانت withdrawalMethod نص عربي، حولها إلى value المناسب
  useEffect(() => {
    if (profile?.withdrawalMethod) {
      const found = withdrawalOptions.find(opt => opt.label === profile.withdrawalMethod);
      if (found) setWithdrawalMethod(found.value);
      else if (withdrawalOptions.find(opt => opt.value === profile.withdrawalMethod)) setWithdrawalMethod(profile.withdrawalMethod);
      else setWithdrawalMethod(withdrawalOptions[0].value);
    } else {
      setWithdrawalMethod(withdrawalOptions[0].value);
    }
  }, [profile]);

  // تحديث البريد الإلكتروني
  const updateEmail = async () => {
    if (newEmail !== confirmEmail) {
      Alert.alert('خطأ', 'البريد الإلكتروني وتأكيده غير متطابقين');
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert('خطأ', 'البريد الإلكتروني غير صحيح');
      return;
    }

    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await firebaseUpdateEmail(auth.currentUser, newEmail);
        setUserEmail(newEmail);
        setShowEmailConfirmation(false);
        setNewEmail('');
        setConfirmEmail('');
        emailErrorSetter(null);
        await sendVerificationEmail(); // إرسال رابط التحقق بعد التحديث
        showMessage({
          message: 'تم تحديث البريد الإلكتروني وإرسال رابط التحقق',
          type: 'success',
          position: 'top',
          floating: true
        });
      } else {
        Alert.alert('خطأ', 'لم يتم العثور على مستخدم مسجل الدخول');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert('خطأ', 'فشل تحديث البريد الإلكتروني. حاول مرة أخرى.');
    }
  };

  // التحقق من صحة البريد الإلكتروني
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // اختيار صورة من المعرض
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('خطأ', 'نحتاج إلى إذن للوصول إلى معرض الصور الخاص بك');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // تقليل الجودة لتسريع الرفع
        base64: true, // إضافة base64 للرفع
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImage(asset.uri);
        await uploadImage(asset);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل اختيار الصورة');
      console.error('Pick image error:', error);
    }
  };
  
  // التقاط صورة من الكاميرا
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('خطأ', 'نحتاج إلى إذن للوصول إلى الكاميرا الخاصة بك');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImage(asset.uri);
        await uploadImage(asset);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل التقاط الصورة');
      console.error('Take photo error:', error);
    }
  };
  
  // رفع الصورة إلى ImgBB - إصلاح للعمل مع React Native
  const uploadImage = async (asset) => {
    try {
      setUploading(true);
      
      if (!asset.base64) {
        throw new Error('Base64 data not available');
      }
      
      // إنشاء كائن FormData بالطريقة الصحيحة لـ React Native
      const formData = new FormData();
      formData.append('image', asset.base64);
      
      // رفع الصورة إلى ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImage(data.data.url);
        showMessage({
          message: "تم رفع الصورة بنجاح",
          type: 'success',
          position: 'top',
          floating: true
        });
      } else {
        throw new Error(data.error?.message || 'فشل رفع الصورة');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('خطأ', 'فشل رفع الصورة. يرجى المحاولة مرة أخرى.');
      // العودة للصورة السابقة في حالة الفشل
      setImage(profile?.photoURL || null);
    } finally {
      setUploading(false);
    }
  };

  async function onCompleted(updatedData) {
    try {
      setProfile(prev => ({...prev, ...updatedData}));
      showMessage({
        message: "تم تحديث المعلومات بنجاح",
        type: 'success',
        position: 'top',
        floating: true
      });
      
      if (backScreen) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update completion error:', error);
    }
  }
  
  function onError(error) {
    console.error('Update error:', error);
    const message = error?.message || 'حدث خطأ أثناء تحديث المعلومات';
    showMessage({ message, type: 'warning', position: 'top', floating: true });
  }

  // دالة لإرجاع رمز الدولة حسب البلد
  function getCountryCode(country) {
    const c = (country || '').toLowerCase();
    switch (c) {
      case 'ليبيا':
      case 'libya':
        return '+218';
      case 'مصر':
      case 'egypt':
        return '+20';
      case 'تونس':
      case 'tunisia':
        return '+216';
      case 'الجزائر':
      case 'algeria':
        return '+213';
      default:
        return '';
    }
  }

  // اجعل حقل الهاتف غير قابل للتعديل فقط للعرض، وأزل أي منطق أو نافذة منبثقة لتعديله أو التحقق منه
  // في حقل رقم الهاتف:
  const [phoneError, setPhoneError] = useState('');

  async function handleUpdate() {
    if (!name.trim()) {
      nameErrorSetter('الاسم الكامل مطلوب');
      return;
    }
    if (!userEmail.trim()) {
      emailErrorSetter('البريد الإلكتروني مطلوب');
      return;
    }
    setLoadingMutation(true);
    try {
      // تجهيز withdrawalDetails حسب طريقة السحب
      let withdrawalDetailsToSave = '';
      if (withdrawalMethod === 'bank_transfer') {
        withdrawalDetailsToSave = `البنك/المصرف: ${bankName}\nاسم المستفيد: ${beneficiaryName}\nرقم الحساب: ${accountNumber}`;
      } else if (withdrawalMethod === 'credit_card') {
        withdrawalDetailsToSave = `البنك: ${bankName}\nاسم صاحب البطاقة: ${cardHolderName}\nرقم البطاقة: ${cardNumber}`;
      } else if (withdrawalMethod === 'cash') {
        withdrawalDetailsToSave = withdrawalDetails.trim();
      }
      const updatedData = {
        name: name.trim(),
        email: userEmail.trim(),
        phone: phone,
        photoURL: image,
        withdrawalMethod,
        withdrawalDetails: withdrawalDetailsToSave,
        updatedAt: new Date().toISOString()
      };
      await updateUserProfile(profile.uid, updatedData);
      await onCompleted(updatedData);
    } catch (error) {
      onError(error);
    } finally {
      setLoadingMutation(false);
    }
  }

  function closeEmailModal() {
    setShowEmailConfirmation(false);
    setNewEmail('');
    setConfirmEmail('');
  }

  async function sendVerificationEmail() {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        showMessage({ message: 'تم إرسال رابط التحقق إلى بريدك الإلكتروني', type: 'success' });
      } else {
        showMessage({ message: 'لم يتم العثور على مستخدم مسجل الدخول', type: 'danger' });
      }
    } catch (error) {
      showMessage({ message: 'حدث خطأ أثناء إرسال رابط التحقق', type: 'danger' });
    }
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      {/* Back Button Only */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        marginBottom: 4,
        zIndex: 10,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: colors.whiteColor,
            borderRadius: 8,
            paddingVertical: 7,
            paddingHorizontal: 18,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.10,
            shadowRadius: 3,
            borderWidth: 1,
            borderColor: '#EEE',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={[styles.formMainContainer]}>
            <View style={styles.formContainer}>
              {/* في View الذي يحتوي صورة البروفايل: */}
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={() => {
                  if (uploading) return;
                  Alert.alert(
                    'تغيير الصورة الشخصية',
                    'اختر مصدر الصورة',
                    [
                      { text: 'إلغاء', style: 'cancel' },
                      { text: 'الكاميرا', onPress: takePhoto },
                      { text: 'معرض الصور', onPress: pickImage }
                    ]
                  );
                }}
                activeOpacity={0.7}
                disabled={uploading}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <SimpleLineIcons
                    name="user"
                    size={scale(40)}
                    color={colors.fontBrown}
                  />
                )}
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    if (uploading) return;
                    Alert.alert(
                      'تغيير الصورة الشخصية',
                      'اختر مصدر الصورة',
                      [
                        { text: 'إلغاء', style: 'cancel' },
                        { text: 'الكاميرا', onPress: takePhoto },
                        { text: 'معرض الصور', onPress: pickImage }
                      ]
                    );
                  }}
                  disabled={uploading}
                >
                  <Ionicons 
                    name="camera" 
                    size={scale(18)} 
                    color="white" 
                  />
                </TouchableOpacity>
                {uploading && (
                  <View style={styles.uploadingOverlay}>
                    <TextDefault small textColor="white">
                      جاري التحميل...
                    </TextDefault>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.formContentContainer}>
                {/* Full Name */}
                <View style={styles.oneItemContainer}>
                  <View style={styles.fullContainer}>
                    <View style={styles.labelContainer}>
                      <TextDefault textColor={colors.fontThirdColor} H5>
                        الاسم الكامل
                      </TextDefault>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        !!nameError && styles.error
                      ]}>
                      <TextInput
                        value={name}
                        style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                        placeholder="مثال: محمد أحمد"
                        placeholderTextColor={colors.fontPlaceholder}
                        onChangeText={nameSetter}
                        maxLength={50}
                      />
                    </View>
                    {!!nameError && (
                      <TextDefault textColor={colors.errorColor} small>
                        {nameError}
                      </TextDefault>
                    )}
                  </View>
                </View>

                {/* Email */}
                <View style={styles.oneItemContainer}>
                  <View style={styles.fullContainer}>
                    <View style={styles.labelContainer}>
                      <TextDefault textColor={colors.fontThirdColor} H5>
                        البريد الإلكتروني
                      </TextDefault>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        !!emailError && styles.error
                      ]}>
                      <TextInput
                        style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                        value={userEmail}
                        placeholder="example@email.com"
                        placeholderTextColor={colors.fontPlaceholder}
                        editable={false}
                      />
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setNewEmail(userEmail);
                          setConfirmEmail(userEmail);
                          setShowEmailConfirmation(true);
                        }}
                      >
                        <SimpleLineIcons
                          name="pencil"
                          size={scale(15)}
                          color={colors.fontMainColor}
                        />
                      </TouchableOpacity>
                    </View>
                    {!!emailError && (
                      <TextDefault textColor={colors.errorColor} small>
                        {emailError}
                      </TextDefault>
                    )}
                  </View>
                </View>

                {/* Phone Number - غير قابل للتعديل */}
                <View style={styles.oneItemContainer}>
                  <View style={styles.fullContainer}>
                    <View style={styles.labelContainer}>
                      <TextDefault textColor={colors.fontThirdColor} H5>
                        رقم الهاتف
                      </TextDefault>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                        value={phone}
                        onChangeText={phoneSetter}
                        placeholder="رقم الهاتف"
                        placeholderTextColor={colors.fontPlaceholder}
                        keyboardType="phone-pad"
                        editable={true}
                      />
                    </View>
                    {phoneError ? (
                      <TextDefault textColor={colors.errorColor} small>{phoneError}</TextDefault>
                    ) : null}
                  </View>
                </View>

                {/* Country - غير قابل للتعديل */}
                <View style={styles.oneItemContainer}>
                  <View style={styles.fullContainer}>
                    <View style={styles.labelContainer}>
                      <TextDefault textColor={colors.fontThirdColor} H5>
                        الدولة
                      </TextDefault>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.flex, styles.disableInput, { writingDirection: 'rtl' }]}
                        value={translateCountry(country)}
                        editable={false}
                      />
                      <TextDefault small textColor={colors.fontPlaceholder} style={styles.disabledNote}>
                        (لا يمكن تغييرها)
                      </TextDefault>
                    </View>
                  </View>
                </View>

                {/* Withdrawal Method */}
                <View style={styles.oneItemContainer}>
                  <View style={styles.fullContainer}>
                    <View style={styles.labelContainer}>
                      <TextDefault textColor={colors.fontThirdColor} H5>
                        طريقة السحب
                      </TextDefault>
                    </View>
                    <View style={styles.inputContainer}>
                      <Picker
                        selectedValue={withdrawalMethod}
                        onValueChange={setWithdrawalMethod}
                        style={{ flex: 1 }}
                      >
                        <Picker.Item label="حساب مصرفي" value="bank_transfer" />
                        <Picker.Item label="استلام كاش" value="cash" />
                        <Picker.Item label="بطاقة مصرفية" value="credit_card" />
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* Withdrawal Details for bank_transfer */}
                {withdrawalMethod === 'bank_transfer' && (
                  <>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            اسم البنك أو المصرف
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={bankName}
                            placeholder="اسم البنك أو المصرف"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setBankName}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            اسم المستفيد
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={beneficiaryName}
                            placeholder="اسم المستفيد"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setBeneficiaryName}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            رقم الحساب
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={accountNumber}
                            placeholder="رقم الحساب"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setAccountNumber}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>
                  </>
                )}

                {/* Withdrawal Details for credit_card */}
                {withdrawalMethod === 'credit_card' && (
                  <>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            اسم البنك
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={bankName}
                            placeholder="اسم البنك"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setBankName}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            اسم صاحب البطاقة
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={cardHolderName}
                            placeholder="اسم صاحب البطاقة"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setCardHolderName}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.oneItemContainer}>
                      <View style={styles.fullContainer}>
                        <View style={styles.labelContainer}>
                          <TextDefault textColor={colors.fontThirdColor} H5>
                            رقم البطاقة
                          </TextDefault>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[styles.flex, styles.inputText, { writingDirection: 'rtl' }]}
                            value={cardNumber}
                            placeholder="رقم البطاقة"
                            placeholderTextColor={colors.fontPlaceholder}
                            onChangeText={setCardNumber}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.addContainer}>
                <MainBtn
                  loading={loadingMutation}
                  style={{ width: '80%', marginTop: 30 }}
                  onPress={handleUpdate}
                  text="حفظ المعلومات"
                  disabled={uploading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomTab screen="PROFILE" />

      {/* نافذة تأكيد البريد الإلكتروني */}
      <Modal
        visible={showEmailConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEmailModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeEmailModal}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
          >
            <View style={styles.modalHeader}>
              <TextDefault H4 textColor={colors.fontMainColor}>
                تغيير البريد الإلكتروني
              </TextDefault>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputField}>
                <TextDefault textColor={colors.fontThirdColor} small>
                  البريد الإلكتروني الجديد
                </TextDefault>
                <TextInput
                  style={styles.modalInput}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="أدخل البريد الإلكتروني الجديد"
                  placeholderTextColor={colors.fontPlaceholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputField}>
                <TextDefault textColor={colors.fontThirdColor} small>
                  تأكيد البريد الإلكتروني
                </TextDefault>
                <TextInput
                  style={styles.modalInput}
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  placeholder="أعد إدخال البريد الإلكتروني"
                  placeholderTextColor={colors.fontPlaceholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton, { marginBottom: 8 }]}
                  onPress={closeEmailModal}
                >
                  <TextDefault textColor="white">
                    إلغاء
                  </TextDefault>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary, marginBottom: 0 }]}
                  onPress={updateEmail}
                >
                  <TextDefault textColor="white">
                    إرسال رابط التحقق
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default EditingProfile