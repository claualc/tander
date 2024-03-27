import { DocumentReference, getDoc } from "firebase/firestore";

import dbServices from "./firebase/database"
import { CreateUserDTO, MusicInterest, Photo, User, UserTeam } from "@domain/User";
import { converter } from "@firebaseServ/database/converterDTO";
import { City } from "@api/domain/Location";
import locationServices from "@serv/locationServices";
import { Course, Univeristy } from "@api/domain/University";
import languageService from "./languageService";

const COLLECTION_ID = "user"; // main collection
const SUBCOLLECTION_PHOTO_ID = "photo"; // collection related to main

const parseUserFromFirestoreAsync = async (data: any): Promise<User> => {
    const university = await getDoc(data.university)
    const course = await getDoc(data.course) 
    const team = await getDoc(data.team) 
    const daybirth = new Date(data.birth) || new Date()

    const langKnown = data.langKnown.map((id: any) => languageService.getById(id))
    const langToLearn = data.langToLearn.map((id: any) => languageService.getById(id))
    let {data : musicData, id: musicId} = await dbServices.getDataFromDocReference(data.musicInterest)
    const musicInterest = new MusicInterest(musicData.artist_name, musicData.album_name, musicId)
    let photos: Photo[] = await dbServices.getListDataFromDocReferences(data.photos)
    photos = photos.map((p:any) => new Photo(p.data.value, p.id))
    const city: City = await locationServices.getCityById(data.city)
    const matches: String[] = data.matches
    const likedUsersId: String[] = data.likedUsers

    const user = new User(
        data.id,
        data.username,
        daybirth, // miliseconds from epoch
        data.phoneNumber,
        new Date().getUTCFullYear() - daybirth.getUTCFullYear(), // miliseconds from epoch
        musicInterest,
        data.hasSeenWhoLikesMeToday, // always at 12pm resets to false,
        data.FCMPushNotificationsToken,
        university.data() as Univeristy,
        course.data() as Course,
        langToLearn,
        langKnown,
        photos,
        team.data() as UserTeam,
        city,
        likedUsersId,
        matches,
        data.profileDescription
    )

    return user
}

const userFirebaseConverter: converter<CreateUserDTO> = {
    toFirestore: (item) => {
        return {...item}
    },
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        return await parseUserFromFirestoreAsync(data);
    }
}

export const listAll = async () => {
    return await dbServices.listAll(COLLECTION_ID, userFirebaseConverter);
}

export const getById = async (id: string | String | number | Number) => {
    return await dbServices.findById(COLLECTION_ID,userFirebaseConverter,id)
}

export const create = async (user: CreateUserDTO) => {
    const {photos, ...rest} = user;

    const userRef = await dbServices.create(
        COLLECTION_ID, rest, userFirebaseConverter )
    
    console.log("created user id", userRef.id)

    const promises = photos?.map(async (p) => {
            await createUserPhoto({
                value: "data:image/png;base64,"+p, 
                userRef: userRef
        })
    })

    const photoREfs = await Promise.all(promises)

}

export const createUserPhoto = async (photo: {
    value: string;
    userRef: DocumentReference;
}) => {
    const result = await dbServices.create(
        SUBCOLLECTION_PHOTO_ID, photo )
    
    console.log("created photo", result.id)
    return result
}