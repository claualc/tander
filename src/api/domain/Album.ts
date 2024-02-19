
export class Album {

    private name_: string;
    private image_url_: string;
    private artist_: Artist;

    constructor(
        name: string,
        image_url: string,
        artist_name: string,
    ) {

        this.name_ = name;
        this.image_url_ = image_url;
        this.artist_ = new Artist(artist_name);
    }

    get name() {return this.name_};
    get image_url() {return this.image_url_};
    get artist() {return this.artist_};
}
  
export class Artist {
    constructor(
        private name_: string,
    ) {}

    get name() {return this.name_};
}


  


