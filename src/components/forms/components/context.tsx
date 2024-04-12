import React, { createContext, useCallback, useEffect, useState } from 'react';

import { User } from '@api/domain/User';

export type FormsContextType = {
    inputs: inputObject;
    setInputs: React.Dispatch<React.SetStateAction<inputObject>>;
};

interface inputObject {
    [key: string]: any
}
export const MatchContext = createContext<FormsContextType | null>(null);

const FormContextProvider: React.FC<{children: React.ReactNode, loggedUser?: User}> = ({children, loggedUser}) => {

  const [inputs, setInputs] = useState<inputObject>({} as inputObject);
  
  const setInput = useCallback((name: string, value: any) => {
    let i = inputs
    i[name] = value
    setInputs(i)
  }, [inputs])

  useEffect(() => { console.log("inputs", inputs)}, [inputs])

    return <MatchContext.Provider value={{
        inputs,
        setInputs,
      }}>
    {children}
  </MatchContext.Provider>
}

export default FormContextProvider;
  