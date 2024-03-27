import { Language } from "./Language";
import { City, Country } from "./Location";
import { Univeristy, Course} from "./University";

export class UserTeam {
    constructor(
        public value_: number, //1 spritz/2 negroni/3 vino/4 aqcua/5 frizzante
        public id_?: String,
    ) {}

    get value() {
        return this.value_
    }
}
export class Photo {
    constructor(
        public value_: string,
        public id_?: String,
    ) {}

    get value() {return this.value_}
}

export class MusicInterest {
    constructor(
        public artistName_: string,
        public albumName_: string,
        public id_: string,
    ) {}

    get artistName() {return this.artistName_}
    get albumName() {return this.albumName_}
    get id() {return this.id_}
}

export class User {
    constructor(
        public id_: string | null,
        public username_: String,
        public birth_: Date,
        public phoneNumber_: number,
        public yearsOld_: number | null,
        public musicInterest_: MusicInterest,
        public FCMPushNotificationsToken_: string,
        public hasSeenWhoLikesMeToday_?: Boolean, // always at 12pm resets to false
        public university_?: Univeristy,
        public course_?: Course,
        public langToLearn_?: Language[],
        public langKnown_?: Language[],
        public photos_?: Photo[],
        public team_?: UserTeam,
        public city_?: City,
        public likedUsers_?: User[] | String[],
        public matches_?: User[] | String[],
        public profileDescription_?: string,
        public country_?: Country | null,
    ) {}

    get id() {return this.id_};
    get username() {return this.username_};
    get yearsOld() {return this.yearsOld_};
    get birth() {return this.birth_};
    get phoneNumber() {return this.phoneNumber_};
    get hasSeenWhoLikesMeToday() {return this.hasSeenWhoLikesMeToday_};
    get university() {return this.university_};
    get course() {return this.course_};
    get langToLearn() {return this.langToLearn_};
    get langKnown() {return this.langKnown_};
    get photos() {return this.photos_};
    get team() {return this.team_};
    get city() {return this.city_};
    get likedUsers() {return this.likedUsers_};
    get matches() {return this.matches_};
    get profileDescription() {return this.profileDescription_};
    get FCMPushNotificationsToken() {return this.FCMPushNotificationsToken_};
    get musicInterest() {return this.musicInterest_};
}

export interface CreateUserDTO {
    username: string;
    birth: string; //DDMMYYYY
    phoneNumber: number;
    university: string; //id
    course: string; //id
    langToLearn: string[]; //language code
    langKnown: string[]; //language code
    photos: string[]; // base64 value
    team: number; //id
    country: number; //id
}
