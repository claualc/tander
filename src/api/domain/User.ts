import { Language } from "./Language";
import { City } from "./Location";
import { Univeristy, Course} from "./University";

export class UserTeam {
    constructor(
        public value: String, //spritz/negroni/vino/aqcua/frizzante
        public id?: String,
    ) {}
}
export class Photo {
    constructor(
        public value: String,
        public id?: String,
    ) {}
}

export class User {
    constructor(
        public id: String | null,
        public username: String,
        public birth: Date,
        public hasSeenWhoLikesMeToday?: Boolean, // always at 12pm resets to false
        public university?: Univeristy,
        public course?: Course,
        public langToLearn?: Language[],
        public langKnown?: Language[],
        public photos?: Photo[],
        public team?: UserTeam,
        public city?: City,
        public likedUsers?: User[] | String[],
        public matches?: User[] | String[],
    ) {}
}
  