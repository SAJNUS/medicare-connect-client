import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map environment variables
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

const doctors = [
  // Cardiology
  { name: 'Irfan Khan', email: 'irfankhan@gmail.com' },
  { name: 'Nusrat Jahan', email: 'nusratjahan@gmail.com' },
  { name: 'Shafiqur Rahman', email: 'shafiqurrahman@gmail.com' },
  
  // Neurology
  { name: 'Tariq Hasan', email: 'tariqhasan@gmail.com' },
  { name: 'Farhana Akter', email: 'farhanaakter@gmail.com' },
  { name: 'Mahmudul Hasan', email: 'mahmudulhasan@gmail.com' },
  
  // Pediatrics
  { name: 'Asif Iqbal', email: 'asifiqbal@gmail.com' },
  { name: 'Sadia Afrin', email: 'sadiaafrin@gmail.com' },
  { name: 'Kamrul Islam', email: 'kamrulislam@gmail.com' },
  
  // Orthopedics
  { name: 'Riaz Uddin', email: 'riazuddin@gmail.com' },
  { name: 'Tahmina Begum', email: 'tahminabegum@gmail.com' },
  { name: 'Abdur Razzak', email: 'abdurrazzak@gmail.com' },
  
  // Dermatology
  { name: 'Noman Chowdhury', email: 'nomanchowdhury@gmail.com' },
  { name: 'Samira Haque', email: 'samirahaque@gmail.com' },
  { name: 'Kazi Monir', email: 'kazimonir@gmail.com' },
  
  // Gynecology
  { name: 'Shireen Akhter', email: 'shireenakhter@gmail.com' },
  { name: 'Rokeya Sultana', email: 'rokeyasultana@gmail.com' },
  { name: 'Salma Begum', email: 'salmabegum@gmail.com' },
  
  // Dentistry
  { name: 'Sajjad Ali', email: 'sajjadali@gmail.com' },
  { name: 'Tanjina Islam', email: 'tanjinaislam@gmail.com' },
  { name: 'Mizanur Rahman', email: 'mizanurrahman@gmail.com' },
  
  // Psychiatry
  { name: 'Fahim Shahriar', email: 'fahimshahriar@gmail.com' },
  { name: 'Nadia Kamal', email: 'nadiakamal@gmail.com' },
  { name: 'Anisur Rahman', email: 'anisurrahman@gmail.com' }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerFirebaseDoctors() {
  console.log(`[Firebase Migrator] Registering ${doctors.length} doctors to Firebase Auth...`);
  
  let successCount = 0;
  let existCount = 0;

  for (const doc of doctors) {
    const password = doc.email.charAt(0).toUpperCase() + doc.email.slice(1);
    const formattedName = doc.name.toLowerCase().replace(/\s+/g, '_');
    const photoURL = `/doctors/dr_${formattedName}.png`;

    try {
      // Try to create the user
      const userCredential = await createUserWithEmailAndPassword(auth, doc.email, password);
      
      // Update their profile to include name and photo
      await updateProfile(userCredential.user, {
        displayName: doc.name,
        photoURL: photoURL
      });
      
      console.log(`✅ [Created] ${doc.email}`);
      successCount++;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ [Exists] ${doc.email} already exists in Firebase.`);
        existCount++;
      } else {
        console.error(`❌ [Error] Failed for ${doc.email}: ${error.message}`);
      }
    }
    
    // Slight delay to avoid hitting rate limits
    await delay(300);
  }

  console.log(`\n[Summary] Successfully created: ${successCount}`);
  console.log(`[Summary] Already existed: ${existCount}`);
  console.log(`[Summary] Total processed: ${doctors.length}`);
  
  process.exit(0);
}

registerFirebaseDoctors();
