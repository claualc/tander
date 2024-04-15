import firebase, { userFactoryApp } from "@firebaseServ/index";
import { createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const AuthFirebaseService = () => {
    const auth = initializeAuth(firebase.getApp(), {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });

    // to create users without mandatory login
    const userFac = initializeAuth(firebase.getApp(userFactoryApp), {
        persistence: undefined
    });

    console.log("..:: AuthFirebaseService initiated");
    return {
        signIn: async (userPhone: string, password: string) => {
            console.log("..:: AuthFirebaseService.signIn");
            const userCredential = await signInWithEmailAndPassword(auth, userPhone+"@gmail.com", password)
            return userCredential
        },
        signUp: async (userPhone: string, password: string) => {
            console.log("..:: AuthFirebaseService.signUp");
            const userCredential = await createUserWithEmailAndPassword(userFac, userPhone+"@gmail.com", password)
            signOut(userFac)
            return userCredential
        },
        logOut: async() => {
            console.log("..:: AuthFirebaseService.logOut");
            await signOut(auth)
        },
        getAuthenticatedUser: async (callback: (u: any) => void) => {
            return await onAuthStateChanged(auth,callback)
        }
    }
}

const authFirebaseService = AuthFirebaseService();
export default authFirebaseService;