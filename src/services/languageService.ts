import services from "@serv/firebase";
import { Language } from "@api/domain/Language";
import { converter } from "@firebaseServ/database/converterDTO";

import dbServices from "./firebase/database"

interface languageServiceI {
    listAll(): Promise<Language[]>;
}

const COLLECTION_ID = "language"; //collection

const languageFirebaseConverter: converter<Language> = {
    toFirestore: (item) => ({...item}),
    fromFirestore(snap, opt) {
        const data = snap.data(opt)! as Language;
        return data;
    }
}

const languageService: languageServiceI = {
    listAll: async () => {
        const docs = await dbServices.listAll(COLLECTION_ID,languageFirebaseConverter) || [];
        return docs.map((d) => d.data() as Language);
    }
}

export default languageService;