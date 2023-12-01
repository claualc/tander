import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

export const MainWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  background-color: ${props => props.theme.light_background};
`;

interface PropsIconBarTab {
  focused: boolean;
}

export const IconBarTab = styled(Ionicons)<PropsIconBarTab>`
  color: ${props => props.focused ? props.theme.tertiary : props.theme.secondary_background};
`;
