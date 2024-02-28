import styled from "styled-components/native";
import { convertHexToRGBA } from "@components/index";
import { PropsWithChildren } from "react";
import { View } from "react-native";

export const Main = styled.View<{
    color: string;
}>`
    background-color: ${p => convertHexToRGBA(p.color, 0.2)};
    width: 100%;
    padding: 8px;
    padding-left: 20px;
    overflow: hidden;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

// DisplayOptionsCard ---------------------
// to mix opacity with white
const ColorMask = styled.View<{
    color: string;
}>`
    background-color: ${p => convertHexToRGBA(p.color, 0.2)};
`
// actual shape of select modal 
export const ModalCard = styled.View`
    background-color: white;
    width: 90%;
    min-height: 70px;
    max-height: 80%;
    border-radius: 20px;
    overflow: hidden;
    justify-content: center;
`

export const Item = styled.View`
    width: "100%";
    height: 30px;
    margin: 3px; 
    border-bottom-color: "red";
    border-bottom-width: 1px
`

export const DisplayOptionsCard: React.FC<PropsWithChildren<{color: string}>> = ({children,color}) => {
    return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ModalCard>
            <ColorMask color={color}>{children}</ColorMask>
        </ModalCard>
    </View>
}
