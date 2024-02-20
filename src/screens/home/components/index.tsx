import { Wrapper } from "@components/index";
import styled from "styled-components/native";

interface ChipProps {
    photoCount: number;
    currentPhoto: boolean;
}

const chipMaxWidth = 95;
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

interface colorProp {
    color: string;
}
// export const SwipePhotoButton = styled.Button<colorProp>`
//     opacity: 1;
//     width: 100%;
//     height: 100%;
//     background-color: color;
//     z-index: 4;
//     position: absolute;
// `

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

export const UserDescWrapper = styled(Wrapper)`
    margin-top: 145%; 
    padding: 10% 7% 0% 7%; 
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    
`

export const UserDecSections = styled.View`
    width: "100%";
    align-items: flex-start;
    flex-direction: row;
`

export const Section = styled.View`
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
`
