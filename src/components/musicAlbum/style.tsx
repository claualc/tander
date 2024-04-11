import styled from "styled-components/native";

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

export const LoadingCard = styled.View`
    background-color: blue;
    width:  100%;
    aspect-ratio: 2/1;
`

export const ErrorCard = styled.View`
    background-color: red;
    width:  45%;
    aspect-ratio: 1;
`