import * as firebase from 'firebase/app';
import apiKeys from "./keys";

//firebase modules
import FirestoreModule from "@serv/firebase/database";

// Initialize Firebase
const initFirebaseService = () => {
  console.log("\n..::Init FirebaseService")
  
  if (!firebase.getApps().length) {
    console.log(".... Connected Firebase")

    const app = firebase.initializeApp(apiKeys.firebaseConfig);
    
    // add modules
    const dbService = FirestoreModule(app)

    return { 
      dbService
    }
  }
}

export const services = initFirebaseService();
