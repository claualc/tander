import { City, Country } from "@api/domain/Location";
import {converter} from "@firebaseServ/database/converterDTO";

import dbServices from "./firebase/database";
import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";

const COLLECTION_ID_I = "city"; //collection
const COLLECTION_ID_O = "country"; //collection

const cityFC: converter<City> = {
    toFirestore: (item) => ({...item}),
    fromFirestore: (snap, opt) => {
        const data = snap.data(opt)! as City;
        return data;
    }
}

const countryFC: converter<Country> = {
    toFirestore: (item) => ({...item}),
    fromFirestore: (snap, opt) => {
        const data = snap.data(opt)! as Country;
        return data;
    }
}

export const getCountry = async (docRef: DocumentReference<any, DocumentData>) => {
    const doc = await getDoc(docRef)
    return doc.data() as Country;
}

export const getCity = async (docRef: DocumentReference<any, DocumentData>) => {
    const cityDoc = await getDoc(docRef)
    const city = cityDoc.data()
    let country = city?.country
        ? await getCountry(city?.country)
        :null
    return new City(city?.name, country);
}

export const getCityById = async (id: string) => {
    const docRef = dbServices.getDocRefById(COLLECTION_ID_I,cityFC,id);
    const city = await getCity(docRef)
    return city;
}

export const getCountryById = async (id: string) => {
    const docRef = dbServices.getDocRefById(COLLECTION_ID_O,countryFC,id)
    return await getCountry(docRef);
}