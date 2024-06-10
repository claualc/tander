
import React from 'react';
import { Image, ImageBackground, View } from 'react-native';

import LoginBackground from "@imgs/linear_gradient_background2.png";

import { CustomText, ScreenView } from '@components/index';
import { CustomSelectTouchable } from '@components/selects/select/style';
import { gobalFont, responsiveValue, theme } from '../globalstyle';
import { stackNavigateTo } from '@screens/stackNavigator/navigateService';
import { routeNames } from '@screens/stackNavigator/routes';

import WhiteIconName from "@imgs/logo/icon_name/TYPO-LOGO-sembg_branco.png";

const InitializationScreen = () => {
  return  <ScreenView testID='screen-initialization'>
    <ImageBackground
      source={LoginBackground}
      style={{flex:1, width: "100%"}} 
      resizeMode='cover'>

        <View style={{ width: "100%", flex: responsiveValue(1.5,1.5,1), justifyContent: "flex-end",marginBottom: responsiveValue("20%","15%","5%"), alignItems: 'center'}}>
          <View style={{ width:  responsiveValue("62%","20%","30%") ,position:'relative', top: "10%", aspectRatio:2/1, overflow: 'hidden'}}>
            <Image source={WhiteIconName} style={{flex:1,width: "100%"}} resizeMode='contain'/>
          </View>
        </View>
        <View style={{width: "100%",flex:responsiveValue(2,2,1), alignItems: 'center'}}>
          <View style={{width: responsiveValue("80%","55%","25%") ,// the other one is medium
            aspectRatio: responsiveValue("2.3/1.4","3/1.4","3/1.6"),
            alignItems: 'center',
            justifyContent: 'space-between'}}>
            <CustomText 
              size={gobalFont.size.small*0.9}
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
              size={gobalFont.size.small*0.9}
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
