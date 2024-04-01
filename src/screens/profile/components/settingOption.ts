import { FormsPage, inputTypes } from "@components/forms/components/formDTOs";
import { ResgisterFormPageId, registerQuestions } from "@screens/register/components/RegisterForms";
import { User } from "@api/domain/User";
import languageService from "@serv/languageService";
import { SelectOption } from "@components/select";

import * as albumservice from "@serv/albumService";

/*
    Which values the user is able to modify
*/

export interface AttrFormsPage extends FormsPage {
    user_attibute: keyof User | (keyof User)[];
}

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
       [key: number]: AttrFormsPage
    },
} = () => {

    /*
        This forms extend the registration forms
        adding new inputs to it
        (but not allowing ot eadit all of the 
            inputs of the registration)
    */
    const {pages: resgiterQuestions} = registerQuestions();
    
    let languages =  languageService.listAll().map(l => ({
        "name": l.name,
        "value": l.id
    }) as SelectOption)

    let pages: {
        [key: number]: AttrFormsPage
    } = {
        [ProfileFormPageId.PHOTOS]: {
            user_attibute: "photos",
            ...resgiterQuestions[ResgisterFormPageId.PHOTOS]
        },
        [ProfileFormPageId.PHONE_NUM_INPUT]: {
            user_attibute: "phoneNumber",
            ...resgiterQuestions[ResgisterFormPageId.PHONE_NUM_INPUT]
        },
        [ProfileFormPageId.STUDENT_INFO]: {
            user_attibute: ["university", "course"],
            ...resgiterQuestions[ResgisterFormPageId.STUDENT_INFO]
        },
        [ProfileFormPageId.LANG_TO_KNOW_INFO]: {
            user_attibute: "langKnown",
            title: "What languages you want to learn?",
            subtitle: "We will try to connect you with people that know the languages you want to learn, but feel free to talk with whoever you want!",
            questions: [{
                id: 800,
                maxSelects: 4,
                multiPlaceholder: [
                    "Choose a language", // the first placeholder can be different from the rest
                    "Choose other language", 
                ],
                descriptionOnTop: true,
                inputType: inputTypes.MULTISELECT,
                options: languages
            }]
        }, 
        [ProfileFormPageId.LANG_TO_LEARN_INFO]: {
            user_attibute: "langToLearn",
            ...resgiterQuestions[ResgisterFormPageId.LANG_TO_LEARN_INFO]
        },
        [ProfileFormPageId.MORE_ABOUT_USER]: {
            user_attibute: "musicInterest",
            title: "Let us know more about you!",
            subtitle: "You have 200 characters to tell us a little bit more about you and let us know you better!",
            questions: [{
                id: 100,
                placeholder: "A little about me",
                inputType: inputTypes.TEXT,
                maxCharacters: 100
            },
            {
                id: 101,
                maxSelects: 4,
                description: "Choose also a song that is always on repeat on your playlists!",
                descriptionOnTop: true,
                placeholder: "Search a song",
                inputType: inputTypes.ASYNC_SELECT,
                searchOptions: async (v: string) => {
                    let artistNames = await albumservice.searchArtists()
                    return artistNames.map((a,i) => ({
                        name: a, value: a
                    } as SelectOption))
                }
            }]
        }
    }

    return {
        pages,
    };

}