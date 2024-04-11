import { Image } from "react-native";
import styled from "styled-components/native";
import Gradient from "@imgs/linear_gradient_background.png";


export const ProgressBar: React.FC<{
    percentage: number // from 0 to 100
}> = ({percentage}) => {
    return <Main>
     <Image style={{
            width: "100%",
            height: "100%",
            position: "relative",
        }}
        source={Gradient} />
    <Progress width={percentage}/>
    </Main>
};

const Main = styled.View`
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

export const ProgressBarWrapper = styled.View`
    flex: 2;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
`
