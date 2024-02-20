
export class Language {

    constructor(
        private name_: string,
        private id_: string,
        private language_code_: string
    ){}

    get name() { return this.name_; }

    get id() { return this.id_; }

    get language_code() { return this.language_code_; }
}
