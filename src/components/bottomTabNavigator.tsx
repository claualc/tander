
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { IconBarTab } from './index';
import { stackNavigateTo } from '@screens/stackNavigator';


const MainView = styled.View<{
    height: number
}>`
    width: 100%;
    height: ${props => `${props.height}%`};
    position: absolute;
    bottom: 0;
    background-color: ${props => props.theme.light_background};
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

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
        <>
            <IconBarTab 
                key={i}
                onPress={() => {
                    setFocusedScreen(i)
                    stackNavigateTo(name);
                }}
                focused={focusedScreen == i} 
                name={icon} 
                size={45} />
        </>
    ))} 

  </MainView>);
}

export default BottomTabNavigator;
