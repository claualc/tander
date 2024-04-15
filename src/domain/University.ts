
export class Univeristy {
    constructor(
        private name_: string,
        private informalName_: string,
        private id_: string,
    ) {}

    get name() {return this.name_};
    get informalName() {return this.informalName_};
    get id() {return this.id_};
}
  
export class Course {
    constructor(
        private name_: string,
        private id_: number,
    ) {}

    get name() {return this.name_};
    get id() {return this.id_};
}


  


