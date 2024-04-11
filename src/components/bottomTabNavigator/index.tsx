
import React, { useState } from 'react';
import { Icon, MainView, ViewTab } from './style';
import { BOTTOM_TABNAV_HEIGTH } from '@components/index';
import { View } from 'react-native';
import { theme } from '@screens/theme';

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
          <View style={{height: "100%", width:(focusedScreen === i) ? "51%" : "32%"}}>
            <Icon resizeMode='contain' source={(focusedScreen === i) ? r.onFocusIcon : r.icon}  />
          </View>
      </ViewTab>
    ))} 

  </MainView>
}

export default BottomTabNavigator;
