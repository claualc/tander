
import React, { useEffect, useState } from 'react';
import { Icon, MainView, ViewTab } from './style';
import { BOTTOM_TABNAV_HEIGTH } from '@components/index';
import { View } from 'react-native';
import { responsiveValue, theme } from '@screens/globalstyle';

interface Props {
    routes: {
        name: string;
        component: React.FC;
        icon: any;
        onFocusIcon: any;
    }[],
    onSelect: (screenName: string) => void;
}

const BottomTabNavigator: React.FC<Props> = ({routes, onSelect}) => {

  const [focusedScreen, setFocusedScreen] = useState(0);

  return <MainView height={BOTTOM_TABNAV_HEIGTH}>

    { routes.map((r, i) => (
      <ViewTab
        underlayColor={theme.light_background}
        key={i}
        onPress={() => {
            setFocusedScreen(i)
            onSelect(r.name);
        }}>
          <View style={{
            flex: 1,
            height: responsiveValue(
              (focusedScreen === i) ? "79%" : "50%",
              (focusedScreen === i) ? "75%" : "46%")
          }}>
            <Icon resizeMode='contain' source={(focusedScreen === i) ? r.onFocusIcon : r.icon}  />
          </View>
      </ViewTab>
    ))} 

  </MainView>
}

export default BottomTabNavigator;
