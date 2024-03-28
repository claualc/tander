import { theme } from "@screens/theme";
import { useState } from "react";
import styled from "styled-components/native";
import { convertHexToRGBA } from "@components/utils";


/* 
  ROOT COMPONENTS:
    - top components in the html
*/
export const BOTTOM_TABNAV_HEIGTH = 12; //%

export const RootView = styled.View`
  display: flex;
  width: 100%;
  height: ${false ? `${100-BOTTOM_TABNAV_HEIGTH}%` : "100%"};
  position: "relative";
  background-color: ${p => p.theme.light_background};
  top: 0;
`

/* 
  OTHER GLOBAL COMPONENTS:
    - Simple, complex components must be in a folder
*/

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
  BD: 'Format-Sans-BD'
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

export const Chip: React.FC<React.PropsWithChildren<PropsChip>> = (
  {children, textColor, ...rest}) => (
  <ChipWrapper {...rest}>
    <CustomText color={textColor}>
      {children}
    </CustomText>
  </ChipWrapper>
);

const Cwrapper = styled.View<{color: string}>`
  border-radius: 15px;
  flex: 0;
  margin-top: 10px;
  padding: 12px;
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



