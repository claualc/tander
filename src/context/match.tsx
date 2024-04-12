import React, { createContext, useCallback, useEffect, useState } from 'react';

import { User } from '@api/domain/User';
import * as userService from "@serv/userService";
import matchServices, { POT_MATCH_BATCH_LIMIT } from '@serv/matchServices';

import albumservice from "@serv/albumService";
import { PaginationInfo } from '@serv/firebase/database';

export type MatchContextType = {
    potentialMatches: User[];
    setPotentialMatches: React.Dispatch<React.SetStateAction<User[]>>;
    loadMoreMatches: () => Promise<void>
  };


export const MatchContext = createContext<MatchContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode, loggedUser?: User}> = ({children, loggedUser}) => {

  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  
  // use to do pagination
  const [loadedCounter, setLoadedCounter] = useState<number>(0);

  const loadMoreMatches = useCallback(async () => {
    if (loggedUser?.id) {
        let lastUser =potentialMatches[potentialMatches?.length-1]
        setPotentialMatches([])
    
        const users: User[] = await matchServices.listUsersForMatching(loggedUser?.id,POT_MATCH_BATCH_LIMIT,lastUser?.id)
        setLoadedCounter(loadedCounter+POT_MATCH_BATCH_LIMIT)
        setPotentialMatches(users.length ? users : [])
        console.log("  CONTEXT (match): ", users?.length, "potential matches found")
    }
  }, [loggedUser,potentialMatches, POT_MATCH_BATCH_LIMIT, loadedCounter])

  useEffect(() => {loadMoreMatches()}, [loggedUser])

    return <MatchContext.Provider value={{
        potentialMatches,
        setPotentialMatches,
        loadMoreMatches
      }}>
    {children}
  </MatchContext.Provider>
}

export default ContextProvider;
  