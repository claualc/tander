import React, { createContext, useEffect, useState } from 'react';

import { User } from '@api/domain/User';
import * as userService from "@serv/userService";

export type UserContextType = {
    loggedUser: User;
    stateLoading: boolean;
    showBottomNav: boolean;
    setLoggedUser: React.Dispatch<React.SetStateAction<User>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setShowBottomNav: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  const [showBottomNav, setShowBottomNav] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<User>({} as User);
  const [stateLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
      (async () => {
        setLoading(true)
          const id = "Q7ZTHx87chHUsmCxlvLS_"
          const user =await userService.getById(id);

          let {photos_, ...rest} = user
          console.log(rest)
          setLoggedUser(user)
        setLoading(false)
      })()
  },[])

    useEffect(() => {
      if (loggedUser) {
        console.log("..:: LoggedUserContext:", loggedUser.id)
      }
    },[loggedUser])

    return <LoggedUserContext.Provider value={{
        showBottomNav, 
        setShowBottomNav,
        loggedUser,
        setLoggedUser,
        stateLoading,
        setLoading 
      }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  