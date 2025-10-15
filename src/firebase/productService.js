import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Products Collection Reference
const productsCollection = collection(db, 'products');

// Get all products
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const q = query(productsCollection, where('category', '==', categoryId));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const q = query(productsCollection, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date(),
      status: productData.status || 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, updateData) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Listen to products changes in real-time
export const listenToProducts = (callback) => {
  const q = query(productsCollection, where('status', '==', 'active'));
  return onSnapshot(q, (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(products);
  });
};
