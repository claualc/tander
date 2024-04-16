/**
 * import {helper as helperOriginal} from "moduleB";
 * const helper = helperOriginal as jest.Mock;
 * or
 * when a fucniton is not rexognixe:. jest.mock("moduleB");
 * (func as jest.Mock).mockReturnValue(true);
 * import it normally
 * altough the call to jest.mock occures later, it will be executed before any imports are made. Therefore, helper is an instance of jest.fn() in our test file.
 */

import albumService from "@serv/albumService";
jest.mock("@serv/albumService", () => {
  const mockAlbum1 = {
    name: "Appetite for destruction", 
    imageUrl:"", 
    artist:{
      name: "Guns and Roses"
    }
  }
  
  const mockAlbum2 = {
    name: "user your Illusion I", 
    imageUrl:"", 
    artist:{
        name: "Guns and Roses"
    }
  }
  
  return {
    __esModule: true,
    ...jest.requireActual('@serv/albumService'),
    default: {
      getAlbum: jest.fn().mockResolvedValue(mockAlbum1),
      getArtistTopTracks: jest.fn().mockResolvedValue([mockAlbum1, mockAlbum2]),
      searchArtists: jest.fn().mockResolvedValue(["guns", "kellyMachine"]),
    },
  };
});

import * as userService from "@serv/userService";
jest.mock("@serv/userService", () => {
  const user1 = {
    id: "1VyuB2dE2XPoaDWZHlBmkrCTnC13",
    FCMPushNotificationsToken: "",
    bio: "bio",
    birth: "11111111",
    country: "3",
    course: 1,
    createdAt: "2024-04-14T11:38:08.925Z",
    langKnown: ["5"],
    langToLearn: ["6"],
    musicInterest: null,
    password: "12345678",
    phoneNumber: "677676756756",
    photoChunkRefs: [],
    //photoChunkRefs: "8Y4Z5PrAM5uSmAbi2Ewg_.tA116qzuwgZp6wlfMHfb_",
    team: "1",
    university: "PM",
    username: "hrtrhrthrht"
  }

  const user2 = {
    id: "1VyuB2dE2XPoaDWZHlBmkrCTnC13",
    FCMPushNotificationsToken: "",
    bio: "bio2",
    birth: "22222000",
    country: "5",
    course: 0,
    createdAt: "2024-04-10T11:38:08.925Z",
    langKnown: ["3"],
    langToLearn: ["2"],
    musicInterest: null,
    password: "12345678",
    phoneNumber: "677676756759",
    photoChunkRefs: [],
    //photoChunkRefs: "8Y4Z5PrAM5uSmAbi2Ewg_.tA116qzuwgZp6wlfMHfb_",
    team: "3",
    university: "PM",
    username: "asdasd"
  }

  const user1simple = {
    username: "username",
    profilePhoto: "sdfsdlkjflsdjflsddjfldsj", 
    id: "sdfsdlkjflsdjflsddjfldsj",
    FCMPushNotificationsToken: ""
  }

  const userTeam1 = {id: 1,name: "dsfjkdf", icon: ""}
  const userTeam2 = {id: 2,name: "dsfjkdf", icon: ""}
  const userTeam3 = {id: 3,name: "dsfjkdf", icon: ""}
  const userTeam4 = {id: 4,name: "dsfjkdf", icon: ""}

  return {
    __esModule: true,
    default: "userService",
    getById: jest.fn().mockResolvedValue(user1),
    listAll: jest.fn().mockResolvedValue([user1, user2]),
    listAllBasicInfo: jest.fn().mockResolvedValue([user1simple, user1simple]),
    getByIdSimpleDTO: jest.fn().mockResolvedValue(user1simple),
    update: jest.fn().mockResolvedValue(user1),
    checkUserPhoneNotInUse: jest.fn((param: boolean) => param),
    listAllUserTeam: jest.fn().mockReturnValue([userTeam1,userTeam2,userTeam3,userTeam4])
  };
});

import create from "@serv/userService/create";
jest.mock("@serv/userService/create", () => {
  const user1 = {
    id: "1VyuB2dE2XPoaDWZHlBmkrCTnC13",
    FCMPushNotificationsToken: "",
    bio: "bio",
    birth: "11111111",
    country: "3",
    course: 1,
    createdAt: "2024-04-14T11:38:08.925Z",
    langKnown: ["5"],
    langToLearn: ["6"],
    musicInterest: null,
    password: "12345678",
    phoneNumber: "677676756756",
    photoChunkRefs: [],
    //photoChunkRefs: "8Y4Z5PrAM5uSmAbi2Ewg_.tA116qzuwgZp6wlfMHfb_",
    team: "1",
    university: "PM",
    username: "hrtrhrthrht"
  }
 
  return {
    __esModule: true,
    default: {
      execute: jest.fn().mockResolvedValue(user1),
    },
  };
});

import chatServices from "@serv/chatServices";
jest.mock("@serv/chatServices",() => {

  return {
    __esModule: true,
    default: {
      create: jest.fn(),
      getById: jest.fn(),
      sendMessage: jest.fn(),
      chatListener: jest.fn(),
      getLastMsgChat: jest.fn(),
      update: jest.fn(),
    },
  };
});

import authService from "@serv/authService";
jest.mock("@serv/authService", () => { 
  return {
    __esModule: true,
    default: {
      signIn: jest.fn().mockResolvedValue(true),
      signUp: jest.fn(),
      logOut: jest.fn(),
      setLoggedUser: jest.fn().mockResolvedValue(true)
    }
  };
});

import matchServices from "@serv/matchServices";
jest.mock("@serv/matchServices", () => {
  const match1 = {
    id: "string",
    userId1: "string",
    userId2: "string",
    state: 1,
    userLikes1: true,
    userLikes2: true,
    chatId: "string",
    lastMsg: null,
}
const match2 = {
  id: "string",
  userId1: "string",
  userId2: "string",
  state: 0,
  userLikes1: null,
  userLikes2: false,
  chatId: "string",
  lastMsg: null,
}
const match3 = {
  id: "string",
  userId1: "string",
  userId2: "string",
  state: 0,
  userLikes1: null,
  userLikes2: true,
  chatId: "string",
  lastMsg: null,
} 
  return {
    __esModule: true,
    default: {
      listMatchesByState: jest.fn().mockResolvedValue([match2, match3]),
      getByUserIds: jest.fn().mockResolvedValue([match2, match3]),
      onUserMatchAction: jest.fn((param: number) => param), // estados uno dos o tres
      userLiked: jest.fn(),
      userUnLiked: jest.fn(),
      listUsersForMatching: jest.fn().mockResolvedValue([match2, match3]),
      listMatches: jest.fn().mockResolvedValue([match2, match3, match1]),
      update: jest.fn(),
    },
  };
});

import photoServices from "@serv/photoServices";
jest.mock("@serv/photoServices", () => { 
  return {
    __esModule: true,
    default: {
      pickPhotoFromGallery: jest.fn().mockReturnValue(true),
      createUserPhoto: jest.fn(),
      getUserPhotos: jest.fn(),
      updateUserPhotos: jest.fn(),
      isPhotoArray: jest.fn(),
    },
  };
})

import "@firebaseServ/index";
jest.mock("@firebaseServ/index")

