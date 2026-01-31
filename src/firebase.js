import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "realtimeDatabaseInstanceUri": "",
  "realtimeDatabaseUrl": "",
  "storageBucket": "studio-2671301810-e0a76.firebasestorage.app",
  "locationId": "",
  "apiKey": "AIzaSyDC886khiOxX49cam0F9QfIUJzzmsvBSgU",
  "authDomain": "studio-2671301810-e0a76.firebaseapp.com",
  "messagingSenderId": "381571846140",
  "measurementId": "",
  "projectId": "studio-2671301810-e0a76"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);