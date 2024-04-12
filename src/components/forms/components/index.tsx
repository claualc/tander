import React from 'react';
import styled from "styled-components/native";

import { CustomText } from '@components/index';
import { gobalFont, responsiveValue, theme } from '@screens/theme';

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
    width: 100%;
    justify-content: flex-end;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 8%;
`

export const FormsWrapper = styled.View`
    width: 100%;
    padding: 4% 0% 4% 0%;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
`

export const CenterWrapping = styled.View`
    width: 100%;
    padding: ${responsiveValue("0% 0% 0% 0%","0% 0% 0% 0%")};
    align-items: center;
    margin-bottom: 10%;
`

export const Title: React.FC<React.PropsWithChildren> = ({
    children
}) => <CustomText 
        color={theme.main_dark} 
        size={gobalFont.size.title} 
        style={{ marginBottom: gobalFont.size.title*0.5}}
        fontFam='DM'>
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
            marginBottom: responsiveValue(
                bottomDescription ? gobalFont.size.default*1.5:gobalFont.size.default*0.2,
                bottomDescription ? gobalFont.size.default*1.5:gobalFont.size.default*0.4,
            ),
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

