import { theme } from "@screens/theme";
import { useState } from "react";
import styled from "styled-components/native";

const convertHexToRGBA = (hexCode: string, opacity = 1) => {  
  let hex = hexCode.replace('#', '');
  
  if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }    
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
      opacity = opacity / 100;   
  }

  return `rgba(${r},${g},${b},${opacity})`;
};

export const MainWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.light_background};
  z-index: -1000;
`;

interface Dimensions {
  widthPx?: number;
  heightPx?: number;
}

export const Wrapper = styled.View<Dimensions>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  width: ${p => p.widthPx ? `${p.widthPx}px` : undefined};
  height: ${p => p.heightPx ? `${p.heightPx}px` : undefined};
  z-index: -999;
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
  color?: string;
}>`
  font-family: ${props => props.fontFam 
      ? typographyTypes[props.fontFam] 
      : typographyTypes["RG"]};
  color: ${p => p.color || "black"};
  font-size: ${props => props.size ? `${props.size}px` : "17px"};
`;

interface borderProps {
  width?: number,
  height?: number,
  shadowOpacity?: number,
  shadowRadius?: number,
  elevation?: number,
  borderRadius?: number,
  shadowOffset?: {
    width?: number,
    height?: number,
  },
  shadowColor?: string,
  children?: any, 
  offBorder?: boolean;
}

interface PropsChip {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
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
  {children, textColor, ...rest}) => (
  <ChipWrapper {...rest}>
    <TextChip color={textColor}>
      {children}
    </TextChip>
  </ChipWrapper>
);


const Cwrapper = styled.View<{color: string}>`
  border-radius: 15px;
  flex: 0;
  margin: 3px;
  padding: 5px;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${p => p.color};
`;

interface PropsColoWrapper {
  inColor?: string;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const ColorWrapper: React.FC<React.PropsWithChildren<PropsColoWrapper>> = ({children, inColor}) => {
  const [color, setColor] = useState(() => {
    const randomColorChooses = [theme.tertiary, theme.secondary]
    return inColor || randomColorChooses[getRandomInt(randomColorChooses.length)]
  })

  return <Cwrapper color={convertHexToRGBA(color, 0.2)}>{children}</Cwrapper>
}



