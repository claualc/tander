import "@firebaseServ/index";
jest.mock("@firebaseServ/index", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@firebaseServ/index")
  };
});

import dbServices from "@firebaseServ/database"
import { User } from "@domain/User";
jest.mock("@firebaseServ/database")

import * as userServices from "@serv/userService";

import matchServices, { MatchFactory, MatchState, onUserMatchAction } from "@serv/matchServices";
jest.mock("@serv/matchServices", () => {
  return {
    __esModule: true,
    ... jest.requireActual("@serv/matchServices")
  };
});

describe("Match Service Test Suit", () => {
  const id= "1VyuB2dE2XPoaDWZHlBmkrCTnC13"
  const id2 = "kdsjfljejiej23u4r89fefsdjdl"
 
  let dB: any;

  beforeAll(() => dB= dbServices as any)
  beforeEach(() =>jest.clearAllMocks())

  test('createUserMatchFactories', async () => {
    await matchServices.createUserMatchFactories({id: id} as unknown as User)
    expect(userServices.listAllBasicInfo).toHaveBeenCalledTimes(1);
    expect(userServices.listAllBasicInfo()).resolves.toHaveLength(dB.create.mock.instances.length)
  });

  test('listMatchesByState', async () => {
    let state = MatchState.FALSE
    await matchServices.listMatchesByState(id, state)
    expect(dB.listAll).toHaveBeenCalledTimes(1);
    expect(dB.listAll.mock.calls[0][0]).toBe(matchServices.COLLECTION_ID)
    expect(dB.listAll.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        _queryConstraints: expect.arrayContaining([
          expect.objectContaining({_value: state})
        ])
      })
    );
    expect(dB.listAll.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        _queryConstraints: expect.arrayContaining(
          [expect.objectContaining({
          _queryConstraints: expect.arrayContaining([
            expect.objectContaining({_value: id})
          ])
        })])
      })
    );
  });

  test('onUserMatchAction users havent interacted yet', async () => {
    let fact = {id: id2, state: 1000} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update).toHaveBeenCalledTimes(1);
    expect(dB.update.mock.calls[0][0]).toBe(matchServices.COLLECTION_ID)
    expect(dB.update.mock.calls[0][2]).toBe(id2)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: 1000})
  });

  test('onUserMatchAction only one user interacts', async () => {
    let fact = {id: id2, state: 1000,userLikes2: false} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: 1000})

    fact = {id: id2, state: 1000,userLikes1: false} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: 1000})
  });

  test('onUserMatchAction both match', async () => {
    let fact = {id: id2, state: 1000,userLikes2: true,userLikes1: true} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: MatchState.TRUE})
  });

  test('onUserMatchAction one user doenst match', async () => {
    let fact = {id: id2, state: 1000,userLikes2: true,userLikes1: false} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: MatchState.FALSE})

    fact = {id: id2, state: 1000,userLikes2: false,userLikes1: true} as any as MatchFactory
    await onUserMatchAction({id} as any as User,fact, true)
    expect(dB.update.mock.calls[0][1]).toMatchObject({state: MatchState.FALSE})
  });

  test('listUsersMatchedAsTrue', async () => {
    await matchServices.listUsersMatchedAsTrue({id} as any as User)
    expect(dB.listAll).toHaveBeenCalledTimes(1);
    expect(dB.listAll.mock.calls[0][0]).toBe(matchServices.COLLECTION_ID)
    expect(dB.listAll.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        _queryConstraints: expect.arrayContaining([
          expect.objectContaining({_value: MatchState.TRUE})
        ])
      })
    );
    expect(dB.listAll.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        _queryConstraints: expect.arrayContaining(
          [expect.objectContaining({
          _queryConstraints: expect.arrayContaining([
            expect.objectContaining({_value: id})
          ])
        })])
      })
    );
  });
  
  test('update', async () => {
    await matchServices.update({id} as MatchFactory, id)
    expect(dB.update).toHaveBeenCalledTimes(1);
    expect(dB.update.mock.calls[0][0]).toBe(matchServices.COLLECTION_ID) 
    expect(dB.update.mock.calls[0][2]).toBe(id) 
  });


})
