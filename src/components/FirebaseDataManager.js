import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { initializeSampleData, addSampleCategory, addSampleProduct } from '../firebase/sampleData';

const FirebaseDataManager = () => {
  const [loading, setLoading] = useState(false);

  const handleInitializeSampleData = async () => {
    Alert.alert(
      'تأكيد',
      'هل تريد إضافة البيانات التجريبية؟ سيتم إضافة فئات ومنتجات وإعدادات عامة.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'موافق',
          onPress: async () => {
            try {
              setLoading(true);
              await initializeSampleData();
              Alert.alert('نجح', 'تم إضافة البيانات التجريبية بنجاح!');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء إضافة البيانات: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const categoryData = {
        name: 'فئة جديدة',
        title: 'فئة جديدة',
        description: 'وصف الفئة الجديدة',
        image: 'https://example.com/category.jpg'
      };
      
      await addSampleCategory(categoryData);
      Alert.alert('نجح', 'تم إضافة الفئة بنجاح!');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة الفئة: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const productData = {
        name: 'منتج تجريبي',
        description: 'وصف المنتج التجريبي',
        price: 99.99,
        mainImage: 'https://example.com/product.jpg',
        additionalImages: [],
        category: 'electronics',
        sizes: ['S', 'M', 'L'],
        stock: 10,
        instagramUrl: 'https://instagram.com/product'
      };
      
      await addSampleProduct(productData);
      Alert.alert('نجح', 'تم إضافة المنتج بنجاح!');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة المنتج: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إدارة بيانات Firebase</Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleInitializeSampleData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'جاري الإضافة...' : 'إضافة البيانات التجريبية'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAddCategory}
        disabled={loading}
      >
        <Text style={styles.buttonText}>إضافة فئة جديدة</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAddProduct}
        disabled={loading}
      >
        <Text style={styles.buttonText}>إضافة منتج جديد</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default FirebaseDataManager;
