import { User } from "firebase/auth"
import authService from "./firebase/auth"
import { CustomError } from "@components/forms/errors";

const SERVICE_ID = "auth";

export const authErrors =  {
    INVALID_PASSWORD: {
        value: "auth/invalid-credential",
        message: "Wrong telephone number or password, try again!"
    },
    TOO_MANY_ATTEMPS: {
        value: "auth/too-many-requests",
        message: "Too many attempts try later!"
    }
}

const validatePassword = (v:string) => {
    return v.split("").length == 8
}

const signIn =async (userPhone: string, password: string) => {
    try {
        console.log("..:: AuthService.signIn")
        return await authService.signIn(userPhone, password)
    } catch (error: any) {
        console.log("       ERROR:", error)
        let errorMessage: string;
        switch(error.code) {
            case authErrors.INVALID_PASSWORD.value:
                errorMessage = authErrors.INVALID_PASSWORD.message
                break;
            case authErrors.TOO_MANY_ATTEMPS.value:
                errorMessage = authErrors.TOO_MANY_ATTEMPS.message
                break;
            default:
                errorMessage = error.message;
        }
        throw new CustomError(errorMessage, SERVICE_ID);
    }
}

const signUp =async (userPhone: string, password: string) => {
    try {
        console.log("..:: AuthService.signUp")
        return await authService.signUp(userPhone, password)
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode",errorCode, "errorMessage",errorMessage)
    }
}

const logOut =async () => {
    try {
        console.log("..:: AuthService.logOut")
        return await authService.logOut()
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode",errorCode, "errorMessage",errorMessage)
    }
}

const setLoggedUser =async (setUserLogged: (id: string) => void) => {
    try {
        console.log("..:: AuthService.setLoggedUser")
        return await authService.getAuthenticatedUser((u: User) => {
            setUserLogged(u?.uid)})
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode",errorCode, "errorMessage",errorMessage)
    }
}

export default {
    validatePassword,
    signIn,
    signUp,
    logOut,
    setLoggedUser
}


