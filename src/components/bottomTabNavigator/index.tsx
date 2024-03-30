
import React, { useState } from 'react';
import { IconBarTab, MainView } from './style';
import { BOTTOM_TABNAV_HEIGTH } from '@components/index';

interface Props {
    routes: {
        name: string,
        component: React.FC,
        icon: any
    }[],
    onSelect: (screenName: string) => void;
}

const BottomTabNavigator: React.FC<Props> = ({routes, onSelect}) => {

  const [focusedScreen, setFocusedScreen] = useState(0);

  return (
    <MainView height={BOTTOM_TABNAV_HEIGTH}>

    { routes.map(({name, icon}, i) => (
        <IconBarTab 
            key={i}
            onPress={() => {
                setFocusedScreen(i)
                onSelect(name);
            }}
            focused={focusedScreen == i} 
            name={icon} 
            size={45} />
    ))} 

  </MainView>);
}

export default BottomTabNavigator;
