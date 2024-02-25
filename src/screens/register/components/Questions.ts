

export const TEXT = 0; //also used for cellphone number
export const NUMERIC = 1;
export const DATE = 2;
export const SELECT = 3; // with a select element, single answer
export const MULTISELECT = 4; // with a select element, multiples answers
export const BULLETPOINTS_SELECT = 5; // options are alerady presented
export const PHOTO = 6; // options are alerady presented

type inputTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Question {
    title: string;
    subtitle?: string;
    placeholder?: string
        | string[] ; // the array is in the case of multiple selects
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
    bulletPoints?: {
        description: string;
        title: string;
        emoji: string;
    }[]; 
}

export const questions: Question[]  = [
    {
        title: "Puoi darci il tuo numero?",
        subtitle: "Non preoccuparti, vorremo appena un modo di ricordarti in caso tu sia disconnesso di questo dispositivo!",
        inputType: NUMERIC
    },
    {
        title: "Inserisci il codice cheabbiamo ti inviato",
        subtitle: "Se il tuo numero non è +39 351 9401586, ritorna al schermo anteriore",
        inputType: NUMERIC
    },
    {
        title: "Come ti chiami?",
        placeholder: "Inserisci il tuo nome",
        description: "Così è come aparirà sul tuo profilo. Ricordati che come tutto che hai fatto nell’università, rimanerà con te per sempre!",
        inputType: TEXT
    },
    {
        title: "Quando sei natƏ?",
        description: "Sul tuo profilo informeremmo appena la tua età, non la tua data di nascità.",
        inputType: DATE
    },
    {
        title: "Facci sapere che cosa studi",
        placeholder: [
            "Scegli la tua università",
            "Scegli il tuo corso"
        ],
        inputType: SELECT
    },
    {
        title: "Da dove vieni?",
        description: [
            "Prima la tua nazionalità",
            "Adesso, la tua madrelingua"
        ],
        placeholder: [
            "Scegli un paese",
            "Scegli la tua madrelingua"
        ],
        descriptionOnTop: true,
        inputType: MULTISELECT
    },
    {
        title: "Che lingue vuoi imparare a Milano?",
        subtitle: "Proveremmo di ti connettare con persone che parlono le lingue che vuoi imparare, ma sentiti libero per parlare con chi vuoi!",
        placeholder: [
            "Scegli una lingua",
        ],
        descriptionOnTop: true,
        inputType: MULTISELECT
    },
    {
        title: "Qual’è il tuo team?",
        subtitle: "Stiamo finendo, questa è la domanda più importante di questa registrazione. Fai attenzione, la scelta è definitiva!",
        descriptionOnTop: true,
        inputType: MULTISELECT,
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

            }
        ]
    },
    {
        title: "Aggiungi alcune foto recente",
        subtitle: "Preferibilmente della tua faccia...",
        inputType: PHOTO
    },

]