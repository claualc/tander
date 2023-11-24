import * as firebase from 'firebase/app';
import apiKeys from "./keys";


// to init services
import dBService from "./database"

// Initialize Firebase
console.log("\n..::Init FirebaseService")
  
if (!firebase.getApps().length) {
  console.log(".... Connected Firebase")
  firebase.initializeApp(apiKeys.firebaseConfig);

  // return { 
  //   // modules
  //   dbService: await FirestoreModule(app)
  // }
}

export default firebase;
