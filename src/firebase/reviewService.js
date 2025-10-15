import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const reviewsCollection = collection(db, 'reviews');

export const getReviewsByProduct = async (productId) => {
  try {
    const q = query(reviewsCollection, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews by product:', error);
    throw error;
  }
};
