import { responsiveValue } from "@screens/globalstyle";
import { TouchableHighlight, View, Image } from "react-native";
import styled from "styled-components/native";

const AvaterWrapper = styled.TouchableHighlight<{
    width?: string;
    borderColor?: string;
}>`
    width: ${p => p.width || "100%"};
    aspect-ratio: 1;
    overflow: hidden;
    border-color: ${p => p.borderColor};
    border-width: ${p => p.borderColor ? "2.5px" : "0"};
    border-radius:  ${responsiveValue("100px","100px","300px")};
    margin-top: 2.3%;
    margin-bottom: 10%;
    margin-right: 2%;
`;

export const Avatar: React.FC<{
  onPress: () => void;
  imgURL?: string;
  width?: string;
  borderColor?: string;
}> = ({imgURL, onPress, width, borderColor}) => {
  return <View>
    <AvaterWrapper 
        width={width}
        borderColor={borderColor}
        style={{
          elevation: 8,
          backgroundColor: "#0000",
          shadowColor: "black",
          shadowOffset: { height: 10, width:10} }}
          onPress={onPress}>
        <Image 
            resizeMode="cover"
            style={{width: "100%", height: "100%"}} 
            source={{uri:  `data:image/jpeg;base64,${imgURL || ""}`}}/>
    </AvaterWrapper>
  </View>
}

export default Avatar;