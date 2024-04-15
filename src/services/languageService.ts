import { Language } from "@domain/Language";

import languageDic from "@dict/languages";

export const languageParser = (lang: typeof languageDic[0], id: string) => {
    return new Language(
        lang.name,
        id as string,
        lang.language_code);
}

const getById =  (id: string) => {
    const dto = languageDic[id as string];
    return languageParser(dto, id)
}

const listAll = () => {
    return Object.keys(languageDic).map(getById)
}

const languageService = {
    listAll,
    getById
}

export default languageService;