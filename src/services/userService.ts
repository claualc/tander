import { getDoc } from "firebase/firestore";

import dbServices from "./firebase/database"
import { User } from "@domain/User";
import { Course, Univeristy } from "@api/domain/University";
import { Language } from "@api/domain/Language";
import { converter } from "@firebaseServ/database/converterDTO";

interface userServiceI {
    listAll(): Promise<any>;
}

const COLLECTION_ID = "user"; //collection

const parseUserAsync = async (data: any) => {
    console.log("parseUserAsync")
    const university = (
        await getDoc(data.university)
    ).data() as Univeristy
    const course = (
        await getDoc(data.course) 
    ).data() as Course

    const langToLearn: Language[] = await data.langToLearn.map(
        async (d: any) => {
            const doc = await getDoc(d)
            console.log("D",d)
            return doc
    });

    const langKnown: Language[] = await data.langKnown.map(
        async (d: any) => {
            const doc = await getDoc(d)
            return doc
    });

    const user = new User(
        data.id,
        data.username,
        new Date(data.birth.seconds * 1000),
        data.hasSeenWhoLikesMeToday, // always at 12pm resets to false,
        university,
        course,
        langToLearn,
        langKnown
        // photos.data() as Photo[],
        // team.data() as UserTeam,
        // city.data() as City,
        // likedUsers.data() as User[],
        // matches.data() as User[]
    )

    // const photos = await getDoc(data.photos)
    // console.log("..::938932 photos", photos)
    // const team = await getDoc(data.team)
    // const city = await getDoc(data.city)
    // const likedUsers = await getDoc(data.likedUsers)
    // const matches = await getDoc(data.matches)
    console.log("parser user async", user)
    console.log(user)
    return user
}

const userFirebaseConverter: converter<User> = {
    toFirestore: (item) => ({...item}),
    fromFirestore: (snap, opt) => {
        const data = snap.data(opt)!;
        return data;
    }
}

const listAll = async () => {
    const docs = await dbServices.listAll(COLLECTION_ID, userFirebaseConverter);
    const users  = await docs.map(async (d) => {
        let data = await d.data()
        console.log("PARSER")
        const user: User = await parseUserAsync(data)
        console.log("FINAL PARSER")
        return user
    });

    return users
}

const userService: userServiceI = {
    listAll
}

export default userService;