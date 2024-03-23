import { SelectOption } from "@components/select";
import { cellphoneMask, validateDate, validatePhoneNumber } from "./utils";

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

export interface Page {
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

    // for multiselect and select input types
    options?: SelectOption[];
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

    let page: Page[] = [{
            title: "Can we have your number?",
            subtitle: "Don’t worry, we just need a way to identificate you in case you are disconnected from this or other devices!",
            questions:  [{
                id: 0,
                inputType: NUMERIC_PHONE,
                validate: validatePhoneNumber
            }]
        },
        {
            title: "Inform the code you received",
            subtitle: `If your number is not ${cellphoneMask(phoneNumber)}, return to the previous screen.`,
            questions: [{
                id: 1,
                inputType: NUMERIC,
                maxCodeLength: 4,
                validate: (v: string) => {return v.split("").length == 4}
            }]
        },
        {
            title: "What’s your name?",
            questions: [{
                id: 2,
                placeholder: "Input your name",
                description: "This is how your name will appear on your profile. Remember that as everything you do in college, it will be with you forever!",
                inputType: TEXT}
            ],
        },
        {
            title: "How old are you?",
            questions: [{
                id: 3,
                description: "We will show just your age on your profile, not your birthday.",
                inputType: DATE,
                validate: validateDate
            }],
        },
        {
            title: "Let us know what you study",
            questions: [{
                    id: 4,
                    placeholder: "Choose your university",
                    inputType: SELECT,
                    options: [{
                        value: 1,
                        name: "d"
                    },
                    {
                        value: 2,
                        name: "e"
                    },
                    {
                        value: 3,
                        name: "f"
                    }
                    ]
                }, 
                {
                    id: 5,
                    placeholder: "Choose your course",
                    inputType: SELECT,
                    options: [{
                        value: 1,
                        name: "d"
                    },
                    {
                        value: 2,
                        name: "e"
                    },
                    {
                        value: 3,
                        name: "f"
                    }
                    ]
                }],
        },
        {
            title: "Where are you from?",
            questions: [{
                id: 6,
                description: "First your nationality",
                descriptionOnTop: true,
                placeholder: "Choose a country",
                inputType: SELECT,
                options: [{
                    value: 1,
                    name: "d"
                },
                {
                    value: 2,
                    name: "e"
                },
                {
                    value: 3,
                    name: "f"
                }
                ]
            }, 
            {
                id: 7,
                description: "Now, the languages you know",
                descriptionOnTop: true,
                multiPlaceholder: [
                    "Choose your first language",
                    "Choose other languages"
                ],
                inputType: MULTISELECT,
                options: [{
                    value: 1,
                    name: "d"
                },
                {
                    value: 2,
                    name: "e"
                },
                {
                    value: 3,
                    name: "f"
                }
                ]
            }],
        },
        {
            title: "What languages you want to learn?",
            subtitle: "We will try to connect you with people that know the languages you want to learn, but feel free to talk with whoever you want!",
            questions: [{
                id: 8,
                multiPlaceholder: [
                    "Choose a language", // the first placeholder can be different from the rest
                    "Choose other language", 
                ],
                descriptionOnTop: true,
                inputType: MULTISELECT,
                options: [{
                    value: 1,
                    name: "d"
                },
                {
                    value: 2,
                    name: "e"
                },
                {
                    value: 3,
                    name: "f"
                }
                ]
            }]
        },
        {
            title: "What is your team?",
            subtitle: "We’re almost there, this is the most important question of the registration. Pay attention, this choice is definitive!",
            questions: [
                {
                    id: 9,
                    inputType: BULLETPOINTS_SELECT,
                    bulletPoints: [
                        {
                            title: "Spritz",
                            description: "I like going out for an aperitivo, a drink and small talk.",
                            emoji: "🍹"
                        },
                        {
                            title: "Negroni",
                            description: "I am the life of the party, all night, every night!",
                            emoji: "🍸"
                        },
                        {
                            title: "Wine",
                            description: "I am an old soul, i like a good dinner at home with a few friends.",
                            emoji: "🍷"
                        },
                        {
                            title: "Water",
                            description: "I am fine, thank you!",
                            emoji: "🫗"
                        },
                        {
                            title: "Frizzante",
                            description: "I am not fine in the least, thank you!",
                            emoji: "🫧"
                        }
                    ]
                }
            ]
        },
        {
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