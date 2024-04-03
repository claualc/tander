import { SelectOption } from "@components/select";

export enum inputTypes {
    TEXT,  //also used for cellphone number
    NUMERIC, 
    DATE, 
    SELECT,  // with a select element, single answer
    MULTISELECT,  // with a select element, multiples answers
    BULLETPOINTS_SELECT,  // options are alerady presented
    PHOTO,  // options are alerady presented
    NUMERIC_PHONE, 

    // not used in registration, but in profile managment
    MUSIC_ASYNC_SELECT, 
}

export interface FormsPage {
    title: string;
    subtitle?: string;
    questions: FormsQuestion[];
    allFieldsRequired?: boolean; // default is true
}

export interface FormsQuestion {
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

    // for text input types
    maxCharacters?: number;

    // for async select input types
    includeSearchBar?: boolean;

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
