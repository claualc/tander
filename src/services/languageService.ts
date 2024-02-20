import { Language } from "@api/domain/Language";

import languageDic from "@dict/languages";

export const languageParser = (lang: typeof languageDic[0], id: string | number) => {
    return new Language(
        lang.name,
        id as string,
        lang.language_code);
}

const getById =  (id: string | number) => {
    const langDTO = languageDic[id as string];
    return languageParser(langDTO, id)
}

const listAll = () => {
    return Object.keys(languageDic).map(id => getById(id))
}

const languageService = {
    listAll,
    getById
}

export default languageService;