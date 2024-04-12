import { DEVICE_WINDOW_TYPE, SCREEN_TYPES, responsiveValue } from '@screens/theme';
import styled from 'styled-components/native';

export const Icon = styled.ImageBackground`
    flex:1;
`;

export const ViewTab = styled.TouchableHighlight`
    flex: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

export const MainView = styled.View<{
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
    padding-left: ${responsiveValue("0%","15%")};
    padding-right: ${responsiveValue("0%","15%")};
`;