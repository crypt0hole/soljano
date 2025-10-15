import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import styles from './styles'; // Your styles file
import UserContext from '../../context/User';
import { colors } from '../../utils'; // Assuming colors are defined here
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components/Text';
import { fontStyles } from '../../utils/fontStyles';
import { AntDesign } from '@expo/vector-icons';

function Orders() {
  const navigation = useNavigation();
  const { orders, fetchOrders, loading, error } = useContext(UserContext); // Assuming error state from context
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    try {
      let date;
      
      // Handle Firestore timestamp
      if (typeof dateValue === 'object' && dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      } else {
        // Handle regular Date
        date = new Date(dateValue);
      }
      
      // Manually format date to ensure it displays correctly with 4-digit year
      const day = date.getDate();
      const monthNames = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear(); // Full 4-digit year
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.log('Date formatting error:', error);
      return 'N/A';
    }
  };

  // Helper: delivered/completed vs pending for any other status
  const getStatusDisplay = (status) => {
    const key = status ? status.toString().toUpperCase() : '';
    if (key === 'DELIVERED' || key === 'COMPLETED') {
      return {
        borderColor: colors.greenColor,
        backgroundColor: '#E6F4EA',
        textColor: colors.greenColor,
        text: 'مكتمل'
      };
    }
    if (key === 'REJECTED' || key === 'CANCELLED') {
      return {
        borderColor: colors.errorColor,
        backgroundColor: '#FDECEA', // Light red for rejected
        textColor: colors.errorColor,
        text: 'مرفوض'
      };
    }
    // All other statuses are pending
    return {
      borderColor: colors.pinkColor,
      backgroundColor: colors.lightBrown,
      textColor: colors.pinkColor,
      text: 'معلق'
    };
  };

  // ربط لون الدائرة بالأيقونة حسب نوع البطاقة
  const getCardIconBg = (iconName) => {
    switch (iconName) {
      case 'hourglass-top': return { backgroundColor: '#FFE6F0' };
      case 'check-circle': return { backgroundColor: '#E6F9EA' };
      case 'cancel': return { backgroundColor: '#FFE6F0' };
      default: return { backgroundColor: '#E3F0FF' };
    }
  };

  // ربط أيقونة الحالة
  const getStatusIcon = (status) => {
    const key = status ? status.toString().toUpperCase() : '';
    if (key === 'DELIVERED' || key === 'COMPLETED') {
      return <AntDesign name="checkcircle" size={18} color={colors.greenColor} style={styles.statusIcon} />;
    }
    if (key === 'REJECTED' || key === 'CANCELLED') {
      return <MaterialIcons name="cancel" size={18} color={colors.errorColor} style={styles.statusIcon} />;
    }
    return <MaterialIcons name="hourglass-top" size={18} color={colors.pinkColor} style={styles.statusIcon} />;
  };

  // ربط أيقونة التفاصيل
  const getDetailIcon = (label) => {
    switch (label) {
      case 'رقم الطلب:': return <MaterialIcons name="confirmation-number" size={20} color={colors.primary} style={styles.detailIcon} />;
      case 'تاريخ الطلب:': return <MaterialIcons name="date-range" size={20} color={colors.blueColor} style={styles.detailIcon} />;
      case 'حالة الطلب:': return <MaterialIcons name="info" size={20} color={colors.greenColor} style={styles.detailIcon} />;
      case 'المنتج:': return <MaterialIcons name="shopping-bag" size={20} color={colors.pinkColor} style={styles.detailIcon} />;
      case 'العميل:': return <MaterialIcons name="person" size={20} color={colors.primary} style={styles.detailIcon} />;
      case 'المبلغ الإجمالي:': return <Feather name="dollar-sign" size={20} color={colors.blueColor} style={styles.detailIcon} />;
      case 'الربح:': return <MaterialIcons name="trending-up" size={20} color={colors.greenColor} style={styles.detailIcon} />;
      default: return null;
    }
  };

  // ربط أيقونة سبب الرفض
  const getCancelIcon = () => (
    <MaterialIcons name="error-outline" size={22} color={colors.errorColor} style={styles.cancellationIcon} />
  );

  // ربط لون شريط الحالة
  const getStatusBarColor = (status) => {
    const key = status ? status.toString().toUpperCase() : '';
    if (key === 'DELIVERED' || key === 'COMPLETED') return colors.greenColor;
    if (key === 'REJECTED' || key === 'CANCELLED') return colors.errorColor;
    return colors.pinkColor;
  };

  // ربط لون دائرة الأيقونة في ملخص الطلبات
  const getSummaryIconCircle = (iconName) => {
    switch (iconName) {
      case 'hourglass-top': return [styles.iconCircle, { backgroundColor: '#FFE6F0' }];
      case 'check-circle': return [styles.iconCircle, { backgroundColor: '#E6F9EA' }];
      case 'cancel': return [styles.iconCircle, { backgroundColor: '#FFE6F0' }];
      default: return styles.iconCircle;
    }
  };

  // Renders each individual order item in the list
  const renderOrderItem = ({ item }) => {
    if (!item) return null;
    const statusDisplay = getStatusDisplay(item.status);
    
    const handleOrderPress = () => {
      setSelectedOrder(item);
      setModalVisible(true);
    };
    
    return (
      <TouchableOpacity
        style={[styles.orderItem, { borderLeftColor: getStatusBarColor(item.status) }]}
        activeOpacity={0.85}
        onPress={handleOrderPress}
      >
        <View style={styles.orderHeader}>
          <TextDefault style={styles.orderId}>
            الطلب #{item._id ? item._id.substring(0, 8) : 'N/A'}
          </TextDefault>
          <TextDefault style={styles.orderDate}>
            {formatDate(item.createdAt)}
          </TextDefault>
        </View>
        <View style={styles.orderBody}>
          {!(item.status && (item.status.toString().toUpperCase() === 'REJECTED' || item.status.toString().toUpperCase() === 'CANCELLED')) ? (
            <View style={styles.orderProfitContainer}>
              <TextDefault style={styles.orderLabel}>الربح:</TextDefault>
              <View style={styles.profitBadge}>
                <TextDefault style={styles.profitBadgeText}>
                  {item.totalProfit ? item.totalProfit.toFixed(2) : '0'} د.ل
                </TextDefault>
              </View>
            </View>
          ) : (
            <View style={styles.orderProfitContainer}>
              <TouchableOpacity onPress={handleOrderPress} style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <TextDefault style={{ color: colors.fontBlue, fontSize: 13, textDecorationLine: 'underline' }}>عرض التفاصيل</TextDefault>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.statusContainer, { backgroundColor: statusDisplay.backgroundColor, flexDirection: 'row', alignItems: 'center' }]}> 
              {getStatusIcon(item.status)}
              <TextDefault style={[styles.statusText, { color: statusDisplay.textColor }]}> 
                {statusDisplay.text}
              </TextDefault>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Renders a single summary card (e.g., Pending Orders, Completed Orders)
  const renderSummaryCard = (title, value, color, iconName, style) => (
    <View style={[styles.card, style, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: color.bg, borderColor: color.border, borderWidth: 1 }]}> 
      {/* الرقم في أقصى اليسار */}
      <TextDefault style={[styles.cardValue, { color: color.text, marginLeft: 8, marginRight: 0 }]}>{value}</TextDefault>
      {/* خط فاصل */}
      <View style={styles.cardDivider} />
      {/* الأيقونة والعنوان في أقصى اليمين */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <TextDefault style={[styles.cardTitle, { color: color.text, marginRight: 8 }]}>{title}</TextDefault>
        <MaterialIcons name={iconName} size={26} color={color.icon} />
      </View>
    </View>
  );

  // تحديث renderSummarySection ليضع زر السحب تحت إجمالي الربح ويضيف أيقونة دائرية
  const renderSummarySection = () => {
    const totalOrders = orders.length;
    
    // Calculate completed orders, rejected orders, and pending orders
    const completedOrders = orders.filter(o => {
      const s = o.status ? o.status.toString().toUpperCase() : '';
      return s === 'DELIVERED' || s === 'COMPLETED';
    });
    
    const rejectedOrders = orders.filter(o => {
      const s = o.status ? o.status.toString().toUpperCase() : '';
      return s === 'REJECTED' || s === 'CANCELLED';
    });
    
    const completedOrdersCount = completedOrders.length;
    const rejectedOrdersCount = rejectedOrders.length;
    
    // True pending orders (not including rejected)
    const pendingOrdersCount = totalOrders - completedOrdersCount - rejectedOrdersCount;
    
    // Only calculate profit from completed orders
    const totalProfitAmount = completedOrders.reduce((sum, o) => sum + (o.totalProfit || 0), 0);
    
    // Percentage of completed orders
    const completedPercentage = totalOrders > 0 ? `${((completedOrdersCount / totalOrders) * 100).toFixed(1)}%` : '0%';

    return (
      <View style={styles.summarySection}>
        <View style={styles.summaryCardsContainer}>
          {renderSummaryCard('طلبات معلقة', pendingOrdersCount, {
            bg: '#FFF9F9', border: '#F48B98', iconBg: '#F48B9822', icon: '#F48B98', text: '#F48B98'
          }, 'hourglass-top')}
          {renderSummaryCard('طلبات مكتملة', completedOrdersCount, {
            bg: '#F7FFF9', border: '#8CB65E', iconBg: '#8CB65E22', icon: '#8CB65E', text: '#8CB65E'
          }, 'check-circle')}
          {renderSummaryCard('طلبات مرفوضة', rejectedOrdersCount, {
            bg: '#FFF7F7', border: '#FA7751', iconBg: '#FA775122', icon: '#FA7751', text: '#FA7751'
          }, 'cancel')}
        </View>
        {/* صندوق إجمالي الربح العصري */}
        <View style={styles.totalProfitContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="trending-up" size={32} color={colors.greenColor} style={{ marginRight: 4, alignSelf: 'center' }} />
              <TextDefault style={[styles.totalProfitText, { marginRight: 6 }]}>{totalProfitAmount.toFixed(2)} د.ل</TextDefault>
            </View>
            <TextDefault style={{ color: colors.fontSecondColor, fontSize: 14, fontFamily: fontStyles.DGAgnadeenRegular, textAlign: 'left' }}>إجمالي الربح</TextDefault>
          </View>
        </View>
        {/* زر السحب أسفل الصندوق مباشرة */}
        <TouchableOpacity
          style={styles.withdrawalButton}
          onPress={() => navigation.navigate('WithdrawalRequests')}
        >
          <View style={styles.withdrawalIconCircle}>
            <Feather name="dollar-sign" size={20} color={colors.whiteColor} />
          </View>
          <TextDefault style={styles.withdrawalButtonText}>طلبات السحب</TextDefault>
        </TouchableOpacity>
      </View>
    );
  };

  // Display loading indicator
  if (loading && orders.length === 0) { // Only show full screen spinner on initial load
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Display error message (if any)
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <TextDefault style={styles.errorText}>حدث خطأ: {error.message}</TextDefault>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <TextDefault style={styles.retryButtonText}>إعادة المحاولة</TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back Button Only */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end', // اجعل الزر في اليسار (في RTL)
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

      {/* Orders List with ScrollView */}
      <ScrollView
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Section */}
        {renderSummarySection()}

        {/* Orders List */}
        <TextDefault style={styles.sectionTitle}>جميع الطلبات</TextDefault>
        {orders && orders.length > 0 ? (
          <View style={styles.ordersContainer}>
            {orders.map((item) => (
              <View key={item._id?.toString() || Math.random().toString()}>
                {renderOrderItem({ item })}
              </View>
            ))}
          </View>
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt" size={80} color={colors.primary} />
              <TextDefault textColor={colors.primary} center H4>
                لا توجد طلبات لعرضها
              </TextDefault>
              <TouchableOpacity style={styles.refreshEmptyButton} onPress={onRefresh}>
                <TextDefault style={styles.refreshEmptyButtonText}>تحديث</TextDefault>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color={colors.blackText} />
                </TouchableOpacity>
                <TextDefault style={styles.modalTitle}>تفاصيل الطلب</TextDefault>
                <View style={{ width: 24 }} />
              </View>
              
              <ScrollView style={styles.modalBody}>
                {/* Order ID and Date */}
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('رقم الطلب:')}
                    <TextDefault style={styles.detailLabel}>رقم الطلب:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>#{selectedOrder._id ? selectedOrder._id.substring(0, 8) : 'N/A'}</TextDefault>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('تاريخ الطلب:')}
                    <TextDefault style={styles.detailLabel}>تاريخ الطلب:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>
                    {formatDate(selectedOrder.createdAt)}
                  </TextDefault>
                </View>
                
                {/* Status */}
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('حالة الطلب:')}
                    <TextDefault style={styles.detailLabel}>حالة الطلب:</TextDefault>
                  </View>
                  <View style={[styles.statusContainer, { backgroundColor: getStatusDisplay(selectedOrder.status).backgroundColor }]}> 
                    {getStatusIcon(selectedOrder.status)}
                    <TextDefault style={[styles.statusText, { color: getStatusDisplay(selectedOrder.status).textColor }]}> 
                      {getStatusDisplay(selectedOrder.status).text}
                    </TextDefault>
                  </View>
                </View>
                
                {/* Product Details */}
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('المنتج:')}
                    <TextDefault style={styles.detailLabel}>المنتج:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selectedOrder.productName || 'N/A'}</TextDefault>
                </View>
                
                {/* Customer Details */}
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('العميل:')}
                    <TextDefault style={styles.detailLabel}>العميل:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selectedOrder.customerName || 'N/A'}</TextDefault>
                </View>
                
                {/* Financial Details */}
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('المبلغ الإجمالي:')}
                    <TextDefault style={styles.detailLabel}>المبلغ الإجمالي:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selectedOrder.totalAmount ? `${selectedOrder.totalAmount.toFixed(2)} د.ل` : 'N/A'}</TextDefault>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {getDetailIcon('الربح:')}
                    <TextDefault style={styles.detailLabel}>الربح:</TextDefault>
                  </View>
                  <TextDefault style={[styles.detailValue, { color: colors.greenColor }]}> 
                    {selectedOrder.totalProfit ? `${selectedOrder.totalProfit.toFixed(2)} د.ل` : '0 د.ل'}
                  </TextDefault>
                </View>
                
                {/* Cancellation Reason */}
                {(selectedOrder.status && 
                  (selectedOrder.status.toString().toUpperCase() === 'REJECTED' || 
                   selectedOrder.status.toString().toUpperCase() === 'CANCELLED') && 
                  selectedOrder.rejectionReason) && (
                  <View style={styles.cancellationSection}>
                    {getCancelIcon()}
                    <View>
                      <TextDefault style={styles.cancellationTitle}>سبب الرفض:</TextDefault>
                      <TextDefault style={[styles.cancellationReason, {textAlign: 'left'}]}>{selectedOrder.rejectionReason}</TextDefault>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

export default Orders;