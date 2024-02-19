import { Album } from "@api/domain/Album";
import axios, { AxiosError, AxiosResponse } from "axios";

const albumAPI = axios.create({
    baseURL: 'http://ws.audioscrobbler.com/2.0/',
    // headers: {
    //     "Content-Type": "application/json",
    // },
    // params: {
    //     api_key: process.env.EXPO_PUBLIC_LASTFM_API_KEY,
    //     format: "json"
    // }
});

export const getAlbum = async (albumName: string, artistBName: string) => {
    try {

        const res: AxiosResponse = await albumAPI.get(
            "",
            {
                params: {
                    method: "album.getinfo",
                    artist: artistBName,
                    album: albumName,
                    autocorrect: 1,
                    api_key: process.env.EXPO_PUBLIC_LASTFM_API_KEY,
                    format: "json"
                }
            }
        );

        const { image, artist :artistNameCorrected, name: albumNameCorrected } = res.data.album;
        const albumData = new Album(albumNameCorrected, image[image.length-2]["#text"], artistNameCorrected);
        return albumData;

    } catch(e: any) {
        console.log("ERROR albumAPI.getAlbum", e)
        throw new Error("Something went wrong");
    }
   
}