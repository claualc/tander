
import React, { useState } from 'react';
import { stackNavigateTo } from '@screens/stackNavigator';
import { IconBarTab, MainView } from './style';

interface Props {
    height: number,
    routes: {
        name: string,
        component: React.FC,
        icon: any
    }[]
}

const BottomTabNavigator: React.FC<Props> = ({ routes, height}) => {

  const [focusedScreen, setFocusedScreen] = useState(0);

  return (
    <MainView height={height}>

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
