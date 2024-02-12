import { Language } from "./Language";
import { City } from "./Location";
import { Univeristy, Course} from "./University";

export class UserTeam {
    constructor(
        public value_: String, //spritz/negroni/vino/aqcua/frizzante
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

export class User {
    constructor(
        public id_: String | null,
        public username_: String,
        public birth_: Date,
        public yearsOld_: number,
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
    ) {}

    get id() {return this.id_};
    get username() {return this.username_};
    get yearsOld() {return this.yearsOld_};
    get birth() {return this.birth_};
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
}
  