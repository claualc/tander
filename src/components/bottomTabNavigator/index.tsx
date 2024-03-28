
import React, { useState } from 'react';
import { stackNavigateTo } from '@screens/stackNavigator';
import { IconBarTab, MainView } from './style';
import { BOTTOM_TABNAV_HEIGTH } from '@components/index';

interface Props {
    routes: {
        name: string,
        component: React.FC,
        icon: any
    }[]
}

const BottomTabNavigator: React.FC<Props> = ({routes}) => {

  const [focusedScreen, setFocusedScreen] = useState(0);

  return (
    <MainView height={BOTTOM_TABNAV_HEIGTH}>

    { routes.map(({name, icon}, i) => (
        <IconBarTab 
            key={i}
            onPress={() => {
                setFocusedScreen(i)
                stackNavigateTo(name);
            }}
            focused={focusedScreen == i} 
            name={icon} 
            size={45} />
    ))} 

  </MainView>);
}

export default BottomTabNavigator;
