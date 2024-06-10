import { Image } from "react-native";
import styled from "styled-components/native";
import Loading from "@imgs/loading_big.gif";
import { theme } from "@screens/globalstyle";

export const MainCard = styled.View`
    width:  100%;
    padding-top: 2%;
    justify-content: space-between;
    flex-direction: row;
`

export const AlbumCoverWrapper = styled.View`
    width:  45%;
    aspect-ratio: 1;
    border-radius: 15px;
    overflow: hidden;
`

export const AlbumCInfoWrapper = styled.View`
    width:  55%;
    height: auto;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding-left: 5%;
    padding-bottom: 10%;
`

export const LoadingCardView = styled.View`
    width:  100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: ${theme.secondary_background};
`

export const LoadingCard = () => {
    return <LoadingCardView>
        <Image source={Loading} resizeMode="contain" style={{width: "60%"}}/>
    </LoadingCardView>
}

