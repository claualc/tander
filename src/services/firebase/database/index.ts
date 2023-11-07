import firebase from "firebase/app";
import { getFirestore, getDocs, doc, query, collection } from "firebase/firestore";


interface DatabaseServiceI {
    listAll(collection: string): Promise<any[]>;
}

const FirestoreService = (app: firebase.FirebaseApp): DatabaseServiceI => {
    const db = getFirestore(app);
    console.log("..:: FirestoreService initiated");

    return {
        listAll: async (c) => {
            const q = query(collection(db, c));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => d.data());
        }
    }
}

export default FirestoreService;