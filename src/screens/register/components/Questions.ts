import { SelectOption } from "@components/select";
import { validateDate, validatePhoneNumber } from "@components/utils";
import locationService from "@serv/locationServices";
import languageService from "@serv/languageService";
import studentService from "@serv/studenService";
import { listAllUserTeam } from "@serv/userService";

/*

######
# This file contains all  the static and dynamic (variables)
# information to add questions to the resgistration forms.

# as an example of static are the titles and descriptions
# as an example of dynamic are the variables lists of the selects,
#  such as the list of countries.
######

*/
export const TEXT = 0; //also used for cellphone number
export const NUMERIC = 1;
export const DATE = 2;
export const SELECT = 3; // with a select element, single answer
export const MULTISELECT = 4; // with a select element, multiples answers
export const BULLETPOINTS_SELECT = 5; // options are alerady presented
export const PHOTO = 6; // options are alerady presented
export const NUMERIC_PHONE = 7;


type inputTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum PageId {
    PHONE_NUM_INPUT,
    PHONE_NUM_CODE_VERIF,
    USERNAME,
    AGE,
    STUDENT_INFO,
    COUNTRY_INFO,
    LANG_TO_LEARN_INFO,
    TEAM,
    PHOTOS
}

export interface Page {
    id: PageId;
    title: string;
    subtitle?: string;
    questions: Question[]
}

export interface Question {
    // all questions have the same basic structure
    // but some attributes are specific of an input type

    // general atributes
    id: number;
    placeholder?: string; // the array is in the case of multiple selects
    description?: string | string[] ; // the array is in the case of multiple selects
    descriptionOnTop?: boolean; 
    //descriptionOnTop: normally under the input, used on top of the input component
    inputType: inputTypes;

    // for code input types
    maxCodeLength?: number;

    // for multiselect input type
    multiPlaceholder?: string[]; 
    maxSelects?: number;

    // for multiselect and select input types
    options?: SelectOption[];
    dynamicOptions?: (v: any) => SelectOption[];
    selectModalTitle?: string;

    // for bulletpointSelect input types
    bulletPoints?: {
        description: string;
        title: string;
        emoji: string;
    }[]; 

    validate?: (v: any) => boolean;
    
    // for photo input types
    photoCount?: number;
}

// each index of the array is one page
// of the resgiter forms
// each page can have more than one question
export const setQuestions: (phoneNumber?: string) => Page[]  = (phoneNumber) => {
    
    //closure to customize some of the questions with dynamic variables

    // the index in the array is the id of the userTeam
    const userTeamDescriptions = [
        "I like going out for an aperitivo, a drink and small talk.", 
        "I am the life of the party, all night, every night!",
        "I am an old soul, i like a good dinner at home with a few friends.",
        "I am fine, thank you!",
        "I am not fine in the least, thank you!",
    ]

    let languages =  languageService.listAll().map(l => ({
        "name": l.name,
        "value": l.id
    }) as SelectOption)

    let countries = locationService.listAllCountry().map(c => ({
        "name": `${c.flag_code} ${c.name}`,
        "value": c.id
    }) as SelectOption)

    let page: Page[] = [{
            id: PageId.PHONE_NUM_INPUT,
            title: "Can we have your number?",
            subtitle: "Don’t worry, we just need a way to identificate you in case you are disconnected from this or other devices!",
            questions:  [{
                id: 0,
                inputType: NUMERIC_PHONE,
                validate: validatePhoneNumber
            }]
        },
        // {
        //     id: PageId.PHONE_NUM_CODE_VERIF,
        //     title: "Inform the code you received",
        //     subtitle: `If your number is not ${cellphoneMask(phoneNumber)}, return to the previous screen.`,
        //     questions: [{
        //         id: 1,
        //         inputType: NUMERIC,
        //         maxCodeLength: 4,
        //         validate: (v: string) => {return v.split("").length == 4}
        //     }]
        // },
        {
            id: PageId.USERNAME,
            title: "What’s your name?",
            questions: [{
                id: 2,
                placeholder: "Input your name",
                description: "This is how your name will appear on your profile. Remember that as everything you do in college, it will be with you forever!",
                inputType: TEXT,
                validate: (v: string) => {
                    var pattern = /\d/;
                    return !pattern.test(v)
                }
                }
            ],
        },
        {
            id: PageId.AGE,
            title: "How old are you?",
            questions: [{
                id: 3,
                description: "We will show just your age on your profile, not your birthday.",
                inputType: DATE,
                validate: validateDate
            }],
        },
        {
            id: PageId.STUDENT_INFO,
            title: "Let us know what you study",
            questions: [{
                    id: 4,
                    placeholder: "Choose your university",
                    inputType: SELECT,
                    options: studentService
                        .listAllUniversity()
                        .map(u => ({
                            "name": u.name,
                            "value": u.id
                        }) as SelectOption)
                }, 
                {
                    id: 5,
                    placeholder: "Choose your course",
                    inputType: SELECT,
                    options: studentService
                        .listAllCourse()
                        .map(c => ({
                            "name": c.name,
                            "value": c.id
                        }) as SelectOption)
                    }
            ],
        },
        {
            id: PageId.COUNTRY_INFO,
            title: "Where are you from?",
            questions: [{
                id: 6,
                description: "First your nationality",
                descriptionOnTop: true,
                placeholder: "Choose a country",
                inputType: SELECT,
                options: countries
            }, 
            {
                id: 7,
                description: "Now, the languages you know",
                descriptionOnTop: true,
                maxSelects: 4,
                multiPlaceholder: [
                    "Choose your first language",
                    "Choose other language"
                ],
                inputType: MULTISELECT,
                options: languages
            }],
        },
        {
            id: PageId.LANG_TO_LEARN_INFO,
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
                inputType: MULTISELECT,
                options: languages
            }]
        },
        {
            id: PageId.TEAM,
            title: "What is your team?",
            subtitle: "We’re almost there, this is the most important question of the registration. Pay attention, this choice is definitive!",
            questions: [
                {
                    id: 9,
                    inputType: BULLETPOINTS_SELECT,
                    bulletPoints: listAllUserTeam().map(
                        (team, id) => ({
                            "title": team.name,
                            "description": userTeamDescriptions[id],
                            "emoji": team.icon
                        }),
                    )
                }
            ]
        },
        {
            id: PageId.PHOTOS,
            title: "Show us some pictures",
            subtitle: "Preferably of your face...",
            questions: [
                {
                    id: 10,
                    inputType: PHOTO,
                    photoCount: 4
                }
            ]
        },
    ]

    return page;
}