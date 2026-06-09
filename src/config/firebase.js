// Konfigurasi Firebase menggunakan Environment Variables
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Konfigurasi Firebase dari Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Fungsi untuk mendapatkan konfigurasi spreadsheet dari Realtime Database
export const getSpreadsheetConfig = async () => {
  return new Promise((resolve, reject) => {
    // Path: app_improvement_suggestion_system / spreadsheet_url
    const configRef = ref(database, 'app_improvement_suggestion_system');
    onValue(configRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.spreadsheet_url) {
        resolve({ spreadsheet_url: data.spreadsheet_url });
      } else {
        console.warn('Konfigurasi spreadsheet tidak ditemukan di Firebase');
        reject(new Error('Konfigurasi spreadsheet tidak ditemukan'));
      }
    }, { onlyOnce: true });
  });
};

// Fungsi untuk menyimpan konfigurasi spreadsheet (admin use)
export const setSpreadsheetConfig = async (spreadsheet_url) => {
  if (!database) {
    throw new Error('Firebase database not initialized');
  }
  const configRef = ref(database, 'app_improvement_suggestion_system');
  await set(configRef, { spreadsheet_url });
};

export { database };