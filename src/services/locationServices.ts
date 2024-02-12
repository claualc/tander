import { City, Country } from "@api/domain/Location";
import {converter} from "@firebaseServ/database/converterDTO";

import dbServices from "./firebase/database";
import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";

import countries from "@dict/country";
import nationalisties from "@dict/nationality";
import countryCodes from "@dict/country_code";

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


export const getCityObjectFromDocument = async (docRef: DocumentReference<any, DocumentData>) => {
    const cityDoc = await getDoc(docRef)
    const city = cityDoc.data()

    const cId = city?.country
    let country;
    if (cId) {
        let nationality = nationalisties[cId]
        let lastLetter = nationality.split("").pop()
        let firstLetter = nationality.split("")[0]
        nationality = (lastLetter == "a" || lastLetter == "o")
            ? firstLetter?.toUpperCase() + nationality.slice(1, -1) + "@" : nationality

        country = new Country(
            countries[cId],
            countryCodes[cId],
            nationality,
            cId
        );
    }
    return new City(city?.name, country);
}

export const getCityById = async (id: string) => {
    const docRef = dbServices.getDocRefById(COLLECTION_ID_I,cityFC,id);
    const city = await getCityObjectFromDocument(docRef)
    return city;
}
