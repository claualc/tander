
import React, { useEffect, useState } from 'react';
import { Icon, MainView, ViewTab } from './style';
import { BOTTOM_TABNAV_HEIGTH } from '@components/index';
import { View } from 'react-native';
import { responsiveValue, theme } from '@screens/globalstyle';
import { useRoute } from '@react-navigation/native';
import { navigatorRef } from '../navigateService';

interface Props {
    routes: {
        name: string;
        component: React.FC;
        icon: any;
        onFocusIcon: any;
    }[],
    onSelect: (screenName: string) => void;
    currentRoute: string;
}

const BottomTabNavigator: React.FC<Props> = ({routes, onSelect, currentRoute}) => {

  return <MainView height={BOTTOM_TABNAV_HEIGTH}>

    { routes.map((r, i) => (
      <ViewTab
        underlayColor={theme.light_background}
        key={i}
        onPress={() => {
            onSelect(r.name);
        }}>
          <View style={{
            flex: 1,
            height: responsiveValue(
              (currentRoute === r.name) ? "79%" : "50%",
              (currentRoute === r.name) ? "75%" : "46%")
          }}>
            <Icon resizeMode='contain' source={(currentRoute === r.name) ? r.onFocusIcon : r.icon}  />
          </View>
      </ViewTab>
    ))} 

  </MainView>
}

export default BottomTabNavigator;
