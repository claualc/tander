import "@firebaseServ/index";
jest.mock("@firebaseServ/index", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@firebaseServ/index")
  };
});

import photoServices from "@serv/photoServices";
jest.mock("@serv/photoServices", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@serv/photoServices")
  };
});

import dbServices from "@firebaseServ/database"
jest.mock("@firebaseServ/database")

import { DocumentReference } from "firebase/firestore";
import { Photo, User } from "@domain/User";


describe("Photo Service Test Suit", () => {
  const id= "1VyuB2dE2XPoaDWZHlBmkrCTnC13"
  const id2= "1VyuB2dE2XPoaDWZHlBmsadsads3"
  const id3= "1VyuB2dE2XPoaDWZHlBmsawsads3"
  const id4= "1VyuB2dE2XPoaDWZHlBmsaddads3"

  const CHUNKS_PER_PHOTO = 2

  let dB: any;

  const newP = (id: string) => ({id, value: "12345678", chunkIds: "chunkId1.chunkid2"} as Photo)

  beforeAll(() => dB= dbServices as any)
  beforeEach(() =>jest.clearAllMocks())

  test('createUserPhoto creates two photo chunks', async () => {
    await photoServices.createUserPhoto({
      photo: newP(id), 
      userRef: {} as DocumentReference
    })
    expect(dB.create).toHaveBeenCalledTimes(2);
    expect(dB.create.mock.calls[0][0]).toBe(photoServices.COLLECTION_ID) 
    expect(dB.create.mock.calls[1][0]).toBe(photoServices.COLLECTION_ID) 
  });

  test('getUserPhotos joins photo chunks', async () => {
    let refs = ["1", "2"]
    let calls = refs.length*CHUNKS_PER_PHOTO
    await photoServices.getUserPhotos(refs)
    expect(dB.getObjectById).toHaveBeenCalledTimes(calls);

    refs = ["1"]
    calls = calls + refs.length*CHUNKS_PER_PHOTO
    await photoServices.getUserPhotos(refs)
    expect(dB.getObjectById).toHaveBeenCalledTimes(calls);
  });

  test('updateUserPhotos adds new photos to user', async () => {
    let newPhotos = [newP(id2),newP(id3)]
    let photos = [] as Photo[]
    await photoServices.updateUserPhotos(
      newPhotos, {id,photos} as User
    )

    expect(dB.create).toHaveBeenCalledTimes(newPhotos.length*CHUNKS_PER_PHOTO);
  });
  
  test('updateUserPhotos deletes photos from user', async () => {
    let newPhotos = [newP(id2),newP(id3)]
    await photoServices.updateUserPhotos(
      [], {id,photos: newPhotos} as User
    )
    expect(dB.delete).toHaveBeenCalledTimes(newPhotos.length*CHUNKS_PER_PHOTO);
  });

  test('updateUserPhotos adds one and deletes one photo', async () => {
    let newPhotos = [newP(id2),newP(id3)]
    let oldPhotos = [newP(id4)]
    await photoServices.updateUserPhotos(
      newPhotos, 
      {id,photos:oldPhotos} as User
    )
    expect(dB.create).toHaveBeenCalledTimes(newPhotos.length*CHUNKS_PER_PHOTO);
    expect(dB.delete).toHaveBeenCalledTimes(oldPhotos.length*CHUNKS_PER_PHOTO);
  });

})
