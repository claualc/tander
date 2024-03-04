import { SelectOption } from "@components/select";


export const TEXT = 0; //also used for cellphone number
export const NUMERIC = 1;
export const DATE = 2;
export const SELECT = 3; // with a select element, single answer
export const MULTISELECT = 4; // with a select element, multiples answers
export const BULLETPOINTS_SELECT = 5; // options are alerady presented
export const PHOTO = 6; // options are alerady presented

type inputTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Page {
    title: string;
    subtitle?: string;
    questions: Question[]
}

export interface Question {
    id: number;
    placeholder?: string; // the array is in the case of multiple selects
    multiPlaceholder?: string[]; // multiselect
    description?: string
        | string[] ; // the array is in the case of multiple selects
    /*
    descriptionOnTop: normally under the input
    in some cases, such as multiselect,
    it is used on top of the input component
     */
    descriptionOnTop?: boolean; 
    inputType: inputTypes;
    /*
    bulletPoints: options of selections
    for a bulletPoint type 
     */
    selectCount?: number;
    selectModalTitle?: string;
    bulletPoints?: {
        description: string;
        title: string;
        emoji: string;
    }[]; 
    options?: SelectOption[]; // used in select and multiselect
}

// each index of the array is one page
// of the resgiter forms
// each page can have more than one question
export const questions: Page[]  = [
    {
        title: "Can we have your number?",
        subtitle: "Don’t worry, we just need a way to identificate you in case you are disconnected from this or other devices!",
        questions:  [{
            id: 0,
            inputType: NUMERIC
        }]
    },
    {
        title: "Inform the code you received",
        subtitle: "If your number is not +39 351 9401586, return to the previous screen.",
        questions: [{
            id: 1,
            inputType: NUMERIC
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
            inputType: DATE
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
                        description: "Mi piace uscire per fare l’aperitivo, bere un drink e chiacchierare",
                        emoji: ""
                    },
                    {
                        title: "Negroni",
                        description: "Sono l’anima della festa. Esco alle 23h e ritorno appena alle 6h!",
                        emoji: ""
                    },
                    {
                        title: "Vino",
                        description: "Ho l’anima vecchia, preferisco una buona cena a casa con alcuni amici",
                        emoji: ""
                }]
            }
        ]
    },
    {
        title: "Show us some pictures",
        subtitle: "Preferably of your face...",
        questions:[
            {
                id: 10,
                inputType: PHOTO
            },{
                id: 11,
                inputType: PHOTO
            },{
                id: 12,
                inputType: PHOTO
            },{
                id: 13,
                inputType: PHOTO
            }
        ]
    },
]