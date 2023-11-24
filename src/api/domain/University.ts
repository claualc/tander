
export class Univeristy {
    constructor(
        private name: String,
        private id?: String,
    ) {}
}
  
export class Course {
    constructor(
        private name: String,
        private id?: String,
        private university?: Univeristy,
    ) {}
}
  


