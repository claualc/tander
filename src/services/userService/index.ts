import { DocumentReference } from "firebase/firestore";

import locationServices from "@serv/locationServices";
import languageService from "@serv/languageService";
import studentService from "@serv/studenService";

import { getDateFromString } from "@components/utils";

import { converter } from "@firebaseServ/database/converterDTO";
import dbServices from "@firebaseServ/database"

import { Photo, User, UserTeam } from "@domain/User";
import userTeamDic from "@assets/dictionaries/userTeam";

import { CreateUserDTO } from "./DTO";
import albumService from "@serv/albumService";
import photoServices from "@serv/photoServices";

const COLLECTION_ID = "user"; // main collection

const parseUserFromFirestoreAsync = async (data: any, id: string): Promise<User> => {
    const daybirth = getDateFromString(data.birth as string)
    // console.log(data.birth,"daybirth",daybirth)
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
        musicInterest = await albumService.getMusicInterestFromDTO(data.musicInterest)
    }

    let photos = await photoServices.getUserPhotos(data.photoChunkRefs)
    
    const matches: String[] = data.matches
    const likedUsersId: String[] = data.likedUsers

    const user = new User(
        id,
        data.username as string,
        daybirth,
        data.phoneNumber as string,
        data.FCMPushNotificationsToken as string,
        country,
        university,
        course,
        langToLearn,
        langKnown,
        team,
        photos,
        data.hasSeenWhoLikesMeToday, // always at 12pm resets to false,
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
        console.log("..:: FirebaseService.fromFirestore (user)", snap.id)
        return await parseUserFromFirestoreAsync(data, snap.id);
    }
}

export const listAll = async () => {
    return await dbServices.listAll(COLLECTION_ID, userConverter) as User[];
}

export const getById = async (id: string | String | number | Number) => {
    return await dbServices.getObjectById(COLLECTION_ID,id, userConverter) as User;
}

export const update = async (user: CreateUserDTO, userId: string) => {
    let {photos: newPhotos, ...dto} = user;

    const ref = await dbServices.getRefById(COLLECTION_ID, userId,userConverter);
    
    await dbServices.update(COLLECTION_ID, dto, ref.id, userConverter)

    console.log("..:: FirebaseService.update (user)", ref.id)
    const userUpdated = await dbServices.getObjectByRef(ref)
    return userUpdated as User
}

export const create = async (dto: CreateUserDTO) => {
    const {photos, ...userUncompleteDTO} = dto;

    const userRef = await dbServices.create(
        COLLECTION_ID, userUncompleteDTO, userConverter )
    
    let photoChunkRefs: string[] = [];
    if (photos?.length) {
        const photoRefsPromise = photos.filter((v:any) =>  v != null)?.map(
            async (p) => await photoServices.createUserPhoto({
                photo: p, 
                userRef: userRef
            })
        )

        photoChunkRefs = await Promise.all(photoRefsPromise)
    }

    await update({
        ...userUncompleteDTO,
        photoChunkRefs,
    }, userRef.id)

    const userCreated = await dbServices.getObjectByRef(userRef)
    console.log("..:: FirebaseService.create (user)", userRef.id)
    return userCreated as User
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
