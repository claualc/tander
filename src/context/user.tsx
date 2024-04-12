import React, { createContext, useCallback, useEffect, useState } from 'react';

import { MusicInterest, User } from '@api/domain/User';
import * as userService from "@serv/userService";
import matchServices from '@serv/matchServices';

import albumservice from "@serv/albumService";
import authService from '@serv/authService';

import FCMService from  "@firebaseServ/notifications";
export type UserContextType = {
    loggedUser: User;
    updateLoggedUser: React.Dispatch<React.SetStateAction<User>>;
    logIn: (id: string) => void;
    logOut: () => void;
    stateLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    showBottomNav: boolean;
    setShowBottomNav: React.Dispatch<React.SetStateAction<boolean>>;
    artistOptionList: string[];
  };

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  const [showBottomNav, setShowBottomNav] = useState<boolean>(true);
  const [loggedUser_, setLoggedUser_] = useState<User>({} as User);
  const [stateLoading, setLoading] = useState<boolean>(true);
  const [artistOptionList, setArtistOptionList] = useState<string[]>([]);

  useEffect(() => {
    /**
     * Preloading some information for the whole app
     */
      (async () => {
          console.log("   INIT USER CONTEXT")
          setLoading(true)
          await authService.setLoggedUser(logIn)

          // FCMService.schedulePushNotification(
          //   "teste",
          //   "aaaaaa",
          //   FCMService.getDeviceToken()
          // )

          let artistNames = await albumservice.searchArtists()
          if (artistNames.length) {
            setArtistOptionList(artistNames)
          }
          setLoading(false)
      })()
  },[])

  const logIn = useCallback(async (id: string) => {
    if (id) {
        const user = await userService.getById(id);

        if (!user) {
          authService.logOut()
        }
        setLoggedUser_(user)
    }
  }, [loggedUser_])

  const logOut = useCallback(async () => {
    await authService.logOut()
    setLoggedUser_({} as User)
  }, [])

  return <LoggedUserContext.Provider value={{
      showBottomNav, 
      setShowBottomNav,
      loggedUser: loggedUser_,
      logIn,
      logOut,
      updateLoggedUser: setLoggedUser_,
      stateLoading,
      setLoading,
      artistOptionList
    }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  