import { DocumentReference } from "firebase/firestore";

export interface CreateUserDTO {
    username: string;
    birth: string; //DDMMYYYY
    phoneNumber: number;
    university: string; //id
    course: string; //id
    langToLearn: string[]; //language code
    langKnown: string[]; //language code
    team: number; //id
    country: number; //id
    photos?: string[]; // base64 value
    photoChunkRefs?: string[]; 
    /* ex 
        [ 
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 1 is made from 2 chunks
            "ref/chunk1_id"."ref/chunk2_id" ,   photo 2 is made from 2 chunks
        ]
    */

    FCMPushNotificationsToken?: string;
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

 