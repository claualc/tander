import firebase from "@firebaseServ/index";
import { createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const AuthFirebaseService = () => {
    const auth = initializeAuth(firebase.getApp(), {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });

    console.log("..:: AuthFirebaseService initiated");
    return {
        signIn: async (userPhone: string, password: string) => {
            console.log("..:: AuthFirebaseService.signIn");
            const userCredential = await signInWithEmailAndPassword(auth, userPhone+"@gmail.com", password)
            console.log({userCredential, user:userCredential.user})
            return userCredential
        },
        signUp: async (userPhone: string, password: string) => {
            console.log("..:: AuthFirebaseService.signUp");
            const userCredential = await createUserWithEmailAndPassword(auth, userPhone+"@gmail.com", password)
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