import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Modal, RefreshControl, Platform, StatusBar, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { FlashMessage } from '../../components/FlashMessage/FlashMessage';
import styles from './styles';
import { colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components/Text';
import { fontStyles } from '../../utils/fontStyles';
import { getAllWithdrawals, addWithdrawal } from '../../firebase';
import UserContext from '../../context/User';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const statusMap = {
  PENDING: {
    color: colors.pinkColor,
    bg: '#FFE6F0',
    text: 'قيد المراجعة',
    icon: <MaterialIcons name="hourglass-top" size={18} color={colors.pinkColor} style={{ marginRight: 6 }} />,
  },
  APPROVED: {
    color: colors.greenColor,
    bg: '#E6F9EA',
    text: 'مقبول',
    icon: <MaterialIcons name="check-circle" size={18} color={colors.greenColor} style={{ marginRight: 6 }} />,
  },
  REJECTED: {
    color: colors.errorColor,
    bg: '#FFE6F0',
    text: 'مرفوض',
    icon: <MaterialIcons name="cancel" size={18} color={colors.errorColor} style={{ marginRight: 6 }} />,
  },
};

function WithdrawalRequests() {
  const navigation = useNavigation();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { profile } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      if (profile && (profile.uid || profile.id)) {
        const data = await getAllWithdrawals(profile.uid || profile.id);
        setWithdrawals(data);
      } else {
        setWithdrawals([]);
      }
    } catch (e) {
      setWithdrawals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWithdrawals();
    setRefreshing(false);
  };

  const handleAddWithdrawal = async () => {
    if (!profile) return;
    if ((profile.totalProfit || 0) < 3000) {
      FlashMessage({
        message: 'عذراً، الحد الأدنى للسحب اليومي هو 3000 د.ل.',
        type: 'warning',
        position: 'top',
        titleStyle: { fontFamily: 'DGAgnadeen-Regular', fontSize: 14 },
        textStyle: { textAlign: 'right' },
        duration: 6000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await addWithdrawal({
        amount: profile.totalProfit || 0,
        method: profile.withdrawalMethod || 'غير محددة',
        details: profile.withdrawalDetails || 'لا توجد تفاصيل',
        timestamp: new Date(),
        status: 'PENDING',
        userEmail: profile.email || '',
        userId: profile.uid || profile.id || '',
        userName: profile.name || '',
      });
      await fetchWithdrawals();
    } catch (e) {
      // يمكن عرض رسالة خطأ
    }
    setSubmitting(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      // Firestore Timestamp
      if (typeof timestamp === 'object' && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      }
      // ISO or string
      const d = new Date(timestamp);
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    } catch {
      return 'N/A';
    }
  };

  const renderWithdrawalItem = (item) => {
    const status = statusMap[item.status] || statusMap.PENDING;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.orderItem, { borderLeftColor: status.color }]}
        onPress={() => { setSelected(item); setModalVisible(true); }}
        activeOpacity={0.85}
      >
        <View style={styles.orderHeader}>
          <TextDefault style={styles.orderId}>#{item.id}</TextDefault>
          <TextDefault style={styles.orderDate}>{formatDate(item.timestamp)}</TextDefault>
        </View>
        <View style={styles.orderBody}>
          <View style={styles.orderProfitContainer}>
            <TextDefault style={styles.orderLabel}>المبلغ</TextDefault>
            <View style={styles.profitBadge}>
              <TextDefault style={styles.profitBadgeText}>{item.amount.toFixed(2)} د.ل</TextDefault>
            </View>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: status.bg }]}> 
            {status.icon}
            <TextDefault style={[styles.statusText, { color: status.color }]}>{status.text}</TextDefault>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}> 
      {/* تحذير عدم وجود طريقة سحب */}
      {(!profile?.withdrawalMethod || profile.withdrawalMethod === 'غير محددة') && (
        <View style={{ backgroundColor: '#FFFBE6', borderColor: '#FFD600', borderWidth: 1, borderRadius: 10, padding: 12, marginHorizontal: '2%', marginTop: 12, marginBottom: 12, flexDirection: 'column', alignItems: 'flex-start', width: '96%', maxWidth: '100%' }}>
          <View style={{ width: '100%', maxWidth: '100%' }}>
            <TextDefault style={{ color: '#B88600', fontSize: 15, fontFamily: fontStyles.DGAgnadeenRegular, textAlign: 'right', flexShrink: 1, flexWrap: 'wrap', maxWidth: '100%' }}>
              لم تقم بتحديد طريقة السحب بعد. يرجى إضافة طريقة دفع لسحب الأرباح.
            </TextDefault>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditingProfile')} style={{ backgroundColor: '#FFD600', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 28, marginTop: 10, alignSelf: 'center' }}>
            <TextDefault style={{ color: '#333', fontSize: 14 }}>إضافة</TextDefault>
          </TouchableOpacity>
        </View>
      )}
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
      {/* قائمة الطلبات */}
      <ScrollView
        contentContainerStyle={[styles.listContentContainer, { paddingBottom: 56 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : withdrawals.length > 0 ? (
          <View style={styles.ordersContainer}>
            {withdrawals.map(renderWithdrawalItem)}
          </View>
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <Feather name="dollar-sign" size={80} color={colors.primary} />
              <TextDefault textColor={colors.primary} center H4>
                لا توجد طلبات سحب
              </TextDefault>
              <TouchableOpacity style={styles.refreshEmptyButton} onPress={onRefresh}>
                <TextDefault style={styles.refreshEmptyButtonText}>تحديث</TextDefault>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
      {/* نافذة التفاصيل */}
      {selected && (
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
                <TextDefault style={styles.modalTitle}>تفاصيل السحب</TextDefault>
                <View style={{ width: 24 }} />
              </View>
              <View style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="confirmation-number" size={20} color={colors.primary} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>رقم الطلب:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>#{selected.id}</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="date-range" size={20} color={colors.blueColor} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>تاريخ الطلب:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{formatDate(selected.timestamp)}</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <Feather name="dollar-sign" size={20} color={colors.greenColor} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>المبلغ:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selected.amount.toFixed(2)} د.ل</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="info" size={20} color={statusMap[selected.status].color} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>الحالة:</TextDefault>
                  </View>
                  <View style={[styles.statusContainer, { backgroundColor: statusMap[selected.status].bg }]}> 
                    {statusMap[selected.status].icon}
                    <TextDefault style={[styles.statusText, { color: statusMap[selected.status].color }]}>{statusMap[selected.status].text}</TextDefault>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="person" size={20} color={colors.primary} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>المستخدم:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selected.userName || ''}</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="email" size={20} color={colors.blueColor} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>البريد الإلكتروني:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selected.userEmail || ''}</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="description" size={20} color={colors.primary} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>التفاصيل:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selected.details || 'لا توجد تفاصيل'}</TextDefault>
                </View>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <MaterialIcons name="account-balance-wallet" size={20} color={colors.primary} style={styles.detailIcon} />
                    <TextDefault style={styles.detailLabel}>طريقة السحب:</TextDefault>
                  </View>
                  <TextDefault style={styles.detailValue}>{selected.method || 'غير محددة'}</TextDefault>
                </View>
                {selected.status === 'REJECTED' && selected.rejectionReason && (
                  <View style={styles.cancellationSection}>
                    <MaterialIcons name="error-outline" size={22} color={colors.errorColor} style={styles.cancellationIcon} />
                    <View>
                      <TextDefault style={styles.cancellationTitle}>سبب الرفض:</TextDefault>
                      <TextDefault style={styles.cancellationReason}>{selected.rejectionReason}</TextDefault>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* زر تقديم طلب سحب دائري عائم أيقونة فقط */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 24,
          bottom: Platform.OS === 'ios' ? 32 : 40,
          backgroundColor: colors.greenColor,
          borderRadius: 32,
          width: 56,
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.13,
          shadowRadius: 6,
        }}
        onPress={handleAddWithdrawal}
        activeOpacity={0.85}
        disabled={submitting}
        accessibilityLabel="تقديم طلب سحب"
      >
        <Feather name="dollar-sign" size={30} color={colors.whiteColor} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default WithdrawalRequests; 