import { Photo, User } from "@api/domain/User";
import { converter } from "@firebaseServ/database/converterDTO";

import * as userServices from "@serv/userService";
import dbService from "./firebase/database";
import { and, or, where } from "firebase/firestore";
import { generateRandomString } from "@components/utils";
import { SimpleUserDTO, convertUserToSimpleDTO } from "./userService/DTO";

export interface UserMAtchInfoDTO {
    match: MatchFactory;
    targetUser: SimpleUserDTO;
    loggedUser: SimpleUserDTO;
}

export enum MatchState {
    WIP,
    TRUE,
    FALSE
}

export interface MatchFactory {
    id: string;
    userId1: string;
    userId2: string;
    state: MatchState;
    userLikes1: (boolean | null);
    userLikes2: (boolean | null);
    chatId: string | null;
}

const COLLECTION_ID = "match_factory";

const matchFactoryConverter: converter<MatchFactory> = {
    toFirestore: (item) => {
        return {...item}
    },
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        console.log("..:: FirebaseService.fromFirestore (matchFactory)", snap.id)
        const fact: MatchFactory = {
            id: snap.id,
            userId1: data.userId1,
            userId2: data.userId2,
            state: data.state,
            userLikes1: data.userLikes1,
            userLikes2: data.userLikes2,
            chatId: data.chatId,
        }
        return fact;
    }
}

const createUserMatchFactories = async (user1: User) => {
    // created everytime an user is created,
    // in relation with all other users

    const users = await userServices.listAllBasicInfo()
    const created = users.map(async (user2) => {
        if (user1.id != user2.id) {
            const fact: MatchFactory = {
                id: generateRandomString(30),
                userId1: user1.id, 
                userId2: user2.id,
                state: MatchState.WIP,
                userLikes1: null,
                userLikes2: null,
                chatId: null
            }
            let match = await dbService.create(COLLECTION_ID,fact, matchFactoryConverter);
            console.log("  ..::MatchServices.createUserMatchFactories (user)", user1.id, user2.id)
            return match
        }
    })

    await Promise.all(created);
}

const listMatchesByState = async (userId: string, state: MatchState) => {
    // created everytime an user is created,
    // in relation with all other users

    const matches = await dbService.listAll(
        COLLECTION_ID,
        matchFactoryConverter, 
            and(
                or(where("userId1", "==", userId), where("userId2", "==", userId)),
                where("state", "==", state)
            )
    ) as  MatchFactory[]

    console.log("..:: MatchServices.listMatchesByState (user)", userId)
    return matches
}

const getByUserIds = async (userId1: string, userId2: string) => {
    // created everytime an user is created,
    // in relation with all other users

    const matches = await dbService.listAll(
        COLLECTION_ID,
        matchFactoryConverter, 
        and(
            or(where("userId1", "==", userId1), where("userId1", "==", userId2)),
            or(where("userId2", "==", userId1), where("userId2", "==", userId2))
        )
        ) as  MatchFactory[]
    return matches.length ? matches[0] : null
}

const onUserMatchAction = async (user: User, fact: MatchFactory, liked: boolean) => {

    console.log("..:: onUserMatchAction (fac)", fact)
    /**
     * MAtch actions can only take place is matches with state on WIP
     */
    let updated = fact
    
    // update liked action on matched
    if (user.id == fact.userId1)
        updated.userLikes1 = liked
    else 
        updated.userLikes2 = liked

    let {userLikes1, userLikes2} = updated;

    // update state
    if (userLikes1 === true && userLikes2 === true) {
    
        updated.state = MatchState.TRUE
        console.log("    USERS MATCHED!!")
        // send notifications

    } else if ((userLikes1 === false && userLikes2 === true)
        || (userLikes1 === true && userLikes2 === false) 
    ) {

        updated.state = MatchState.FALSE

    } // if either on of them stills null it stays on MatchState.WIP


    // update factory
    await dbService.update(COLLECTION_ID, updated, fact.id)

}

const userLiked = async (loggedUser: User, userLiked: User) => {
    const fac = await getByUserIds(loggedUser.id , userLiked.id);
    if (fac) {
        await onUserMatchAction(loggedUser, fac, true)
    }
    console.log("..:: MatchServices.userLiked")
}

const userUnLiked = async (loggedUser: User, userLiked: User) => {
    const fac = await getByUserIds(loggedUser.id , userLiked.id);
    if (fac) {
        await onUserMatchAction(loggedUser, fac, false)
    }
    console.log("..:: MatchServices.userUnLiked")
}

export const listUsersForMatching = async (userId: string) => {

    const matches = await dbService.listAll(
        COLLECTION_ID,
        matchFactoryConverter, 
            and(
                or(where("userId1", "==", userId), where("userId2", "==", userId)),
            )
    ) as  MatchFactory[]

    const usersProm = matches
        .filter(m => {
            let userLikesAction = (userId == m.userId1) ? m.userLikes1 : m.userLikes2
            return userLikesAction === null // this means the user has not yet interacted with the other us
        })
        .map(async (m) => {
            let userPotentialMatchId = (userId == m.userId1) ? m.userId2 : m.userId1
            return await userServices.getById(userPotentialMatchId)
    });

    return Promise.all(usersProm)
}

export const listMatches = async (loggedUser: User) => {

    let loggedUserDTO = convertUserToSimpleDTO(loggedUser)

    const matches = await dbService.listAll(
        COLLECTION_ID,
        matchFactoryConverter, 
            and(
                or(where("userId1", "==", loggedUser.id), where("userId2", "==", loggedUser.id)),
                where("state", "==", MatchState.TRUE)
            )
    ) as  MatchFactory[]

    const usersDto =  matches.map(async (m) => {
        let targetUserMatched = (m.userId1 == loggedUser.id) ? m.userId2 : m.userId1
        let user = await userServices.getByIdSimpleDTO(targetUserMatched)
        return {targetUser: user, match: m, loggedUser:loggedUserDTO} as UserMAtchInfoDTO
    }) 

    return Promise.all(usersDto)
}

export const update = async (matchFac: MatchFactory, id: string) => {

    let ref = await dbService.update(COLLECTION_ID, matchFac, id, matchFactoryConverter)
    const matchUpdated = await dbService.getObjectByRef(ref)

    console.log("..:: MatchServices.update (match)", id)
    return matchUpdated
}

export default {
    createUserMatchFactories,
    listMatchesByState,
    listUsersForMatching,
    listMatches,
    userLiked,
    userUnLiked,
    update
}