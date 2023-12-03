import { DimensionValue, View } from "react-native";
import styled from "styled-components/native";

export const MainWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.light_background};
  z-index: -1000;
`;

export const CustomText = styled.Text`
  font-family: 'Format-Sans-RG';
`;

interface borderProps {
  width?: DimensionValue,
  height?: DimensionValue,
  shadowOpacity?: number,
  shadowRadius?: number,
  elevation?: number,
  borderRadius?: number,
  shadowOffset?: {
    width?: number,
    height?: number,
  },
  shadowColor?: string,
  children?: any
}

export const BorderBox: React.FC<React.PropsWithChildren<borderProps>> = ({
  width,
  height,
  shadowOpacity,
  shadowRadius,
  elevation,
  borderRadius,
  shadowOffset,
  shadowColor,
  children,
}) => <View
    style={{ 
      width: width ? width : "100%",
      height:  height || "100%",
      shadowOpacity: shadowOpacity || 1,
      shadowRadius: shadowRadius || 1,
      elevation: elevation || 10,
      shadowColor: shadowColor||"black",
      shadowOffset: { 
        height: shadowOffset?.height || 10, 
        width: shadowOffset?.width || 0
      },
      borderRadius: borderRadius || 13,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 0,
    }}
>{children}</View>


