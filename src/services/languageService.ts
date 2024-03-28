import { Language } from "@api/domain/Language";

import languageDic from "@dict/languages";

export const languageParser = (lang: typeof languageDic[0], id: string | number) => {
    return new Language(
        lang.name,
        id as string,
        lang.language_code);
}

const getById =  (id: string | number) => {
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