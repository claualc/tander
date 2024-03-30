import { getFirestore, getDocs, doc, query, collection, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc, setDoc, addDoc, DocumentReference, updateDoc } from "firebase/firestore";
import { converter } from "./converterDTO";
import firebase from "@firebaseServ/index";
import { generateRandomString } from "@components/utils";


const FirestoreService = () => {
    console.log("..:: FirestoreService ...")
    const db = getFirestore(firebase.getApp());
    console.log("..:: FirestoreService initiated");

    /*
        Document: firebase object containting the domain object.
        Ref: id to refer to the document in the Firebase API
            with metadata of how to obtain it
            
        The converter is defined with the reference
            and applied when gtting the document
    */

    const getRefById = async (collectionName: string, id: any, converter?: converter<any>) => {
        return converter ? 
            await doc(db ,collectionName, id).withConverter(converter)
            : await doc(db ,collectionName, id)
    }    

    const getObjectByRef = async (ref: DocumentReference<DocumentData, DocumentData>) => {
        const doc = await getDoc(ref)
        return doc.data();
    }

    return {
        getDataArrayDoc: async (data: any[]): Promise<any> => {
            const promisses = data ? data.map(
                async (d: any) => {
                    return  {data: d.data(), id: d.id}
            }) : null;
            return promisses ? Promise.all(promisses) : []
        },
        getListDataFromDocReferences: async (ref: any[]): Promise<any> => {
            const promisses = ref ? ref.map(
                async (d: any) => {
                    const doc = await getDoc(d)
                    return {data: doc.data(), id: doc.id}
            }) : null;
            return promisses ? Promise.all(promisses) : []
        },
        getDataFromDocReference: async (ref: any): Promise<any> => {
            const doc = await getDoc(ref)
            return {data: doc.data(), id: doc.id};
        },
        getObjectById: async (collectionName: string, id: any, converter?: converter<any>) => {
            const ref = await getRefById(collectionName,id, converter);
            return await getObjectByRef(ref)
        },
        getObjectByRef,
        getRefById,
        create: async (collectionName: string, data: any, converter?: converter<any>) => {
            let id_ = generateRandomString(20)+"_"; // _ symbol to know it was generated from app
            
            let ref = await getRefById(collectionName, id_, converter);
            
            try {
                await setDoc(ref, data);
            } catch(e) {
                console.log("..:: FirestoreService.create ERROR")
                console.log(e)
            } 
           
            return ref;
        },
        update: async (collectionName: string, data: any, id: any, converter?: converter<any>) => {
            
            let ref = await getRefById(collectionName, id, converter);
            
            try {
                await updateDoc(ref, data);
            } catch(e) {
                console.log("..:: FirestoreService.update ERROR")
                console.log(e)
            } 
           
            return ref;
        },
        listAll: async (collect: string, converter: converter<any>) => {

            const q = query(collection(db, collect)
                                ).withConverter(converter)

            const querySnapshot = await getDocs(q);
            
            const docsData =  querySnapshot.docs.map(
                async (d) => {
                    return await d.data()});
            return Promise.all(docsData)
        },
    }
}

const dbService = FirestoreService();
export default dbService;