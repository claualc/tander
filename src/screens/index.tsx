import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import {initAsyncFirebaseServices} from '@serv/firebase';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import FCMService from "@firebaseServ/notifications"
import ScreensStack, { routes } from './stackNavigator';

import "@serv/firebase"; // import to initiate the firebase module
import BottomTabNavigator from '@components/bottomTabNavigator';


const App: React.FC = () => {

  const [tabHeight, setTabHeight] = useState(13);

  useEffect(() => {
    (async () => await initAsyncFirebaseServices())();
  }, [])

    const testFirestore = useCallback(async () => {
      //const users = await userService.listAll();
      const not  = await FCMService.schedulePushNotification(
        "Tander","Deu match!!! 😘💕💖😎", { data: 'goes here' }
      )
    }, []);


  return (
    <ThemeProvider theme={theme}>
      <View style={{
        width: "100%",
        height: "100%",
        backgroundColor: "red", // to help debug inconsistencies
        position: 'absolute',
        top: 0
      }}>
        <View style={{
            display: "flex",
            width: "100%",
            height: `${100-tabHeight}%`,
            position: "relative",
            backgroundColor: theme.light_background,
            top: 0,
        }}>
          <ScreensStack/>
        </View>
        <BottomTabNavigator routes={routes} height={tabHeight}/>
      </View>
    </ThemeProvider>
  );
};

export default App;

