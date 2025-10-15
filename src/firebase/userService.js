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
  onSnapshot,
  setDoc 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';

// Users Collection Reference
const usersCollection = collection(db, 'users');

// Authentication Functions

// Sign up new user
export const signUpUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: userData.name,
      photoURL: userData.photoURL || null
    });
    
    // Add user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: userData.name,
      phone: userData.phone || '',
      country: userData.country || '',
      photoURL: userData.photoURL || '',
      role: 'customer',
      status: userData.userType === 'seller' ? 'pending' : 'active',
      totalProfit: 0,
      lastProfitUpdate: new Date(),
      paypalEmail: '',
      withdrawalMethod: '',
      withdrawalDetails: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send Password Reset Email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Get current auth state
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore User Functions

// Get user profile by UID
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid, updateData) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get all users (admin function)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const q = query(usersCollection, where('role', '==', role));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

// Listen to user profile changes
export const listenToUserProfile = (uid, callback) => {
  const docRef = doc(db, 'users', uid);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  });
};

// Update user profit
export const updateUserProfit = async (uid, profit) => {
  try {
    const docRef = doc(db, 'users', uid);
    const userDoc = await getDoc(docRef);
    
    if (userDoc.exists()) {
      const currentProfit = userDoc.data().totalProfit || 0;
      await updateDoc(docRef, {
        totalProfit: currentProfit + profit,
        lastProfitUpdate: new Date(),
        updatedAt: new Date()
      });
      return true;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error updating user profit:', error);
    throw error;
  }
};

// Wishlist functions
export const addToWishlist = async (uid, productId) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const wishlist = userData.wishlist || [];
      if (!wishlist.includes(productId)) {
        await updateDoc(userRef, {
          wishlist: [...wishlist, productId]
        });
      }
    }
  } catch (error) {
    console.error("Error adding to wishlist: ", error);
    throw error;
  }
};

export const removeFromWishlist = async (uid, productId) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const wishlist = userData.wishlist || [];
      if (wishlist.includes(productId)) {
        await updateDoc(userRef, {
          wishlist: wishlist.filter(id => id !== productId)
        });
      }
    }
  } catch (error) {
    console.error("Error removing from wishlist: ", error);
    throw error;
  }
};

export const getWishlist = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.wishlist || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting wishlist: ", error);
    throw error;
  }
};

export const updateUserStatusIfEmailVerified = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;
  if (user.emailVerified) {
    // جلب بيانات المستخدم من Firestore
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().status === 'pending') {
      await updateDoc(docRef, { status: 'active', updatedAt: new Date() });
    }
  }
};
