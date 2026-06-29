import { mockDoctors } from './src/utils/mockDoctors.js';
import axios from 'axios';

async function seed() {
  console.log('Seeding doctors to MongoDB...');
  for (const doc of mockDoctors) {
    const payload = {
      ...doc,
      // map to backend expectations if needed, but since our backend is schemaless
      // we can just push the exact mock object!
      specialization: doc.specialty,
      consultationFee: doc.feeAmount,
    };
    try {
      await axios.post('http://127.0.0.1:5001/doctors', payload);
      console.log(`Inserted ${doc.name}`);
    } catch (err) {
      console.error(`Failed to insert ${doc.name}`);
    }
  }
  console.log('Seeding complete!');
}

seed();
