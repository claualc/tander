import { Album } from "@api/domain/Album";
import axios, { AxiosError, AxiosResponse } from "axios";

const albumAPI = axios.create({
    baseURL: 'http://ws.audioscrobbler.com/2.0/',
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

const defaultParams = {
    api_key: process.env.EXPO_PUBLIC_LASTFM_API_KEY,
    format: "json"
}


export const getAlbum = async (albumName: string, artistBName: string) => {
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
        console.log("ERROR albumAPI.getAlbum", e)
        throw new Error("..:: AlbumService.getAlbum: Something went wrong");
    }
   
}

const get1DArray = (arr: string[]) => {
    return arr.join().split(",");
}


export const searchArtists = async () => {
    try {
        
        const pages = [1,2,3,4,5,6,7,8,9,10,11,12]; //load top artists of 5 different pages
        const search = pages.map(async (p) => {
                
                const req = await albumAPI.get(
                "", {
                params: {
                    ...defaultParams,
                    method: "chart.gettopartists",
                    autocorrect: 1,
                }})
                return req.data.artists.artist.map((a:any) => a.name)
            })
        
        const artistsRes = await Promise.all(search)
        const artistArr = get1DArray(artistsRes)
        console.log(" ..::ALbumService.searchArtists", artistArr.length, "artists found")
        return artistArr;
    } catch(e: any) {
        console.log("ERROR albumAPI.getAlbum", e)
        throw new Error("..:: AlbumService.searchArtists: Something went wrong");
    }
   
}