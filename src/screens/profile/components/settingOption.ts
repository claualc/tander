import { User } from "@api/domain/User";
import { Page, PageId, inputTypes, setQuestions } from "@screens/register/components/Questions";


/*
    Which values the user is able to modify
*/

export interface settingOption extends Page {
    user_attibute: keyof User | (keyof User)[],
}

const {page: resgiterQuestions, languages: langOpt} = setQuestions();

export const settingOptions: {
    [key: number]: settingOption
} = {
    [PageId.PHOTOS]: {
        user_attibute: "photos",
        ...resgiterQuestions[PageId.PHOTOS]
    },
    [PageId.PHONE_NUM_INPUT]: {
        user_attibute: "phoneNumber",
        ...resgiterQuestions[PageId.PHONE_NUM_INPUT]
    },
    [PageId.STUDENT_INFO]: {
        user_attibute: ["university", "course"],
        ...resgiterQuestions[PageId.STUDENT_INFO]
    },
    [PageId.LANG_TO_KNOW_INFO]: {
        user_attibute: "langKnown",
        id: PageId.LANG_TO_KNOW_INFO,
        title: "What languages you want to learn?",
        subtitle: "We will try to connect you with people that know the languages you want to learn, but feel free to talk with whoever you want!",
        questions: [{
            id: 8,
            maxSelects: 4,
            multiPlaceholder: [
                "Choose a language", // the first placeholder can be different from the rest
                "Choose other language", 
            ],
            descriptionOnTop: true,
            inputType: inputTypes.MULTISELECT,
            options: langOpt
        }]
    }, 
    [PageId.LANG_TO_LEARN_INFO]: {
        user_attibute: "langToLearn",
        ...resgiterQuestions[PageId.LANG_TO_LEARN_INFO]
    },
    [PageId.MUSIC_INTEREST]: {
        user_attibute: "musicInterest",
        id: PageId.LANG_TO_KNOW_INFO,
        title: "Let us know more about you!",
        subtitle: "You have 200 characters to tell us a little bit more about you and let us know you better!",
        questions: [{
            id: 100,
            placeholder: "A little about me",
            inputType: inputTypes.TEXT,
        },
        {
            id: 101,
            maxSelects: 4,
            description: "Choose also a song that is always on repeat on your playlists!",
            descriptionOnTop: true,
            placeholder: "Search a song",
            inputType: inputTypes.SELECT_ASYNC_VALUE,
        }
    ]
    }
}