import React, { createContext, useCallback, useEffect, useState } from 'react';

import { MusicInterest, User } from '@api/domain/User';
import * as userService from "@serv/userService";
import matchServices from '@serv/matchServices';

import albumservice from "@serv/albumService";

export type UserContextType = {
    loggedUser: User;
    setLoggedUser: React.Dispatch<React.SetStateAction<User>>;
    stateLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    showBottomNav: boolean;
    setShowBottomNav: React.Dispatch<React.SetStateAction<boolean>>;
    artistOptionList: string[];
  };

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  const [showBottomNav, setShowBottomNav] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<User>({} as User);
  const [stateLoading, setLoading] = useState<boolean>(false);
  const [artistOptionList, setArtistOptionList] = useState<string[]>([]);

  useEffect(() => {
    /**
     * Preloading some information for the whole app
     */
      (async () => {
        setLoading(true)
        
          const id = process.env.EXPO_PUBLIC_USER_ID
          if (id) {
            // logged user
            const user = await userService.getById(id);
  
            let {photos_, ...rest} = user
            setLoggedUser(user)
            console.log("  CONTEXT (user): user logged",id)

            let artistNames = await albumservice.searchArtists()
            if (artistNames.length) {
              setArtistOptionList(artistNames)
            }
        }
        setLoading(false)
      })()
  },[])

  return <LoggedUserContext.Provider value={{
      showBottomNav, 
      setShowBottomNav,
      loggedUser,
      setLoggedUser,
      stateLoading,
      setLoading,
      artistOptionList
    }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  