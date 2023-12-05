
export class Country {
    constructor(
        private name_: String,
        private id?: String,
    ) {}

    get name() {
        return this.name_
    }
}

export class City {
    constructor(
        private name_: String,
        private country_: Country,
        private id_?: String,
    ) {}

    get country() {
        return this.country_
    }

    get name() {
        return this.name_
    }
}
  
