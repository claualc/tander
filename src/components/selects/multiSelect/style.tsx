import styled from "styled-components/native";
import { convertHexToRGBA } from "../../utils";

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


export const DisplayOptionsCard = styled.View<{
    color: string;
}>`
    background-color: ${p => convertHexToRGBA(p.color, 1)};
    width: 90%;
    height: 90%;
    position: absolute;
    top: 5%;
    left: 5%;
    flex: 1;
    border-radius: 20px;
`
