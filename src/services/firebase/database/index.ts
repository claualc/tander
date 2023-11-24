import { getFirestore, getDocs, doc, query, collection, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc } from "firebase/firestore";
import {converter} from "../converterDTO";

import firebase from "./../index";

const FirestoreService = () => {
    const db = getFirestore(firebase.getApp());
    console.log("..:: FirestoreService initiated");

    return {
        findById: async (collect: string, converter: converter<any>, id: any) => {
            const q = doc(db ,collect,id).withConverter(converter);
            const querySnapshot = await getDoc(q);
            return querySnapshot.data();
        },
        listAll: async (collect: string, converter: converter<any>) => {
            const q = query(collection(db, collect)
                                ).withConverter(converter)

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs;
        },
    }
}

const dbService = FirestoreService();
export default dbService;