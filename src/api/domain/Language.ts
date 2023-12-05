
export class Language {
    constructor(
        private name_: String,
        private id_?: String,
    ) {}

    get name() {
        return this.name_;
    }
}
