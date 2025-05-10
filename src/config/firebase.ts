import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase configuration
// Replace with your own Firebase config when deploying
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "YOUR_API_KEY",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "YOUR_AUTH_DOMAIN",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "YOUR_PROJECT_ID",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "YOUR_STORAGE_BUCKET",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "YOUR_APP_ID",
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };