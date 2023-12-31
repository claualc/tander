import { getDoc, getFirestore, doc, getDocs } from "firebase/firestore";

import dbServices from "./firebase/database"
import { Photo, User, UserTeam } from "@domain/User";
import { Language } from "@api/domain/Language";
import { converter } from "@firebaseServ/database/converterDTO";
import { City } from "@api/domain/Location";
import * as locationServices from "@serv/locationServices";
import { Course, Univeristy } from "@api/domain/University";

interface userServiceI {
    listAll(): Promise<any>;
    getById(id: string | String | number | Number): Promise<User>;
}

const COLLECTION_ID = "user"; //collection

const parseUserAsync = async (data: any): Promise<User> => {
    const university = await getDoc(data.university)
    const course = await getDoc(data.course) 
    const team = await getDoc(data.team) 
    const daybirth = new Date(data.birth) || new Date()

    let langKnown = await dbServices.getListDataFromDocReferences(data.langKnown)
    langKnown = langKnown.map((l: any) => new Language(l.data.name, l.id))
    let langToLearn = await dbServices.getListDataFromDocReferences(data.langToLearn)
    langToLearn = langToLearn.map((l:any) => new Language(l.data.name, l.id))
    const photos: Photo[] = await dbServices.getListDataFromDocReferences(data.photos)
    const city: City = await locationServices.getCity(data.city)
    const matches: String[] = data.matches
    const likedUsersId: String[] = data.likedUsers

    const user = new User(
        data.id,
        data.username,
        daybirth, // miliseconds from epoch
        new Date().getUTCFullYear() - daybirth.getUTCFullYear(), // miliseconds from epoch
        data.hasSeenWhoLikesMeToday, // always at 12pm resets to false,
        university.data() as Univeristy,
        course.data() as Course,
        langToLearn,
        langKnown,
        photos,
        team.data() as UserTeam,
        city,
        likedUsersId,
        matches,
    )

    return user
}

const userFirebaseConverter: converter<User> = {
    toFirestore: (item) => ({...item}),
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        return await parseUserAsync(data);
    }
}

export const listAll = async () => {
    return await dbServices.listAll(COLLECTION_ID, userFirebaseConverter);
}

export const getById = async (id: string | String | number | Number) => {
    return await dbServices.findById(COLLECTION_ID,userFirebaseConverter,id)
}
