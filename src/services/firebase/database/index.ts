import { getFirestore, getDocs, doc, query, collection, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc } from "firebase/firestore";
import { converter } from "./converterDTO";
import firebase from "@firebaseServ/index";



const FirestoreService = () => {
    console.log("..:: FirestoreService ...")
    const db = getFirestore(firebase.getApp());
    console.log("..:: FirestoreService initiated");

    const getDocRefById = (collect: string, converter: converter<any>, id: any) => {
        return doc(db ,collect,id).withConverter(converter);
    }    

    return {
        getDataArrayDoc: async (data: any[]): Promise<any> => {
            console.log("getDataArrayDocgetDataArrayDoc", data)
            const promisses = data ? data.map(
                async (d: any) => {
                    return d.data()
            }) : null;
            return promisses ? Promise.all(promisses) : []
        },
        getListDataFromDocReferences: async (data: any[]): Promise<any> => {
            const promisses = data ? data.map(
                async (d: any) => {
                    const doc = await getDoc(d)
                    return doc.data()
            }) : null;
            return promisses ? Promise.all(promisses) : []
        },
        findById: async (collect: string, converter: converter<any>, id: any) => {
            const querySnapshot = await getDoc(getDocRefById(collect,converter,id));
            return querySnapshot.data();
        },
        getDocRefById,
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