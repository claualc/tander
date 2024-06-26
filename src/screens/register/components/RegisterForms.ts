import { SelectOption } from "@components/selects/select";
import { validateDate, validatePhoneNumber } from "@components/utils";
import locationService from "@serv/locationServices";
import languageService from "@serv/languageService";
import studentService from "@serv/studenService";
import { checkUserPhoneNotInUse, listAllUserTeam } from "@serv/userService";
import { FormsPage, FormsQuestion, inputTypes } from "@components/forms/components/formDTOs";
import authService from "@serv/authService";

/*

######
# This file contains all  the static and dynamic (variables)
# information to add questions to the resgistration forms.

# as an example of static are the titles and descriptions
# as an example of dynamic are the variables lists of the selects,
#  such as the list of countries.
######

*/

export enum ResgisterFormPageId {
/*
    The enum order determines too 
    the order of the pages
*/
    PHONE_NUM_INPUT,
    // PHONE_NUM_CODE_VERIF,
    USERNAME,
    AGE,
    STUDENT_INFO,
    COUNTRY_INFO, // langKnown + country
    LANG_TO_LEARN_INFO,
    TEAM,
    PHOTOS,
    PASSWORD,
}

export const formsCheckIfValidValue = (v: any, q: FormsQuestion) => {
    return q.validate ? q.validate(v) : v!=null }

// each index of the array is one page
// of the resgiter forms
// each page can have more than one question
export const registerQuestions: (phoneNumber?: string) => {
    pages: {
        [key: number]: FormsPage
    },
}  = (phoneNumber) => {
    
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

    let pages: {
        [key: number]: FormsPage
    } = {
        [ResgisterFormPageId.PHONE_NUM_INPUT]: {
            title: "Can we have your number?",
            subtitle: "Don’t worry, we just need a way to identificate you in case you are disconnected from this or other devices!",
            questions:  [{
                id: 0,
                name: "phoneNumber",
                inputType: inputTypes.NUMERIC_PHONE,
                validate: validatePhoneNumber,
                validateOnSend: checkUserPhoneNotInUse
            }]
        },
        [ResgisterFormPageId.USERNAME]: {
            title: "What’s your name?",
            questions: [{
                id: 2,
                name: "username",
                placeholder: "Input your name",
                description: "This is how your name will appear on your profile. Remember that as everything you do in college, it will be with you forever!",
                inputType: inputTypes.TEXT,
                validate: (v: string) => {
                    var pattern = /\d/;
                    return !pattern.test(v)
                }
                }
            ],
        },
        [ResgisterFormPageId.AGE]: {
            title: "How old are you?",
            questions: [{
                id: 3,
                name: "birth",
                description: "We will show just your age on your profile, not your birthday.",
                inputType: inputTypes.DATE,
                validate: validateDate
            }],
        },
        [ResgisterFormPageId.STUDENT_INFO]: {
            title: "Let us know what you study",
            questions: [{
                    id: 4,
                    placeholder: "Choose your university",
                    inputType: inputTypes.SELECT,
                    name: "university",
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
                    name: "course",
                    inputType: inputTypes.SELECT,
                    includeSearchBar: true,
                    options: studentService
                        .listAllCourse()
                        .map(c => ({
                            "name": c.name,
                            "value": c.id
                        }) as SelectOption)
                    },
            ],
        },
        [ResgisterFormPageId.COUNTRY_INFO]: {
            title: "Where are you from?",
            questions: [{
                id: 6,
                description: "First your nationality",
                name: "country",
                descriptionOnTop: true,
                placeholder: "Choose a country",
                inputType: inputTypes.SELECT,
                includeSearchBar: true,
                options: countries
            }, 
            {
                id: 7,
                description: "Now, the languages you know",
                name: "langKnown",
                descriptionOnTop: true,
                maxSelects: 4,
                multiPlaceholder: [
                    "Choose your first language",
                    "Choose other language"
                ],
                inputType: inputTypes.MULTISELECT,
                includeSearchBar: true,
                options: languages
            }],
        },
        [ResgisterFormPageId.LANG_TO_LEARN_INFO]: {
            title: "What languages you want to learn?",
            subtitle: "We will try to connect you with people that know the languages you want to learn, but feel free to talk with whoever you want!",
            questions: [{
                id: 8,
                maxSelects: 4,
                name: "langToLearn",
                multiPlaceholder: [
                    "Choose a language", // the first placeholder can be different from the rest
                    "Choose other language", 
                ],
                descriptionOnTop: true,
                inputType: inputTypes.MULTISELECT,
                includeSearchBar: true,
                options: languages
            }]
        },
        [ResgisterFormPageId.TEAM]: {
            title: "What is your team?",
            subtitle: "We’re almost there, this is the most important question of the registration. Pay attention, this choice is definitive!",
            questions: [
                {
                    id: 9,
                    inputType: inputTypes.BULLETPOINTS_SELECT,
                    name: "team",
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
        [ResgisterFormPageId.PHOTOS]: {
            title: "Show us some pictures",
            subtitle: "Preferably of your face...",
            questions: [
                {
                    id: 10,
                    name: "photos",
                    inputType: inputTypes.PHOTO,
                    photoCount: 4
                }
            ]
        },
        [ResgisterFormPageId.PASSWORD]: {
            title: "Last Step!",
            subtitle: "8 characters at least please...",
            questions:  [{
              id: 0,
              inputType: inputTypes.TEXT,
              name: "password",
              validate: authService.validatePassword,
              placeholder: "Password",
              maxCharacters: 8,
              hideText: true
            }]
        },
    }

    return {
        pages,
    };
}