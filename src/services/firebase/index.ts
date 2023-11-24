import * as firebase from 'firebase/app';
import apiKeys from "./keys";


// to init services
import dBService from "./database"


console.log("\n..::Init FirebaseService")
  
if (!firebase.getApps().length) {
  firebase.initializeApp(apiKeys.firebaseConfig);
}

export default firebase;
