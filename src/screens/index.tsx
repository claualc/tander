import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import {initAsyncFirebaseServices} from '@serv/firebase';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import ScreensStack, { routes } from './stackNavigator';

import "@serv/firebase"; // import to initiate the firebase module
import BottomTabNavigator from '@components/bottomTabNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {

  const [tabHeight, setTabHeight] = useState(12);
  const [appIsReady, setAppIsReady] = useState(false);
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
      backgroundColor: "red", // to help debug inconsistencies
      position: 'absolute',
      top: 0
    }}
    onLayout={onLayoutRootView} >  
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </View>
  );
};

export default App;

