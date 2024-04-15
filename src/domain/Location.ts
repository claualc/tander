
export class Country {
    constructor(
        private name_: string,
        private flag_code_: string,
        private nationality_: string,
        private id_: string,
    ) {}

    get id() {
        return this.id_
    }

    get name() {
        return this.name_
    }
    get flag_code() {
        return this.flag_code_
    }
    get nationality() {
        return this.nationality_
    }
}

export class City {
    constructor(
        private name_: string,
        private country_: Country,
        private id_: string,
    ) {}

    get id() {
        return this.id_
    }

    get country() {
        return this.country_
    }

    get name() {
        return this.name_
    }
}
  
