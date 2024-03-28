import React, { createContext, useEffect, useState } from 'react';

import { User } from '@api/domain/User';

export type UserContextType = {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const LoggedUserContext = createContext<UserContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
      console.log("..:: LoggedUserContext:")
      console.log(currentUser)
    },[currentUser])

    return <LoggedUserContext.Provider value={{ currentUser, setCurrentUser }}>
    {children}
  </LoggedUserContext.Provider>
}

export default ContextProvider;
  