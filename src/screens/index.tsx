import React, { useEffect, useCallback } from 'react';
import {Button, Text, View} from 'react-native';

import "@serv/firebase"; // import to initiate the firebase module
import {initAsyncFirebaseServices} from '@serv/firebase';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import FCMService from "@firebaseServ/notifications"
import userService from '@serv/userService';


export type Props = {
  name?: string;
  baseEnthusiasmLevel?: number;
};

const App: React.FC<Props> = () => {

  useEffect(() => {
    (async () => await initAsyncFirebaseServices())();
  }, [])

    const testFirestore = useCallback(async () => {
      //const users = await userService.listAll();

      const not  = await FCMService.schedulePushNotification(
        "Tander","Deu match!!! 😘💕💖😎", { data: 'goes here' }
      )


      // check
      // user permision to add notifications
    }, []);

  return (
    <ThemeProvider theme={theme}>
      <MainWrapper>
        <Text>
          uaydiuyaeuhrelkjlkjf dlsjfekdjfò j
          </Text>
          <Button
            onPress={testFirestore}
            title="testFirestore"
            color="#841584"
          />
      </MainWrapper>
    </ThemeProvider>
  );
};

const MainWrapper = styled.View`
  background-color: ${props => props.theme.main};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export default App;