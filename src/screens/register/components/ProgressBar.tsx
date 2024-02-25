import { DimensionValue, Image, View } from "react-native";
import styled from "styled-components/native";
import Gradient from "@assets/linear_gradient_background.png";


export const ProgressBar: React.FC<{
    percentage: number // from 0 to 100
}> = ({percentage}) => {
    return <ProgresBarWrapper>
     <Image style={{
            width: "100%",
            height: "100%",
            position: "relative",
        }}
        source={Gradient}>
    </Image>  
    <Progress width={percentage}/>
    </ProgresBarWrapper>
};

const ProgresBarWrapper = styled.View`
    width: 100%;
    height: 8px;
`
const Progress = styled.View<{width: number}>`
    background-color: ${props => props.theme.secondary_background};
    width: ${p => `${p.width}%`};
    height: 100%;
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
`
