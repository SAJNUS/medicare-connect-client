import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { fileURLToPath } from 'url';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testLogin() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, 'irfankhan@gmail.com', 'Irfankhan@gmail.com');
    console.log('Login successful! User ID:', userCredential.user.uid);
    process.exit(0);
  } catch (error) {
    console.error('Login failed! Error Code:', error.code);
    console.error('Error Message:', error.message);
    process.exit(1);
  }
}

testLogin();
