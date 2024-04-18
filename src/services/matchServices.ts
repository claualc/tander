import { User } from "@domain/User";
import { converter } from "@firebaseServ/database/converterDTO";

import * as userServices from "@serv/userService";
import dbService, { PaginationInfo } from "./infra/firebase/database";
import { and, or, where } from "firebase/firestore";
import { generateRandomString } from "@components/utils";
import { SimpleUserDTO, convertUserToSimpleDTO } from "./userService/DTO";
import { MessageDTO } from "./chatServices/DTOs";
import notifications from "./infra/firebase/notifications";


export const POT_MATCH_BATCH_LIMIT = 3; // number of users loaded per each bach

export interface UserMAtchInfoDTO {
    match: MatchFactory;
    targetUser: SimpleUserDTO;
    loggedUser: SimpleUserDTO;
    unreadMsgs: boolean;
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
    lastMsg?: MessageDTO;
}

const COLLECTION_ID = "match_factory";

const matchFactoryConverter: converter<MatchFactory> = {
    toFirestore: (item) => {
        return {...item}
    },
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        console.log("..:: FirebaseService.fromFirestore (matchFact)")
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

    console.log("..:: MatchServices.createUserMatchFactories (user)",user1.id)

    const users = await userServices.listAllBasicInfo()
    const created = users?.map(async (user2: SimpleUserDTO) => {
        let {profilePhoto , ...rest} = user2;
       
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
            return match
        }
    })

    /** 
     * to improve rendedering, wait only for
     * two batches of users
    */
   if(created?.length > POT_MATCH_BATCH_LIMIT*2) {
    await Promise.all(created.slice(0,POT_MATCH_BATCH_LIMIT*2));
    Promise.all(created.slice(POT_MATCH_BATCH_LIMIT*2));
   } else {
    await Promise.all(created)
   }
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
    return matches?.length ? matches[0] : {} as MatchFactory
}

// exporteed only for tests
export const onUserMatchAction = async (user: User, fact: MatchFactory, liked: boolean) => {

    /**
     * Match actions can only take place is matches with state on WIP
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
        let userMatchedId = (user.id == fact.userId1) ? fact.userId2 : fact.userId1;
        let userMatched = await userServices.getByIdSimpleDTO(userMatchedId)

        let matchNotMessages = [
            "You’ve got a new match! Start practicing now 🤓",
            "Are you pretty or smart? Anyways, you’ve got a new match!🔥🔥"
        ]
        
        // notifications.schedulePushNotification(
        //     "Tander",
        //     matchNotMessages[Math.round(Math.random())],
        //     //userMatched.FCMPushNotificationsToken+
        //     "ksj"
        // )

    } else if ((userLikes1 === false && userLikes2 === true)
        || (userLikes1 === true && userLikes2 === false) 
    ) {

        updated.state = MatchState.FALSE

    } // if either on of them stills null it stays on MatchState.WIP

    // update factory
    await dbService.update(COLLECTION_ID, updated, fact.id)
    return updated.state
}

const userLiked = async (loggedUser: User, userLiked: User) => {
    console.log("..:: MatchServices.userLiked")
    const fac = await getByUserIds(loggedUser.id , userLiked.id);
    if (fac) {
        return await onUserMatchAction(loggedUser, fac, true)
    }
    return null;
}

const userUnLiked = async (loggedUser: User, userLiked: User) => {
    console.log("..:: MatchServices.userUnLiked")
    const fac = await getByUserIds(loggedUser.id , userLiked.id);
    if (fac) {
        return await onUserMatchAction(loggedUser, fac, false)
    }
    return null
}

const listUsersForMatching = async (userId: string, count: number, lastLoadedUserId?: string) => {

    let p: PaginationInfo = {
        limit: count,
    } 
    if (lastLoadedUserId) {
        const lastUserRef = await userServices.getRefId(lastLoadedUserId)
        p = {
            ...p,
            lastVisible: lastUserRef
        } as PaginationInfo
    }

    const matches = await dbService.listAll(
        COLLECTION_ID,
        matchFactoryConverter, 
        and(
            or(
                and(where("userId1", "==", userId),where("userLikes1", "==", null)),
                and(where("userId2", "==", userId),where("userLikes2", "==", null))        
            ) ,where("state", "==", MatchState.WIP) 
        ),
        p) as  MatchFactory[]

    const usersProm = matches
        .filter(m => {
            let userLikesAction = (userId == m.userId1) ? m.userLikes1 : m.userLikes2
            return userLikesAction === null // this means the user has not yet interacted with the other us
        })
        .map(async (m) => {
            let userPotentialMatchId = (userId == m.userId1) ? m.userId2 : m.userId1
            return await userServices.getById(userPotentialMatchId)
    });

    usersProm.shift() // first element it the already loaded user : p.lastVisible
    return Promise.all(usersProm)
}

const listUsersMatchedAsTrue = async (loggedUser: User) => {
    let loggedUserDTO = convertUserToSimpleDTO(loggedUser)

    const matches = await listMatchesByState(loggedUser.id, MatchState.TRUE)

    const usersDto = matches?.length ? matches?.map(async (m) => {
        let targetUserMatched = (m.userId1 == loggedUser.id) ? m.userId2 : m.userId1
        let user = await userServices.getByIdSimpleDTO(targetUserMatched)
        let unreadMsgs = false;
        return {targetUser: user, match: m, loggedUser:loggedUserDTO, unreadMsgs} as UserMAtchInfoDTO
    }) : []

    return Promise.all(usersDto)
}

const update = async (matchFac: MatchFactory, id: string) => {

    let ref = await dbService.update(COLLECTION_ID, matchFac, id, matchFactoryConverter)
    const matchUpdated = await dbService.getObjectByRef(ref)

    console.log("..:: MatchServices.update (match)", id)
    return matchUpdated
}

export default {
    createUserMatchFactories,
    listMatchesByState,
    listUsersForMatching,
    listUsersMatchedAsTrue,
    userLiked,
    userUnLiked,
    update,
    COLLECTION_ID,
}