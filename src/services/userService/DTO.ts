import { DocumentReference } from "firebase/firestore";
import { User } from "@api/domain/User";
import { getDDMMYYYYFromDate } from "@components/utils";

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

    photos?: string[]; // base64 value
    photoChunkRefs?: string[]; 
    /* ex 
        [ 
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 1 is made from 2 chunks
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 2 is made from 2 chunks
        ]
    */

    FCMPushNotificationsToken?: string;
    bio?: string;

    musicInterest?: MusicInterestDTO;
    musicInterestRef?: string; 
}

export interface MusicInterestDTO {
    album_name: string;
    artist_name: string;
}

/*
    Firebase has a limit of 1048487 bytes
    for string.
    As a temporary solution, the 64base value of a photo
    is saves in two different fields,
    joined together to get the value

    Each DTO is a chunk of a photo value
*/
export interface PhotoChunkDTO {
    value: string;
    userRef: DocumentReference;
    photoLogicalId: string;
    id: number;
}

export const convertUserToCreateDTO = (user: User) => {

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
        bio: user.bio || "",
        musicInterestRef: ""
    }

    // if (user.musicInterest) 
    //     dto = {
    //         ...dto,
    //         musicInterest: {
    //             album_name: user.musicInterest.albumName || "" ,
    //             artist_name: user.musicInterest.artistName || "",
    //         }
    //     }
    return dto
}

 