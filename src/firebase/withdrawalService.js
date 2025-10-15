import { collection, getDocs, orderBy, query, where, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const withdrawalsCollection = collection(db, 'transactions');

export const getAllWithdrawals = async (userId) => {
  try {
    const q = query(
      withdrawalsCollection,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const withdrawals = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      withdrawals.push({
        id: doc.id,
        ...data
      });
    });
    return withdrawals;
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    throw error;
  }
};

export const addWithdrawal = async (withdrawalData) => {
  try {
    const docRef = await addDoc(withdrawalsCollection, withdrawalData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding withdrawal:', error);
    throw error;
  }
}; 