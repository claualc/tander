
export class Country {
    constructor(
        private name: String,
        private id?: String,
    ) {}
}

export class City {
    constructor(
        private name: String,
        private country: Country | String | null,
        private id?: String,
    ) {}


    getCountry() {
        return this.country
    }
}
  
