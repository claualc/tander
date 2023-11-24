import { City, Country } from "@api/domain/Location";
import {converter} from "@firebaseServ/database/converterDTO";

import dbServices from "./firebase/database";

interface locationServiceI {
    getCity(id: String): Promise<City>;
    getCountry(id: String): Promise<Country>;
}

const COLLECTION_ID_I = "city"; //collection
const COLLECTION_ID_O = "country"; //collection

//firebase converters
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

const languageService: locationServiceI = {
    getCity: async (id) => {
        const doc = await dbServices.findById(COLLECTION_ID_I,cityFC,id) || [];
        return doc as City;
    },
    getCountry: async (id) => {
        const doc = await dbServices.findById(COLLECTION_ID_O,countryFC,id) || [];
        return doc as Country;
    },
}

export default languageService;