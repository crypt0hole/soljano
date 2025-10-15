import { 
  addDoc, 
  collection, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Sample categories data
const sampleCategories = [
  {
    name: 'الإلكترونيات',
    title: 'الإلكترونيات',
    description: 'أجهزة إلكترونية متنوعة',
    image: 'https://example.com/electronics.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'الملابس',
    title: 'الملابس',
    description: 'ملابس رجالية ونسائية',
    image: 'https://example.com/clothes.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'المنزل والمطبخ',
    title: 'المنزل والمطبخ',
    description: 'أدوات منزلية ومطبخية',
    image: 'https://example.com/home.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'هاتف ذكي',
    description: 'هاتف ذكي بمواصفات عالية وأداء ممتاز',
    price: 299.99,
    mainImage: 'https://example.com/phone.jpg',
    additionalImages: [
      'https://example.com/phone2.jpg',
      'https://example.com/phone3.jpg'
    ],
    category: 'electronics', // This should match category ID
    sizes: ['S', 'M', 'L'],
    stock: 50,
    status: 'active',
    instagramUrl: 'https://instagram.com/product1',
    createdAt: new Date(),
    createdBy: 'admin'
  },
  {
    name: 'قميص قطني',
    description: 'قميص قطني عالي الجودة ومريح للارتداء',
    price: 45.50,
    mainImage: 'https://example.com/shirt.jpg',
    additionalImages: [
      'https://example.com/shirt2.jpg'
    ],
    category: 'clothes',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    status: 'active',
    instagramUrl: 'https://instagram.com/product2',
    createdAt: new Date(),
    createdBy: 'admin'
  }
];

// Configuration data
const sampleConfiguration = {
  currency: 'USD',
  currencySymbol: '$',
  deliveryCharges: 5.00,
  taxRate: 0.1,
  storeName: 'Al Solajan Store',
  storeDescription: 'متجر السولجان للتجارة الإلكترونية',
  contactEmail: 'info@alsolajan.com',
  contactPhone: '+218-xxx-xxxx',
  supportWhatsapp: '+218-xxx-xxxx'
};

// Function to initialize sample data
export const initializeSampleData = async () => {
  try {
    console.log('Adding sample categories...');
    
    // Add categories
    for (const category of sampleCategories) {
      await addDoc(collection(db, 'categories'), category);
    }
    
    console.log('Adding sample products...');
    
    // Add products
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
    
    console.log('Adding configuration...');
    
    // Add configuration
    await setDoc(doc(db, 'configuration', 'app'), sampleConfiguration);
    
    console.log('Sample data added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding sample data:', error);
    throw error;
  }
};

// Function to add individual category
export const addSampleCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Category added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Function to add individual product
export const addSampleProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      createdBy: 'admin',
      status: 'active'
    });
    console.log('Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Usage example:
// Import this file and call initializeSampleData() to add sample data
// or use addSampleCategory() and addSampleProduct() to add individual items
