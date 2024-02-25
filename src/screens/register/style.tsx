import { DimensionValue, Image, View } from "react-native";
import styled from "styled-components/native";

import React from 'react';

import { CustomText } from '@components/index';
import { theme } from '@screens/theme';
import { ImageBackground, TouchableHighlight } from 'react-native';
import Gradient from "@assets/linear_gradient_background.png";

export const ProgressBarWrapper = styled.View`
    flex: 2;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
`

export const MainWrapper = styled.View`
    flex: 23;
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding-left: 8%;
    padding-right: 8%;
`

export const BackButtonWrapper = styled.View`
    flex: 2;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-start;
    flex-direction: column;
`

export const FormsWrapper = styled.View`
    flex: 8;
    width: 100%;
    padding: 0;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
`

export const CenterWrapping = styled.View`
    flex: 6;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`


export const Title: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        color={theme.main_dark} 
        size={30} 
        fontFam='DM'
        style={{
            marginBottom: 6,
            marginTop: 6
        }}>
            {children}
        </CustomText>

export const Subtitle: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        style={{
            textAlign: "justify",
            marginBottom: 6
        }}
        color={theme.tertiary_dark} 
        size={15}>
            {children}
        </CustomText>

export const NextButton: React.FC<{
    onPress: () => void;
    title: string
}> = ({onPress, title}) => {
    return <TouchableHighlight
            style={{
                borderRadius: 50,
                width: "100%",
                overflow: 'hidden',
            }}
            onPress={onPress}>
                <ImageBackground 
                    resizeMode='cover' 
                    style={{ 
                        borderRadius: 50, 
                        padding: 15,
                        alignContent: "center",
                        alignItems: "center"
                    }} source={Gradient}>
                    <CustomText fontFam="DM" color={theme.text_ligth_primary}>
                        {title}
                    </CustomText>

                </ImageBackground>
            </TouchableHighlight>
}

