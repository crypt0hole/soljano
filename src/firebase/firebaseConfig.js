import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1mYA366SOqyQkKNTk8pOv8QGH17z_g6E",
  authDomain: "bubbles-7ca67.firebaseapp.com",
  projectId: "bubbles-7ca67",
  storageBucket: "bubbles-7ca67.firebasestorage.app",
  messagingSenderId: "768478599304",
  appId: "1:768478599304:web:1083d4f5c03593e566e73d",
  measurementId: "G-XJYKKFRQJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
