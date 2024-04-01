import { Language } from "./Language";
import { Country } from "./Location";
import { Univeristy, Course} from "./University";

export class UserTeam {
    constructor(
        public id_: number,
        public name_: string, //1 spritz/2 negroni/3 vino/4 aqcua/5 frizzante
        public icon_: string
    ) {}

    get name() { return this.name_}
    get icon() { return this.icon_}
    get id() { return this.id_}
}
export class Photo {
    constructor(
        public value_: string,
        public id_: String,
    ) {}

    get value() {return this.value_}
    get id() {return this.id_}
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

    public id_: string | null;
    public username_: string;
    public birth_: Date;
    public phoneNumber_: number;
    public yearsOld_: number | null;
    public FCMPushNotificationsToken_: string;
    public country_: Country;
    public university_: Univeristy;
    public course_: Course;
    public langToLearn_: Language[];
    public langKnown_: Language[];
    public team_: UserTeam;

    public hasSeenWhoLikesMeToday_?: Boolean; // always at 12pm resets to false
    public photos_: Photo[];
    // public city_?: City;
    public likedUsers_?: User[] | String[];
    public matches_?: User[] | String[];
    public profileDescription_?: string;
    public musicInterest_?: MusicInterest;
    public bio_?: string; // profile description

    constructor(
        id: string | null, username: string, birth: Date, phoneNumber: number, FCMPushNotificationsToken: string, country: Country, university: Univeristy, course: Course, langToLearn: Language[], langKnown: Language[], team: UserTeam, photos: Photo[], hasSeenWhoLikesMeToday?: Boolean, likedUsers?: User[] | String[], matches?: User[] | String[], profileDescription?: string, musicInterest?: MusicInterest, bio?: string
    ) {
        this.id_ = id;
        this.username_ = username;
        this.birth_ = birth;
        this.yearsOld_ = new Date().getUTCFullYear() - birth.getUTCFullYear();
        this.phoneNumber_ = phoneNumber;
        this.FCMPushNotificationsToken_ = FCMPushNotificationsToken;
        this.country_ = country;
        this.university_ = university;
        this.course_ = course;
        this.langToLearn_ = langToLearn;
        this.langKnown_ = langKnown;
        this.team_ = team;

        // not required
        this.hasSeenWhoLikesMeToday_ = hasSeenWhoLikesMeToday;
        this.photos_ = photos;
        // this.city_ = city;
        this.likedUsers_ = likedUsers;
        this.matches_ = matches;
        this.profileDescription_ = profileDescription;
        this.musicInterest_ = musicInterest;
        this.bio_ = bio;
    }

    // from user
    get id() {return this.id_};
    get username() {return this.username_}; 
    get shortusername() {return this.username_.split(" ")[0]}; 
    get birth() {return this.birth_};
    get yearsOld() {return this.yearsOld_};
    get phoneNumber() {return this.phoneNumber_};
    get FCMPushNotificationsToken() {return this.FCMPushNotificationsToken_};
    get country() {return this.country_};
    get university() {return this.university_};
    get course() {return this.course_};
    get langToLearn() {return this.langToLearn_};
    get langKnown() {return this.langKnown_};
    get team() {return this.team_};
    get photos() {return this.photos_};
    //get city() {return this.city_};
    get hasSeenWhoLikesMeToday() {return this.hasSeenWhoLikesMeToday_};
    get likedUsers() {return this.likedUsers_};
    get matches() {return this.matches_};
    get profileDescription() {return this.profileDescription_};
    get musicInterest() {return this.musicInterest_};
    get bio() {return this.bio_};

    // from attributes
    get countryName() {return this.country.name}
    get countryFlag() {return this.country.flag_code}
    get courseName() {return this.course.name}
    get universityName() {return this.university.informalName}
    get artistInterestName() {return this.musicInterest?.artistName}
    get albumInterestName() {return this.musicInterest?.albumName}
}
