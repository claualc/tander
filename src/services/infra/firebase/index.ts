import FCMService from './notifications';

// import  all modules to initialize modules
import FirestoreService from './database';
import AuthService from './auth';
import * as firebase from 'firebase/app';

console.log("\n..:: Init FirebaseService")
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
  authDomain:  process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  databaseURL:  process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:  process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId:  process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId:  process.env.EXPO_PUBLIC_FIREBASE_APPID
}

export const userFactoryApp = "userFactory";

if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
  firebase.initializeApp(firebaseConfig, userFactoryApp);

  // init modules
}

const initAsyncFirebaseServices = async () => {
    await FCMService.initAsyncService();
    //await FCMService.initAsyncService();
}

export default firebase;
export {initAsyncFirebaseServices};
