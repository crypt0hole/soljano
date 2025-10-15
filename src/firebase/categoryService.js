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
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Categories Collection Reference
const categoriesCollection = collection(db, 'categories');

// Get all categories
export const getAllCategories = async () => {
  try {
    const q = query(categoriesCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        _id: doc.id, // For compatibility with existing code
        ...doc.data()
      });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        _id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Add new category
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, updateData) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Listen to categories changes in real-time
export const listenToCategories = (callback) => {
  const q = query(categoriesCollection, orderBy('name', 'asc'));
  return onSnapshot(q, (querySnapshot) => {
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        _id: doc.id,
        ...doc.data()
      });
    });
    callback(categories);
  });
};
