import "@firebaseServ/index";
jest.mock("@firebaseServ/index", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@firebaseServ/index")
  };
});

import dbServices from "@firebaseServ/database"
jest.mock("@firebaseServ/database")

import authService from "@firebaseServ/auth"
jest.mock("@firebaseServ/auth", () => {
  return {
    __esModule: true,
    default: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      logOut: jest.fn(),
      getAuthenticatedUser:jest.fn()
    }
  }
})

import authServices from "@serv/authService";
jest.mock("@serv/authService", () => { 
  return {
    __esModule: true,
    ...jest.requireActual("@serv/authService")
  };
});

describe("Auth Service Test Suit", () => {
  let auhServ: any;

  beforeAll(() => auhServ= authService as any)
  beforeEach(() =>jest.clearAllMocks())

  test('signIn', async () => {
    let userPhone = "123456789"
    let password = "123456789"
    await authServices.signIn(userPhone, password)
    expect(auhServ.signIn).toHaveBeenCalledTimes(1);
    expect(auhServ.signIn.mock.calls[0][0]).toBe(userPhone) 
    expect(auhServ.signIn.mock.calls[0][0]).toBe(password) 
  });

  test('signUp', async () => {
    let userPhone = "123456789"
    let password = "123456789"
    await authServices.signUp(userPhone, password)
    expect(auhServ.signUp).toHaveBeenCalledTimes(1);
    expect(auhServ.signUp.mock.calls[0][0]).toBe(userPhone) 
    expect(auhServ.signUp.mock.calls[0][0]).toBe(password) 
  });

  test('logOut', async () => {
    await authServices.logOut()
    expect(auhServ.logOut).toHaveBeenCalledTimes(1);
  });

  test('setLoggedUser', async () => {
    await authServices.setLoggedUser(jest.fn() )
    expect(auhServ.getAuthenticatedUser).toHaveBeenCalledTimes(1);
  });

})
