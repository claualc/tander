import React from "react";
import { useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";

import { DEV_DIM,  gobalFont, responsiveValue, theme } from "@screens/global.style";
import { convertHexToRGBA } from "@components/utils";

import SmallLoading from "@imgs/loading_small.gif";
import LoadingGif from "@imgs/loading.gif";

/* 
  ROOT COMPONENTS:
    - top components in the html
*/
export const BOTTOM_TABNAV_HEIGTH = responsiveValue(10,13); //%

export const RootScreenView = styled.View<{
  showBottomNavigatior: boolean;
}>`
  width: 100%;
  height: ${p =>  p.showBottomNavigatior? `${100-BOTTOM_TABNAV_HEIGTH}%` : "100%"};
`

/* 
  OTHER GLOBAL COMPONENTS:
    - Simple, complex components must be in a folder
*/

export const ScreenView = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.light_background};
  z-index: -1000;
  position: relative;
`;

interface DimensionsI {
  widthPx?: number;
  heightPx?: number;
}

export const Wrapper = styled.View<DimensionsI>`
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
  font-size: ${props => props.size ? `${props.size}px` : `${gobalFont.size.default}px`};
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
    return inColor || randomColorChooses[getRandomInt(randomColorChooses.length)];
  })

  return <Cwrapper color={convertHexToRGBA(color, 0.2)}>{children}</Cwrapper>
}

const LoadingView = styled.View<{
  width?: string;
  height?: string;
}>`
  justify-content: center;
  align-items: center;
  width: ${p => p.width || "100%"};
  height:  ${p => p.height || `${DEV_DIM.height*0.2}px`};
`
export const Loading: React.FC<{
  width?: string;
  height?: string;
}> = ({width,height}) => <LoadingView width={width} height={height}>
      <Image source={SmallLoading} style={{ width: 100, height: 100 }} />
  </LoadingView>


export const LoadingComponent = () => {
  return <View
      style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100
      }}>
          <Image source={LoadingGif} style={{ width: "30%", height: "30%" }} />
  </View>
}
