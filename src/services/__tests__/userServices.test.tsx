import "@firebaseServ/index";
jest.mock("@firebaseServ/index", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@firebaseServ/index")
  };
});

import * as userServices from "@serv/userService";
jest.mock("@serv/userService", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@serv/userService")
  };
});
import createUser from "@serv/userService/create";
jest.mock("@serv/userService/create", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@serv/userService/create")
  };
});

import matchServices from "@serv/matchServices";
import dbServices from "@firebaseServ/database"
jest.mock("@firebaseServ/database")

import { CreateUserDTO } from "@serv/userService/DTO";
import authService from "@serv/authService";

describe("User Service Test Suit", () => {
  const id= "1VyuB2dE2XPoaDWZHlBmkrCTnC13"
  let dB: any;

  beforeAll(() => dB= dbServices as any)
  beforeEach(() =>jest.clearAllMocks())

  test('create', async () => {
    let password = "123456789"
    let user: CreateUserDTO = {
      FCMPushNotificationsToken: "",
      bio: "bio",
      birth: "11111111",
      country: "3",
      course: 1,
      langKnown: ["5"],
      langToLearn: ["6"],
      musicInterest: null,
      phoneNumber: "677676756756",
      photoChunkRefs: [],
      team: 1,
      university: "PM",
      username: "hrtrhrthrht"
    }
    await createUser.execute(user, password)
    let f = authService.signUp as any
    expect(f).toHaveBeenCalledTimes(1)
    expect(f.mock.calls[0][0]).toBe(user.phoneNumber) 
    expect(f.mock.calls[0][1]).toBe(password) 
    expect(dB.create).toHaveBeenCalledTimes(1)
    expect(dB.create.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
    expect(dB.create.mock.calls[0][1]).toMatchObject(user)
    expect(matchServices.createUserMatchFactories).toHaveBeenCalledTimes(1)
  });

  test('getById', async () => {
    await userServices.getById(id)
    expect(dB.getObjectById).toHaveBeenCalledTimes(1);
    expect(dB.getObjectById.mock.calls[0][1]).toBe(id) 
    expect(dB.getObjectById.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
  });

  test('listAll', async () => {
    await userServices.listAll()
    expect(dB.listAll).toHaveBeenCalledTimes(1);
    expect(dB.listAll.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
  });

  test('listAllBasicInfo', async () => {
    await userServices.listAllBasicInfo()
    expect(dB.listAll).toHaveBeenCalledTimes(1);
    expect(dB.listAll.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
  });

  test('getRefId', async () => {
    await userServices.getRefId(id)
    expect(dB.getRefById).toHaveBeenCalledTimes(1);
    expect(dB.getRefById.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
    expect(dB.getRefById.mock.calls[0][1]).toBe(id) 
  });

  test('getByIdSimpleDTO', async () => {
    await userServices.getByIdSimpleDTO(id)
    expect(dB.getObjectById).toHaveBeenCalledTimes(1);
    expect(dB.getObjectById.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
    expect(dB.getObjectById.mock.calls[0][1]).toBe(id) 
  });
  
  test('update', async () => {
    await userServices.update({} as CreateUserDTO, id)
    expect(dB.update).toHaveBeenCalledTimes(1);
    expect(dB.update.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
    expect(dB.update.mock.calls[0][2]).toBe(id) 
  });

  test('checkUserPhoneNotInUse', async () => {
    let phone= "999999999999"
    await userServices.checkUserPhoneNotInUse(phone)
    expect(dB.listAll).toHaveBeenCalledTimes(1);
    expect(dB.listAll.mock.calls[0][0]).toBe(userServices.COLLECTION_ID) 
    expect(dB.listAll.mock.calls[0][2]).toMatchObject({_value: phone})
  });

})
