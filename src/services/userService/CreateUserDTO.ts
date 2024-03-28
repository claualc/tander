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
    photoRefs?: DocumentReference[]; // firebase service
    FCMPushNotificationsToken?: string;
}
