import React, { createContext, useEffect, useState } from 'react';

import { User } from '@api/domain/User';
import * as userService from "@serv/userService";

export type UserContextType = {
    loggedUser: User | null;
    stateLoading: boolean;
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [stateLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      // (async () => {
      //   setLoading(true)
      //   const id = "KXUyHdBjnp4RSWN4APOW_"
      //   const user =await userService.getById(id);
      //   setLoggedUser(user)
      //   setLoading(false)
      // })()
    },[])

    useEffect(() => {
      console.log("..:: LoggedUserContext:")
      console.log(loggedUser)
    },[loggedUser])

    return <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser, stateLoading, setLoading }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  