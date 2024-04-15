import React, { useCallback } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// import to initiate
import "@firebaseServ/index";
//import "@serv/infra/axios";

import { theme } from './globalstyle';
import ScreensStack from './stackNavigator';
import {initAsyncFirebaseServices} from '@firebaseServ/index';
import UserContext from "@context/user";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {

  const [fontsLoaded] = Font.useFonts({
    // demibold: btwn regular and bold
    'Format-Sans-DM': require('@assets/fonts/OCFormatSans-Dm.otf'),
    // medium:   btwn demibold and regular
    'Format-Sans-MD': require('@assets/fonts/OCFormatSans-Md.otf'),
    // regular
    'Format-Sans-RG': require('@assets/fonts/OCFormatSans-Rg.otf'),
    'Format-Sans-XB': require('@assets/fonts/OCFormatSans-XBd.otf'),
    'Format-Sans-BD': require('@assets/fonts/OCFormatSans-Bd.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await initAsyncFirebaseServices();
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View style={{
      width: "100%",
      height: "100%",
      backgroundColor: "purple", // to help debug inconsistencies
      position: 'absolute',
      top: 0
    }}
    onLayout={onLayoutRootView} >  

      <ThemeProvider theme={theme}>
        <UserContext>
            <ScreensStack />
        </UserContext>
      </ThemeProvider>
    </View>
  );
};

export default App;

