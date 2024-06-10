import { responsiveValue } from "@screens/globalstyle";
import React from "react";
import { ImageBackground } from "react-native";
import styled from "styled-components/native";

interface ChipProps {
    photoCount: number;
    currentPhoto: boolean;
}

const chipMaxWidth = 90;
const chipMargin = 2;

export const PhotoSwipeChips = styled.View<ChipProps>`
    width: ${props => `${chipMaxWidth/props.photoCount-2*chipMargin}%`};
    height: 4px;
    opacity: ${props => props.currentPhoto ? 1 : 0.5 };
    background-color: ${props => props.theme.light_background};
    z-index: 1;
    border-radius: 100px;
    margin: 0px 3px 0px 3px;
`

export const PhotoChipWrapper = styled.View`
    height: 3%;
    align-items: center;
    flex-direction: row;
    z-index:2;
    margin-top: 2px;
    position: absolute;
    z-index: 2;
    justify-content: center;
`

export const UserDataView = styled.View`
    width: 100%;
    height: 100%;
    z-index: 7;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 4% 5% 10% 7%;
    z-index: 3;
    flex: 1;
`

export const AnimationView = styled.View<{
    x: number;
    y: number;
}>`
    width: ${responsiveValue("70%", "25%","60%")};
    aspect-ratio: 1;
    z-index: 100000;
    position: absolute;
    top: ${p => p.y+"%" };
    left: ${p => p.x+"%" };
`

export const ActionGif : React.FC<{
    x: number;
    y: number;
    source: any;
}> = ({x, y, source}) => {
    return <AnimationView 
        x={x}
        y={y}
        >
            <ImageBackground resizeMode="contain" style={{flex:1}} source={source} />
    </AnimationView>
}