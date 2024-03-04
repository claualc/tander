import React from 'react';
import { DimensionValue, Image, TouchableHighlight , View, ImageBackground } from "react-native";
import styled from "styled-components/native";


import { CustomText } from '@components/index';
import { theme } from '@screens/theme';
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
    position: relative;
    z-index: 0;
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

export const Description: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        color={theme.tertiary_dark} 
        size={16} 
        style={{
            marginTop: 10,
            textAlign: "justify",
        }}>
            {children}
        </CustomText>


export const Subtitle: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        style={{
            textAlign: "justify",
        }}
        color={theme.tertiary_dark} 
        size={16}>
            {children}
        </CustomText>

