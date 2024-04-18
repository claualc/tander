import { FormsPage, inputTypes } from "@components/forms/components/formDTOs";
import { ResgisterFormPageId, registerQuestions } from "@screens/register/components/RegisterForms";

export enum ProfileFormPageId {
    /*
        The enum order determines too 
        the order of the pages
    */
    NONE, // default 0 value
    PHOTOS,
    PHONE_NUM_INPUT,
    STUDENT_INFO,
    LANG_TO_LEARN_INFO,
    LANG_TO_KNOW_INFO,
    MORE_ABOUT_USER // BIO + MUSIC INTEREST
}

export const profileOptions: () => {
    pages: {
       [key: number]: FormsPage
    },
} = () => {
    /*
        This forms extend the registration forms adding new inputs to it
    */
    const {pages: resgiterQuestions} = registerQuestions();

    let pages: {
        [key: number]: FormsPage
    } = {
        [ProfileFormPageId.PHOTOS]: {
            ...resgiterQuestions[ResgisterFormPageId.PHOTOS]
        },
        [ProfileFormPageId.PHONE_NUM_INPUT]: {
            ...resgiterQuestions[ResgisterFormPageId.PHONE_NUM_INPUT]
        },
        [ProfileFormPageId.STUDENT_INFO]: {
            ...resgiterQuestions[ResgisterFormPageId.STUDENT_INFO]
        },
        [ProfileFormPageId.LANG_TO_KNOW_INFO]: {
            title: "What languages you want to learn?",
            subtitle: "We will try to connect you with people that know the languages you want to learn, but feel free to talk with whoever you want!",
            questions: [
                resgiterQuestions[ResgisterFormPageId.COUNTRY_INFO].questions[1]
            ]
        }, 
        [ProfileFormPageId.LANG_TO_LEARN_INFO]: {
            ...resgiterQuestions[ResgisterFormPageId.LANG_TO_LEARN_INFO]
        },
        [ProfileFormPageId.MORE_ABOUT_USER]: {
            title: "Let us know more about you!",
            subtitle: "You have 50 characters to tell us a little bit more about you and let us know you better!",
            allFieldsRequired: false,
            questions: [{
                id: 100,
                placeholder: "A little about me",
                inputType: inputTypes.TEXT,
                name: "bio",
                maxCharacters: 50
            },
            {
                id: 101,
                name: "musicInterest",
                description: "Choose also a song that is always on repeat on your playlists!",
                descriptionOnTop: true,
                inputType: inputTypes.MUSIC_ASYNC_SELECT,
            }]
        }
    }

    return {
        pages,
    };

}