
import { MusicInterest } from "@api/domain/User";
import axiosAlbumService from "./axios/albumService";

export interface MusicInterestDTO {
    albumName: string;
    artistName: string;
    imageUrl?: string;
}

const convertMusicInterectToDTO = (mi: MusicInterest) => {
    return {
        albumName: mi.albumName,
        artistName: mi.artistName,
        imageUrl: mi.imgURL,
    } as MusicInterestDTO
}

const getMusicInterestFromDTO = async (dto: MusicInterestDTO) => {
    return new MusicInterest(
        dto.artistName,dto.albumName,dto.imageUrl
    )
}

export default {
    convertMusicInterectToDTO,
    getMusicInterestFromDTO,
    ...axiosAlbumService
}