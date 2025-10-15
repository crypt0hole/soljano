import React, { useContext, useMemo, useEffect } from 'react'
import { View, TouchableOpacity, ScrollView, ImageBackground, Image, Linking, Alert } from 'react-native'
import styles from './styles'
import { BottomTab, TextDefault } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../context/User'
import { colors } from '../../utils'
import { SimpleLineIcons, Feather, MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import MainBtn from '../../ui/Buttons/MainBtn'

function ProfileDashboard(props) {
  const navigation = useNavigation()
  const { profile, isLoggedIn, logout, orders, fetchOrders } = useContext(UserContext)

  // جلب الطلبات عند تحميل الصفحة
  useEffect(() => {
    if (isLoggedIn && fetchOrders) {
      fetchOrders();
    }
  }, [isLoggedIn, fetchOrders]);

  // تحويل حالة المستخدم ودوره إلى العربية
  const translateRole = (role) => {
    if (!role) return '-';
    const roles = {
      'admin': 'مدير',
      'seller': 'بائع', 
      'customer': 'عميل',
      'ADMIN': 'مدير',
      'SELLER': 'بائع',
      'CUSTOMER': 'عميل'
    };
    return roles[role.toString().toLowerCase()] || role;
  };

  const translateStatus = (status) => {
    if (!status) return '-';
    const statuses = {
      'active': 'نشط',
      'inactive': 'محظور',
      'banned': 'محظور',
      'suspended': 'معلق',
      'pending': 'قيد الانتظار',
      'ACTIVE': 'نشط',
      'INACTIVE': 'محظور',
      'BANNED': 'محظور',
      'SUSPENDED': 'معلق',
      'PENDING': 'قيد الانتظار'
    };
    return statuses[status.toString().toLowerCase()] || status;
  };

  // ترجمة أسماء الدول إلى العربية
  const translateCountry = (country) => {
    if (!country) return '-';
    const countries = {
      'libya': 'ليبيا',
      'egypt': 'مصر', 
      'tunisia': 'تونس',
      'algeria': 'الجزائر',
      'ليبيا': 'ليبيا',
      'مصر': 'مصر',
      'تونس': 'تونس', 
      'الجزائر': 'الجزائر'
    };
    return countries[country.toString().toLowerCase()] || country;
  };
  
  // حساب إجمالي الأرباح من الطلبات المكتملة
  const calculateTotalProfit = useMemo(() => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;
    
    try {
      // فلترة الطلبات المكتملة
      const completedOrders = orders.filter(order => {
        if (!order || !order.status) return false;
        const status = order.status.toString().toUpperCase();
        return status === 'DELIVERED' || status === 'COMPLETED';
      });
      
      // حساب إجمالي الأرباح من الطلبات المكتملة
      return completedOrders.reduce((sum, order) => {
        const profit = parseFloat(order.totalProfit) || 0;
        return sum + profit;
      }, 0);
    } catch (error) {
      console.warn('خطأ في حساب إجمالي الأرباح:', error);
      return 0;
    }
  }, [orders]);

  const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
    
    if (value instanceof Date) {
      return value.toLocaleDateString('ar-SA');
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '-';
      }
    }
    
    return value.toString();
  };

  // تنسيق تاريخ الإنشاء
  const formatCreatedAt = () => {
    if (!profile?.createdAt) return '-';
    
    try {
      // التعامل مع Firestore timestamp
      if (profile.createdAt.seconds) {
        return new Date(profile.createdAt.seconds * 1000).toLocaleDateString('ar-SA');
      }
      // التعامل مع تاريخ عادي
      return new Date(profile.createdAt).toLocaleDateString('ar-SA');
    } catch (error) {
      console.warn('خطأ في تنسيق التاريخ:', error);
      return '-';
    }
  };

  // دالة لتحديد لون الحالة
  const getStatusColor = (status) => {
    if (!status) return colors.fontSecondColor;
    const s = status.toString().toLowerCase();
    if (s === 'active' || s === 'نشط') return '#4CAF50'; // أخضر
    if (s === 'inactive' || s === 'banned' || s === 'محظور' || s === 'suspended' || s === 'معلق') return colors.errorColor; // أحمر
    if (s === 'pending' || s === 'قيد الانتظار') return '#FF9800'; // برتقالي
    return colors.fontSecondColor;
  };

  // أضف دالة الترجمة بعد دوال الترجمة الأخرى
  const translateWithdrawalMethod = (method) => {
    if (!method) return '-';
    const methods = {
      'bank_transfer': 'تحويل مصرفي',
      'cash': 'استلام كاش',
      'credit_card': 'بطاقة مصرفية',
      'تحويل مصرفي': 'تحويل مصرفي',
      'استلام كاش': 'استلام كاش',
      'بطاقة مصرفية': 'بطاقة مصرفية'
    };
    return methods[method] || method;
  };

  const userFields = [
    { label: 'الاسم', value: formatFieldValue(profile?.name) },
    { label: 'البريد الإلكتروني', value: formatFieldValue(profile?.email) },
    { label: 'رقم الهاتف', value: formatFieldValue(profile?.phone) },
    { label: 'الدولة', value: translateCountry(profile?.country) },
    { label: 'دور المستخدم', value: translateRole(profile?.role) },
    { label: 'الحالة', value: translateStatus(profile?.status) },
    { label: 'إجمالي الأرباح', value: `${calculateTotalProfit.toFixed(2)} د.ل` },
    { label: 'طريقة السحب', value: translateWithdrawalMethod(profile?.withdrawalMethod) },
    { label: 'تاريخ الإنشاء', value: formatCreatedAt() }
  ];

  // حالة التحذير: إذا كانت طريقة السحب أو تفاصيلها غير متوفرة
  const showWithdrawalWarning = !profile?.withdrawalMethod || !profile?.withdrawalDetails;

  // دالة تسجيل الخروج مع معالجة أفضل للأخطاء
  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainLanding' }]
              });
            } catch (error) {
              console.error('خطأ في تسجيل الخروج:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
            }
          }
        }
      ]
    );
  };

  // دالة فتح الروابط الاجتماعية
  const openSocialLink = (url, platform) => {
    Linking.openURL(url).catch(error => {
      console.error(`خطأ في فتح ${platform}:`, error);
      Alert.alert('خطأ', `لا يمكن فتح ${platform}. يرجى التأكد من تثبيت التطبيق.`);
    });
  };

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

        {isLoggedIn ? (
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: scale(20) }}
          >
            <View style={styles.profileContainer}>
              <ImageBackground
                source={require('../../assets/images/formBackground.png')}
                style={styles.imgBackground}
                imageStyle={styles.backgroundImage}
              >
                <View style={styles.profileTopSection}>
                  {/* تم إزالة زر تسجيل الخروج من هنا */}
                </View>

                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    {profile?.photoURL ? (
                      <Image 
                        source={{ uri: profile.photoURL }} 
                        style={styles.userPhoto}
                        resizeMode="cover"
                      />
                    ) : (
                      <SimpleLineIcons
                        name="user"
                        size={scale(40)}
                        color={colors.fontBrown}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.nameContainer}>
                  <TextDefault 
                    textColor={colors.fontMainColor}
                    H4
                    numberOfLines={1}
                    style={styles.userName}
                  >
                    {profile?.name || 'المستخدم'}
                  </TextDefault>
                </View>

                <View style={styles.userDataContainer}>
                  {/* عرض رسالة تحذيرية واحدة فقط إذا كانت معلومات السحب ناقصة */}
                  {showWithdrawalWarning && (
                    <View style={styles.warningContainer}>
                      <SimpleLineIcons
                        name="exclamation"
                        size={scale(15)}
                        color={colors.errorColor}
                        style={styles.warningIcon}
                      />
                      <TextDefault 
                        small 
                        textColor={colors.errorColor}
                        style={styles.warningText}
                        numberOfLines={2}
                      >
                        يرجى إضافة معلومات السحب الخاصة بك لتجنب إيقاف الحساب
                      </TextDefault>
                    </View>
                  )}

                  {userFields.map((field, index) => (
                    <View key={`field-${index}`}>
                      <View style={[styles.dataRow, { flexDirection: 'row-reverse' }]}>
                        <View style={[styles.labelContainer, { alignItems: 'flex-end' }]}>
                          <TextDefault style={[styles.dataLabel, { textAlign: 'right' }]} H5>
                            {field.label}:
                          </TextDefault>
                        </View>
                        <View style={[styles.dataValueContainer, { justifyContent: 'flex-end' }]}>
                          {field.label === 'الحالة' ? (
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(profile?.status) + '22', borderColor: getStatusColor(profile?.status) }
                            ]}>
                              <TextDefault
                                style={{ color: getStatusColor(profile?.status), fontWeight: 'bold' }}
                                bold
                              >
                                {field.value}
                              </TextDefault>
                            </View>
                          ) : (
                            <TextDefault 
                              style={[styles.dataValue, { textAlign: 'right' },
                                showWithdrawalWarning && 
                                (field.label === 'طريقة السحب') && 
                                styles.warningValue
                              ]}
                              textColor={
                                showWithdrawalWarning && 
                                (field.label === 'طريقة السحب')
                                  ? colors.errorColor 
                                  : colors.fontSecondColor
                              }
                              numberOfLines={field.label === 'تفاصيل السحب' ? 2 : 1}
                            >
                              {field.value}
                            </TextDefault>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.editButtonContainer}>
                  <MainBtn
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditingProfile')}
                    text="تعديل المعلومات"
                  />
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <TextDefault textColor="white" center bold>
                      تسجيل الخروج
                    </TextDefault>
                  </TouchableOpacity>
                </View>

                {/* أزرار التواصل الاجتماعي */}
                <View style={styles.socialSectionContainer}>
                  <TextDefault 
                    small 
                    textColor={colors.fontMainColor} 
                    style={styles.socialSectionTitle}
                  >
                    تواصل معنا
                  </TextDefault>
                  <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => openSocialLink('https://wa.me/+218910000000', 'واتساب')}
                    >
                      <Feather
                        name="message-circle"
                        size={scale(18)}
                        color="white"
                      />
                      <TextDefault small textColor="white" style={styles.socialButtonText}>
                        واتساب
                      </TextDefault>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.socialButton, styles.instagramButton]}
                      onPress={() => openSocialLink('https://instagram.com/alsolajan', 'إنستقرام')}
                    >
                      <Feather
                        name="instagram"
                        size={scale(18)}
                        color="white"
                      />
                      <TextDefault small textColor="white" style={styles.socialButtonText}>
                        إنستقرام
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.notLoggedInContainer}>
            <TextDefault textColor={colors.fontMainColor} H4>
              يرجى تسجيل الدخول لعرض الملف الشخصي
            </TextDefault>
            <MainBtn
              style={styles.loginButton}
              onPress={() => navigation.navigate('SignIn')}
              text="تسجيل الدخول"
            />
          </View>
        )}
      <BottomTab screen="PROFILE" />
    </SafeAreaView>
  )
}

export default ProfileDashboard