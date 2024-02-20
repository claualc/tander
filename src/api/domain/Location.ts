
export class Country {
    constructor(
        private name_: string,
        private code_: string,
        private nationality_: string,
        private id_?: string,
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
        private name_: string,
        private country_: Country | undefined,
        private id_?: string,
    ) {}

    get country() {
        return this.country_
    }

    get name() {
        return this.name_
    }
}
  
