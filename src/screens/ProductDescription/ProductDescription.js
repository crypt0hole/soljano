import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import UserContext from '../../context/User';
// Helper to format Firestore timestamp or JS Date
const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'object' && date.seconds) {
    return new Date(date.seconds * 1000).toLocaleString('ar-EG');
  }
  return new Date(date).toLocaleString('ar-EG');
};

const COUNTRIES = ['ليبيا', 'مصر', 'تونس', 'الجزائر'];

export default function ProductDescription({ route, navigation }) {
  const product = route?.params?.product ?? {};
  const { user, profile } = useContext(UserContext);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const images = [product.mainImage, ...(product.additionalImages || [])].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerCity, setBuyerCity] = useState('');
  const [buyerCountry, setBuyerCountry] = useState(COUNTRIES[0]);
  const [sellingPrice, setSellingPrice] = useState('');
  const [sending, setSending] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const wholesalePrice = product.price || 0;
  const profit = sellingPrice && !isNaN(Number(sellingPrice)) ? Number(sellingPrice) - wholesalePrice : 0;

  const handleBuy = () => {
    Alert.alert('نجاح', 'تم تنفيذ عملية الشراء!');
  };

  const validateForm = () => {
    if (!buyerName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المشتري');
      return false;
    }
    if (!buyerPhone.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return false;
    }
    if (!buyerAddress.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال العنوان');
      return false;
    }
    if (!buyerCity.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال المدينة');
      return false;
    }
    if (!sellingPrice || isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال سعر بيع صحيح');
      return false;
    }
    return true;
  };

  const handleSendSellRequest = () => {
    if (!validateForm()) return;
    
    setSending(true);
    
    const order = {
      cancelDeliveryAt: null,
      cancelDeliveryReason: '',
      createdAt: new Date().toISOString(),
      customerAddress: buyerAddress,
      customerCity: buyerCity,
      customerCountry: buyerCountry,
      customerId: user?.uid || '',
      customerName: buyerName,
      customerPhone: buyerPhone,
      deliveredAt: null,
      notes: '',
      productId: product.id || product.productId || '',
      productImage: product.mainImage,
      productName: product.name,
      productPrice: wholesalePrice,
      profitDistributed: false,
      profitDistributedAt: null,
      profitPerItem: profit,
      quantity: 1,
      sellerEmail: user?.email || '',
      sellerId: user?.uid || '',
      sellingPrice: Number(sellingPrice),
      size: selectedSize || 'standard',
      status: 'pending',
      totalAmount: Number(sellingPrice),
      totalProfit: profit,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.uid || '',
    };

    // Here you would typically send the order to your backend
    console.log('Order data:', order);
    
    setTimeout(() => {
      setSending(false);
      setShowSellModal(false);
      Alert.alert('نجاح', 'تم إرسال طلب البيع بنجاح!');
      // Reset form
      setBuyerName('');
      setBuyerPhone('');
      setBuyerAddress('');
      setBuyerCity('');
      setSellingPrice('');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* زر رجوع عائم أعلى يمين الصفحة */}
      <View style={{
        position: 'absolute',
        top: 48,
        right: 16,
        zIndex: 100,
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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Main Product Image */}
        {selectedImage && (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setShowImageModal(true)}>
            <Image source={{ uri: selectedImage }} style={styles.mainImage} resizeMode="cover" />
          </TouchableOpacity>
        )}

        {/* Modal لتكبير الصورة */}
        <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.85)',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity style={{position:'absolute',top:40,right:20,zIndex:2}} onPress={()=>setShowImageModal(false)}>
              <MaterialIcons name="close" size={36} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={{width:'90%',height:'60%',borderRadius:18}} resizeMode="contain" />
          </View>
        </Modal>

        {/* Thumbnails */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.thumbnailList, styles.thumbnailListContainer]}> 
            {images.map((item, idx) => (
              <TouchableOpacity key={idx} onPress={() => setSelectedImage(item)} activeOpacity={0.8}>
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.thumbnail,
                    selectedImage === item && styles.selectedThumbnail,
                    selectedImage === item && {transform:[{scale:1.12}],shadowColor:'#8B7355',shadowOpacity:0.25,shadowRadius:8,elevation:4} 
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{String(product.name ?? '')}</Text>

          {/* السعر tape والفئة تحته من اليسار */}
          <View style={{position:'relative', minHeight:44, marginBottom:0}}>
            {product.price ? (
              <View style={styles.priceBookmark}>
                <Text style={styles.priceBookmarkText}>{String(product.price) + ' د.ل'}</Text>
              </View>
            ) : null}
            {product.category && (
              <View style={{alignItems:'flex-start',marginTop:8,marginLeft:0}}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{String(product.category ?? '')}</Text>
                </View>
              </View>
            )}
          </View>

          {product.description && (
            <Text style={styles.description}>{String(product.description ?? '')}</Text>
          )}

          {product.sizes?.length > 0 && (
            <View style={styles.sizesContainer}>
              <Text style={styles.sizesLabel}>الأحجام:</Text>
              <View style={styles.sizesRow}>
                {product.sizes.map((size, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnSelected]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
                      {String(size ?? '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {profile ? (
          profile.role && profile.role.toLowerCase() === 'customer' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                <Text style={styles.buttonText}>{'شراء'}</Text>
              </TouchableOpacity>
            </View>
          ) : profile.role && profile.role.toLowerCase() === 'seller' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.sellButton} 
                onPress={() => setShowSellModal(true)}
              >
                <Text style={styles.buttonText}>{'تقديم طلب بيع'}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        ) : (
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>{'يرجى تسجيل الدخول'}</Text>
          </TouchableOpacity>
        )}

        {/* Sell Modal */}
        <Modal 
          visible={showSellModal} 
          animationType="slide" 
          transparent
          onRequestClose={() => setShowSellModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{'تقديم طلب بيع'}</Text>
              
              <View style={styles.countryList}>
                {COUNTRIES.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={[
                      styles.countryButton,
                      buyerCountry === country && styles.selectedCountryButton
                    ]}
                    onPress={() => setBuyerCountry(country)}
                  >
                    <Text style={[
                      styles.countryButtonText,
                      buyerCountry === country && styles.selectedCountryButtonText
                    ]}>
                      {String(country ?? '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
                <TextInput 
                  style={styles.input} 
                  placeholder="المدينة" 
                  value={String(buyerCity ?? '')} 
                  onChangeText={setBuyerCity} 
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="عنوان المشتري الدقيق" 
                  value={String(buyerAddress ?? '')} 
                  onChangeText={setBuyerAddress} 
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="اسم المشتري" 
                  value={String(buyerName ?? '')} 
                  onChangeText={setBuyerName} 
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="رقم هاتف المشتري" 
                  value={String(buyerPhone ?? '')} 
                  onChangeText={setBuyerPhone} 
                  keyboardType="phone-pad" 
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="سعر البيع" 
                  value={String(sellingPrice ?? '')} 
                  onChangeText={setSellingPrice} 
                  keyboardType="numeric" 
                />
              
              {sellingPrice ? (
                <Text style={styles.profitText}>
                  {'الربح المتوقع: ' + String(profit ?? '') + ' د.ل'}
                </Text>
              ) : null}
              
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.modalButton, 
                    styles.sendButton,
                    sending && styles.disabledButton
                  ]} 
                  onPress={handleSendSellRequest} 
                  disabled={sending}
                >
                  <Text style={styles.buttonText}>
                    {sending ? '...جاري الإرسال' : 'إرسال الطلب'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setShowSellModal(false)}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>{'إغلاق'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};