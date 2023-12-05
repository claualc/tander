import { DimensionValue, Text, View } from "react-native";
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

const typographyTypes = {
  DM: 'Format-Sans-DM',
  MD: 'Format-Sans-MD',
  RG: 'Format-Sans-RG',
  XB: 'Format-Sans-XB',
  BD: 'Format-Sans-BD',
}

export const CustomText = styled.Text<{
  fontFam?: keyof typeof typographyTypes;
  size?: number;
}>`
  font-family: ${props => props.fontFam 
      ? typographyTypes[props.fontFam] 
      : typographyTypes["RG"]};
  color: white;
  font-size: ${props => props.size ? `${props.size}px` : "17px"};
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

interface PropsChip {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const ChipWrapper = styled.View<PropsChip>`
  filter: blur(10px);
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${({backgroundColor,theme}) => backgroundColor ? backgroundColor : theme.secondary_background};
  padding: 4px 10px 4px 10px;
  margin: 4px 5px 4px 0px;
  border-radius: 100px;
  opacity: 0.65;
`

const TextChip = styled(CustomText)`
`
export const Chip: React.FC<React.PropsWithChildren<PropsChip>> = (
  {children, ...rest}) => (
  <ChipWrapper {...rest}>
    <TextChip>
      {children}
    </TextChip>
  </ChipWrapper>
);



