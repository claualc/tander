import React from 'react';
import styled from "styled-components/native";

import { CustomText } from '@components/index';
import { gobalFont, theme } from '@screens/theme';

export const ScreenView = styled.View`
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
    flex: 1;
    margin-top: 5%;
    justify-content: flex-end;
    align-items: flex-start;
    flex-direction: column;
`

export const FormsWrapper = styled.View`
    flex: 8;
    width: 100%;
    padding: 2% 2% 0% 2%;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
`

export const CenterWrapping = styled.View`
    flex: 2;
    width: 100%;
    padding: 0% 0% 0% 0%;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`


export const Title: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        color={theme.main_dark} 
        size={gobalFont.size.title} 
        fontFam='DM'
        style={{
            marginBottom: 6,
            marginTop: 6
        }}>
            {children}
        </CustomText>

export const Description: React.FC<React.PropsWithChildren<{
    bottomDescription?: boolean;
}>> = ({
    children, bottomDescription= false
}) => <CustomText 
        color={theme.tertiary_dark} 
        size={gobalFont.size.default} 
        style={{
            marginTop: gobalFont.size.default,
            marginBottom: bottomDescription ? gobalFont.size.default*1.5:gobalFont.size.default*0.2,
            textAlign: "justify",
        }}>
            {children}
        </CustomText>


export const Subtitle: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        style={{
            textAlign: "justify",
            marginBottom: "3%"
        }}
        color={theme.tertiary_dark} 
        size={gobalFont.size.default}>
            {children}
        </CustomText>

