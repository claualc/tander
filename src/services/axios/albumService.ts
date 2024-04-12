import { Album } from "@api/domain/Album";
import axios, { AxiosResponse } from "axios";

const albumAPI = axios.create({
    baseURL: 'http://ws.audioscrobbler.com/2.0/',
});

const defaultParams = {
    api_key: process.env.EXPO_PUBLIC_LASTFM_API_KEY,
    format: "json"
}

const getAlbum = async (albumName: string, artistBName: string) => {
    try {

        const res: AxiosResponse = await albumAPI.get(
            "",
            {
                params: {
                    ...defaultParams,
                    method: "album.getinfo",
                    artist: artistBName,
                    album: albumName,
                    autocorrect: 1,
                }
            }
        );

        const { image, artist :artistNameCorrected, name: albumNameCorrected } = res.data.album;
        const albumData = new Album(albumNameCorrected, image[image.length-2]["#text"], artistNameCorrected);
        return albumData;

    } catch(e: any) {
        console.log("ERROR albumAPI", e)
        throw new Error("..:: AlbumService.getAlbum: Something went wrong");
    }
   
}

const get1DArray = (arr: string[]) => {
    return arr.join().split(",");
}

const searchArtists = async () => {
    try {
        
        const pages = [1,2,3,4,5,6,7,8,9, 10, 11,12,13,14,15,16,17,18,19,20]; //load top artists of 5 different pages
        const search = pages.map(async (p) => {
                
                const req = await albumAPI.get(
                "", {
                params: {
                    ...defaultParams,
                    method: "chart.gettopartists",
                    autocorrect: 1,
                    page: p
                }})
                return req.data.artists.artist.map((a:any) => a.name)
            })
        
        const artistsRes = await Promise.all(search)
        const artistArr: string[] = get1DArray(artistsRes)
        console.log(" ..:: AlbumService.searchArtists", artistArr.length, "artists found")

        return artistArr;
    } catch(e: any) {
        console.log("ERROR albumAPI", e)
        throw new Error("..:: AlbumService.searchArtists: Something went wrong");
    }
}

const getArtistTopTracks = async (artistName: string) => {
    try {
        
        let topTracks : Album[] = [];
        const req = await albumAPI.get(
            "", {
            params: {
                ...defaultParams,
                method: "artist.gettopalbums",
                autocorrect: 1,
                artist: artistName
        }})

        const array = req.data?.topalbums?.album
        topTracks = array?.length ? array.filter((e: any) => e.image[e.image.length-2]["#text"]).map((e: any) => {
            return new Album(
                e.name, e.image[e.image?.length-2]["#text"], artistName
            )
        }) : []

        console.log("..:: AlbumService.getArtistTopTracks", topTracks.length, "records of", artistName)
        return topTracks
        
    } catch(e: any) {
        console.log("ERROR albumAPI", e)
        throw new Error("..:: AlbumService.getArtistTopTracks: Something went wrong");
    }
}

export default {
    getArtistTopTracks,
    searchArtists,
    getAlbum
}