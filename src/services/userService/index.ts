import { DocumentReference, getDoc } from "firebase/firestore";

import locationServices from "@serv/locationServices";
import languageService from "@serv/languageService";
import studentService from "@serv/studenService";

import { generateRandomString, getDateFromString } from "@components/utils";

import { converter } from "@firebaseServ/database/converterDTO";
import FCMService from "@firebaseServ/notifications";
import dbServices from "@firebaseServ/database"

import { MusicInterest, Photo, User, UserTeam } from "@domain/User";
import userTeamDic from "@assets/dictionaries/userTeam";

import { CreateUserDTO,  PhotoChunkDTO } from "./DTO";

const COLLECTION_ID = "user"; // main collection
const SUBCOLLECTION_PHOTO_ID = "photo"; // collection related to main
const SUBCOLLECTION_PHOTOCHUNKS_ID = "photo_chunks"; // collection related to main

const parseUserFromFirestoreAsync = async (data: any): Promise<User> => {
    const daybirth = getDateFromString(data.birth as string)
    // console.log("daybirth",daybirth)
    const country = locationServices.getCountryById(data.country)
    // console.log("country",country)
    const university = studentService.getUniversityById(data.university)
    // console.log("university",university)
    const course = studentService.getCourseById(data.course)
    // console.log("course",course)
    const langKnown = data.langKnown.map((id: string) => languageService.getById(id))
    // console.log("langKnown",langKnown)
    const langToLearn = data.langToLearn.map((id: string) => languageService.getById(id))
    // console.log("langToLearn",langToLearn)
    const team = getUserTeamById(data.team)
    // console.log("team",team)

    let musicInterest;
    if (data.musicInterest) {
        let {data : musicData, id: musicId} = await dbServices.getDataFromDocReference(data.musicInterest)
        if (musicData &&  musicId) {
            musicInterest = new MusicInterest(musicData.artist_name, musicData.album_name, musicId)
        }
    }
    // console.log("musicInterest",musicInterest)

    let photos = await getUserPhotos(data.photoChunkRefs)
    
    const matches: String[] = data.matches
    const likedUsersId: String[] = data.likedUsers

    const user = new User(
        data.id,
        data.username as string,
        daybirth,
        data.phoneNumber as number,
        data.FCMPushNotificationsToken as string,
        country,
        university,
        course,
        langToLearn,
        langKnown,
        team,
        data.hasSeenWhoLikesMeToday, // always at 12pm resets to false,
        photos,
        likedUsersId,
        matches,
        data.profileDescription,
        musicInterest,
        data.bio as string
    )

    return user as User
}

const userConverter: converter<CreateUserDTO> = {
    toFirestore: (item) => {
        return {...item}
    },
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        console.log("..:: FirebaseService.fromFirestore (user)")
        return await parseUserFromFirestoreAsync(data);
    }
}


export const listAll = async () => {
    return await dbServices.listAll(COLLECTION_ID, userConverter) as User[];
}

export const getById = async (id: string | String | number | Number) => {
    return await dbServices.getObjectById(COLLECTION_ID,id, userConverter) as User;
}

const update = async (user: CreateUserDTO, id: string) => {
    const ref = await dbServices.getRefById(COLLECTION_ID,id,userConverter);
    await dbServices.update(COLLECTION_ID, user, ref.id, userConverter)

    console.log("..:: FirebaseService.update (user)", ref.id)
    return ref
}

export const create = async (dto: CreateUserDTO) => {
    const {photos, ...user} = dto;
    user.FCMPushNotificationsToken = FCMService.getDeviceToken()

    const userRef = await dbServices.create(
        COLLECTION_ID, user, userConverter )
    
    
    if (photos?.length) {
        const photoRefsPromise = photos?.map(
            async (p) => await createUserPhoto({
                value: p, 
                userRef: userRef
            })
        )

        const photoChunkRefs = await Promise.all(photoRefsPromise)
        await update({
            ...user,
            photoChunkRefs
        }, userRef.id)
    }

    const userCreated = await dbServices.getObjectByRef(userRef)
    console.log("..:: FirebaseService.create (user)", userRef.id)
    return userCreated as User
}

const CHUNK_SYMBOL_SEPARATOR = "."
export const createUserPhoto = async (photo: {
    value: String;
    userRef: DocumentReference;
}) => {

    let {value, userRef} = photo

    let half = Math.floor(value.length/2)
    let mostSignificatValue = value.slice(0, half)
    let lessSignificatValue = value.slice(half)

    let id = generateRandomString(20);

    // Most Significat Value
    let MSVdto: PhotoChunkDTO = {
        value: mostSignificatValue,
        userRef,
        photoLogicalId: id,
        id: 0
    }

    //  // Middle Value
    //  let MVdto: PhotoChunkDTO = {
    //     value: middleValue,
    //     userRef,
    //     photoLogicalId: id,
    //     id: 1
    // }

    // Less Significat Value
    let LSVdto: PhotoChunkDTO = {
        value: lessSignificatValue,
        userRef,
        photoLogicalId: id,
        id: 2
    }

    const MSVphotoRef = await dbServices.create(
        SUBCOLLECTION_PHOTOCHUNKS_ID, MSVdto )

    // const MVphotoRef = await dbServices.create(
    //     SUBCOLLECTION_PHOTOCHUNKS_ID, MSVdto )

    const LSVphotoRef = await dbServices.create(
        SUBCOLLECTION_PHOTOCHUNKS_ID, LSVdto )
    
    console.log("..:: FirebaseService.createUserPhoto (photo)", [MSVphotoRef.id, LSVphotoRef.id])
    return `${MSVphotoRef.id}${CHUNK_SYMBOL_SEPARATOR}${LSVphotoRef.id}`
}

export const getUserPhotos = async (chunkRefs: string[]) => {

    let photos = chunkRefs.map(async (photoChunk) => {
        let [chunk1, chunk2] = photoChunk.split(CHUNK_SYMBOL_SEPARATOR);

        let msv = (await dbServices.getObjectById(SUBCOLLECTION_PHOTOCHUNKS_ID,chunk1)) as PhotoChunkDTO;
        let lsv = (await dbServices.getObjectById(SUBCOLLECTION_PHOTOCHUNKS_ID,chunk2)) as PhotoChunkDTO;

        return new Photo(
            msv.value+lsv.value,
            msv.photoLogicalId
        )

    })

    return await Promise.all(photos)
}

export const getUserTeamById = (id: number) => {
    const dto = userTeamDic[id]
    return new UserTeam(
        id, dto.name, dto.icon
    )
}

export const listAllUserTeam = () => {
    return userTeamDic.map((dto, id) => new UserTeam(
        id, dto.name, dto.icon
    ))
}
