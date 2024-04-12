
import React from 'react';
import { Image, ImageBackground, View } from 'react-native';

import LoginBackground from "@imgs/login_background.png";
import AppIcon from "@imgs/icon.png";

import { CustomText, ScreenView } from '@components/index';
import { CustomSelectTouchable } from '@components/select/style';
import { gobalFont, responsiveValue, theme } from '../theme';
import { stackNavigateTo } from '@screens/stackNavigator/navigateService';
import { routeNames } from '@screens/stackNavigator/routes';


const InitializationScreen = () => {
  return  <ScreenView>
    <ImageBackground
      source={LoginBackground}
      style={{flex:1, width: "100%"}} 
      resizeMode='cover'>

        <View style={{width: "100%", flex: 2, justifyContent: "center", alignItems: 'center'}}>
          <View style={{ width:  responsiveValue("30%","20%") ,position:'relative', top: "10%", aspectRatio:1, borderRadius: 30, overflow: 'hidden'}}>
            <Image source={AppIcon} style={{flex:1,width: "100%"}} resizeMode='contain'/>
          </View>
        </View>
        <View style={{width: "100%", flex: 2, alignItems: 'center'}}>
          <View style={{width: responsiveValue("85%","55%") ,// the other one is medium
            aspectRatio: "3/1.4",
            alignItems: 'center',
            justifyContent: 'space-between'}}>
            <CustomText 
              size={gobalFont.size.small}
              color={theme.light_background}>
              If you already have an account
              </CustomText>

            <CustomSelectTouchable 
              alignCenter={true}
              onPress={() => {stackNavigateTo(routeNames.LOGIN_SCREEN)}}
              outlined={true}
              color={theme.light_background}>
                <CustomText style={{textAlign: "center"}} color={theme.light_background}>Login</CustomText>
            </CustomSelectTouchable>

            <CustomText 
              size={gobalFont.size.small}
              color={theme.light_background}>
              or, if you are new here
              </CustomText>

            <CustomSelectTouchable 
              alignCenter={true}
              onPress={ () => {stackNavigateTo(routeNames.REGISTER_SCREEN)}}
              outlined={true}
              color={theme.light_background}>
                <CustomText style={{textAlign: "center"}} color={theme.light_background}>Create Account</CustomText>
            </CustomSelectTouchable>
          </View>
        </View>
    </ImageBackground>
  </ScreenView>
}

export default InitializationScreen;
