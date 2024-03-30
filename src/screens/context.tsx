import React, { createContext, useEffect, useState } from 'react';

import { User } from '@api/domain/User';
import * as userService from "@serv/userService";

export type UserContextType = {
    loggedUser: User | null;
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    useEffect(() => {
      (async () => {
        const id = "KXUyHdBjnp4RSWN4APOW_"
        const user =await userService.getById(id);
        setLoggedUser(user)
      })()
    },[])

    useEffect(() => {
      console.log("..:: LoggedUserContext:")
      console.log(loggedUser)
    },[loggedUser])

    return <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  