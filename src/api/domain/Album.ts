
export class Album {

    private name_: string;
    private imageUrl_: string;
    private artist_: Artist;

    constructor(
        name: string,
        imageUrl: string,
        artistName: string,
    ) {

        this.name_ = name;
        this.imageUrl_ = imageUrl;
        this.artist_ = new Artist(artistName);
    }

    get name() {return this.name_};
    get imageUrl() {return this.imageUrl_};
    get artist() {return this.artist_};
    get artistName() {return this.artist_.name};
}
  
export class Artist {
    constructor(
        private name_: string,
    ) {}

    get name() {return this.name_};
}


  


