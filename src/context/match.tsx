import React, { createContext, useCallback, useEffect, useState } from 'react';

import { User } from '@domain/User';
import matchServices, { POT_MATCH_BATCH_LIMIT } from '@serv/matchServices';

export type MatchContextType = {
    potentialMatches: User[];
    setPotentialMatches: React.Dispatch<React.SetStateAction<User[]>>;
    loadMoreMatches: () => Promise<void>
};

export const MatchContext = createContext<MatchContextType | null>(null);

const ContextProvider: React.FC<{children: React.ReactNode, loggedUserId?: string}> = ({children, loggedUserId}) => {

  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  
  // use to do pagination
  const [loadedCounter, setLoadedCounter] = useState<number>(0);

  const loadMoreMatches = useCallback(async () => {
    if (!!loggedUserId) {
        let lastUser = potentialMatches.length ? potentialMatches[0] : null
        console.log("lastuser",lastUser?.username, lastUser?.id)
        setPotentialMatches([])
    
        let users: User[] = await matchServices.listUsersForMatching(loggedUserId,POT_MATCH_BATCH_LIMIT+2,lastUser?.id)
        console.log("users length", users.length)
        let removed = users[users.length-1]
        if (lastUser?.id) {
          console.log("removed", users.filter(u => u.id == lastUser.id)[0]?.id)
          users = users.filter(u => u.id != lastUser.id)
        }
        console.log("users length", users.length)
        setLoadedCounter(loadedCounter+POT_MATCH_BATCH_LIMIT)
        setPotentialMatches(users.length ? users : [])
        users.map((user: User, i) => console.log(user.username, user.id, i))
        console.log("  CONTEXT (match): ", users?.length, "potential matches found")
    }
  }, [loggedUserId,potentialMatches, POT_MATCH_BATCH_LIMIT, loadedCounter])

  useEffect(() => {loadMoreMatches()}, [loggedUserId])

    return <MatchContext.Provider value={{
        potentialMatches,
        setPotentialMatches,
        loadMoreMatches
      }}>
    {children}
  </MatchContext.Provider>
}

export default ContextProvider;
  