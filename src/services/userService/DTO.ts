import { Photo, User } from "@domain/User";
import { getDDMMYYYYFromDate } from "@components/utils";
import albumService, { MusicInterestDTO } from "@serv/albumService";

export interface SimpleUserDTO {
    /**
     * combinationn of user info with match info
     */
    username: string;
    profilePhoto: Photo; 
    id: string;
    FCMPushNotificationsToken: string;
}

export interface CreateUserDTO {
    username: string;
    birth: string; //DDMMYYYY
    phoneNumber: string;
    university: string; //id
    course: number; //id
    langToLearn: string[]; //language code
    langKnown: string[]; //language code
    team: number; //id
    country: string; //id

    photos?: Photo[]; // base64 value
    photoChunkRefs?: string[]; 
    /* ex 
        [ 
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 1 is made from 2 chunks
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 2 is made from 2 chunks
        ]
    */

    FCMPushNotificationsToken: string | null;
    bio: string | null;

    musicInterest: MusicInterestDTO | null;
}

/*
    Firebase has a limit of 1048487 bytes
    for string.
    As a temporary solution, the 64base value of a photo
    is saves in two different fields,
    joined together to get the value

    Each DTO is a chunk of a photo value
*/
export const convertUserToCreateDTO = (user: User) => {

    let musicInterest = null;
    if (user.musicInterest) {
        musicInterest = albumService.convertMusicInterectToDTO(user.musicInterest)
    }
    
    let dto: CreateUserDTO = {
        username: user.username,
        birth: getDDMMYYYYFromDate(user.birth), //DDMMYYYY
        phoneNumber: user.phoneNumber,
        university: user.university.id, //id
        course: user.course.id, //id
        langToLearn: user.langToLearn.map(l => l.id), //language code
        langKnown: user.langKnown.map(l => l.id), //language code
        team: user.team.id , //id
        country: user.country.id , //id
        FCMPushNotificationsToken: user.FCMPushNotificationsToken,
        bio: user.bio || null,
        musicInterest,
    }
    return dto
}


export const convertUserToSimpleDTO = (user: User) => {

    let musicInterest = null;
    if (user.musicInterest) {
        musicInterest = albumService.convertMusicInterectToDTO(user.musicInterest)
    }
    
    let dto: SimpleUserDTO = {
        username: user.username,
        FCMPushNotificationsToken: user.FCMPushNotificationsToken,
        profilePhoto: user.photos?.length ? user.photos[0] : {} as Photo,
        id: user.id
    }
    return dto
}

 