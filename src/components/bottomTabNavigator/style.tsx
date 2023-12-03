import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";

interface PropsIconBarTab {
    focused: boolean;
}
  
export const IconBarTab = styled(Ionicons)<PropsIconBarTab>`
    color: ${props => props.focused ? props.theme.tertiary : props.theme.secondary_background};
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
`;