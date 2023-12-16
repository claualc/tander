
export class Country {
    constructor(
        private name_: String,
        private code_: String,
        private nationality_: String,
        private id_?: String,
    ) {}

    get name() {
        return this.name_
    }
    get code() {
        return this.code_
    }
    get nationality() {
        return this.nationality_
    }
}

export class City {
    constructor(
        private name_: String,
        private country_: Country | undefined,
        private id_?: String,
    ) {}

    get country() {
        return this.country_
    }

    get name() {
        return this.name_
    }
}
  
