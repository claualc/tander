import FCMService from './notifications';

// import  all modules to initialize modules
import FirestoreService from './database';
import * as firebase from 'firebase/app';


console.log("\n..::Init FirebaseService")

if (!firebase.getApps().length) {
  firebase.initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
    authDomain:  process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
    databaseURL:  process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
    projectId:  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:  process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId:  process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId:  process.env.EXPO_PUBLIC_FIREBASE_APPID
  });

  // init modules
}

const initAsyncFirebaseServices = async () => {
    await FCMService.initAsyncService();
}

export default firebase;
export {initAsyncFirebaseServices};
