import { Photo, User } from '@domain/User';
import { generateRandomString } from '@components/utils';
import * as ImagePicker from 'expo-image-picker';
import { DocumentReference } from 'firebase/firestore';

import dbServices from "@firebaseServ/database"

export interface PhotoChunkDTO {
    value: string;
    userRef: DocumentReference;
    index: number;
    logicalPhotoId: string; 
}

const isPhotoArray = (arr: Photo[]) => {
    return arr?.length && arr?.map(item => !!item?.chunkIds && !!item?.id && !!item.value)
}

const pickPhotoFromGallery = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.7,
    base64: true
    });


    if (result.assets?.length && result.assets[0].base64) {
        return new Photo(
            result.assets[0].base64,
            generateRandomString(20),
            "", // chunk ref null
        )
    }

    return null;
}

const COLLECTION_ID = "photo_chunks"; 

const CHUNK_SYMBOL_SEPARATOR = "."

interface createUserPhotoI {
    photo: Photo;
    userRef: DocumentReference;
}

const createUserPhoto = async ({
    photo, userRef
}: createUserPhotoI ) => {

    let {value, id} = photo

    let half = Math.floor(value.length/2)
    let mostSignificatValue = value.slice(0, half)
    let lessSignificatValue = value.slice(half)


    // Most Significat Value
    let MSVdto: PhotoChunkDTO = {
        value: mostSignificatValue,
        userRef,
        logicalPhotoId: id,
        index: 0
    }

    // Less Significat Value
    let LSVdto: PhotoChunkDTO = {
        value: lessSignificatValue,
        userRef,
        logicalPhotoId: id,
        index: 2
    }

    const MSVphotoRef = await dbServices.create(
        COLLECTION_ID, MSVdto )
    const LSVphotoRef = await dbServices.create(
        COLLECTION_ID, LSVdto )
    
    console.log("..:: FirebaseService.createUserPhoto (photo)", id)
    return `${MSVphotoRef?.id}${CHUNK_SYMBOL_SEPARATOR}${LSVphotoRef?.id}`
}

const getChunkIds = (photo: Photo) => photo.chunkIds.split(CHUNK_SYMBOL_SEPARATOR)

const getUserPhotos = async (chunkRefs: string[]) => {
    let photos = chunkRefs?.map(async (photoChunk) => {
        let [chunk1, chunk2] = photoChunk.split(CHUNK_SYMBOL_SEPARATOR);

        let msv = (await dbServices.getObjectById(COLLECTION_ID,chunk1)) as PhotoChunkDTO;
        let lsv = (await dbServices.getObjectById(COLLECTION_ID,chunk2)) as PhotoChunkDTO;

        return new Photo(
            msv?.value&&lsv?.value ?  msv?.value+lsv?.value : "",
            msv?.logicalPhotoId,
            photoChunk
        )
    })
    return await Promise.all(photos)
}

const deleteUserPhotoChunks = async (photo: Photo) => {
    /* to avoid loops: IT DOESN UPDATE USER */
    let del = getChunkIds(photo).map(async (id) => {
        await dbServices.delete(COLLECTION_ID, id)
        return id
    })
    console.log("  ..::PhotoService.deleteUserPhotoChunks (photo)", photo.id)
    return await Promise.all(del)
}

const updateUserPhotos = async (newPhotos_: Photo[], user: User) => {
    /*
        the photos order in the user arrys is important.
        The first photo will be the profile picutre.

        Therefore, the user photoRefChunks must reflext this order

        Everytime a photo is changed: delete old chunks and add news
    */
   console.log("  ..::PhotoService.updateUserPhotos")
   const oldPhotos = user.photos;
   const newPhotos = newPhotos_.filter((v:any) =>  v != null)
   const userRef = await dbServices.getRefById(COLLECTION_ID, user.id)

    // create new photos
    let updatedChunks = newPhotos.map(async (photo) => {
        return oldPhotos.includes(photo) ?
            photo.chunkIds // no need to creat pic, it already exists
            : await createUserPhoto({photo, userRef})
    })

    let chunks = await Promise.all(updatedChunks)

    // delete old photos
    let deleted = oldPhotos.map(async (photo) => {
        if (!newPhotos.includes(photo)) 
            return await deleteUserPhotoChunks(photo)
    })
    await Promise.all(deleted)

    return chunks
}

export default {
    pickPhotoFromGallery,
    createUserPhoto,
    getUserPhotos,
    updateUserPhotos,
    isPhotoArray,
    COLLECTION_ID
}