import services from "@serv/firebase";
import { Language } from "@api/domain/Language";
import { converter } from "@firebaseServ/database/converterDTO";

import dbServices from "./firebase/database"

interface languageServiceI {
    listAll(): Promise<Language[]>;
}

const COLLECTION_ID = "language"; //collection

export const languageParser = async (data: any): Promise<Language> => {
    return new Language(
        data.name,
        data.id);
}

const languageFirebaseConverter: converter<Language> = {
    toFirestore: (item) => ({...item}),
    fromFirestore(snap, opt) {
        const data = snap.data(opt)!;
        return languageParser(data);
    }
}

const languageService: languageServiceI = {
    listAll: async () => {
        const docs = await dbServices.listAll(COLLECTION_ID,languageFirebaseConverter) || [];
        return docs.map((d) => d.data() as Language);
    }
}

export default languageService;