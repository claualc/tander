import styled from "styled-components/native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image, TouchableHighlight, View } from "react-native";

import { CustomText } from "@components/index";
import { theme } from "@screens/theme";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { useState } from "react";


export const CenteredView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

export const MainWrapper = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex: 2; 
  width: 110%;
  padding-bottom: 10%;
  z-index: 3;
  position: relative;
`

const AvaterWrapper: typeof TouchableHighlight = styled.TouchableHighlight`
    width: 35%;
    aspect-ratio: 1;
    overflow: hidden;
    border-color: ${p => p.theme.main};
    border-width: 2.5px;
    border-radius: 1000px;
`;


const EditButton = styled.View`
    width: 11%;
    text-align: center;
    aspect-ratio: 1;
    background-color: ${p => p.theme.main};
    justify-content: center;
    align-items: center;
    
`;

export const Avatar: React.FC<{
  onPress: () => void;
  imgURL?: string;
}> = ({imgURL, onPress}) => {
  return <View>
    <AvaterWrapper 
      style={{
        elevation: 10,
        backgroundColor: "#0000",
        shadowColor: "black",
        shadowOffset: { height: 10, width:10} }}
        onPress={onPress}>
        <Image 
            resizeMode="cover"
            style={{flex:1}} 
            source={{uri:  `data:image/jpeg;base64,${imgURL || ""}`}}/>
    </AvaterWrapper>
    {/* <EditButton>
      <Ionicons name="brush-outline" size={20}/>
    </EditButton> */}
  </View>
}

export const DescriptionView = styled.View`
    width: 100%;
    aspect-ratio: 6/1;
    background-color: ${p => p.theme.secondary_background};
    justify-content: center;
    align-items: center;
    z-index: 0;
    position: relative;
`;


export const ItemView = styled.View<{
  showBottomBorder: boolean;
}>`
    width: 100%;
    aspect-ratio: 5/1;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width:  ${p => p.showBottomBorder ? "0.7px" : 0};;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
`

export const Button = styled.TouchableHighlight<{
  color: string
}>`
  width: 55%;
  aspect-ratio: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p => convertHexToRGBA(p.color, 0.2)};
  transform:  rotate(-90deg);
`

const Centered = styled.View`
  text-align: center;
  width: 100%;
  height: 100%;
`

interface Props {
  title: string;
  onPress: () => void;
  icon: string;
  noBorder?: boolean;
}

export const Item: React.FC<Props> = ({title, icon, onPress, noBorder=false}: Props) => {

  const [color, setColor] = useState(getRandomColor);

    return <ItemView showBottomBorder={!noBorder}>
      <View style={{flex: 5, flexDirection: "row"}}>
          <SimpleLineIcons name={icon as any} size={20} color={theme.tertiary_dark} />
          <CustomText>{`  ${title}`}</CustomText>
      </View>
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Button 
            activeOpacity={0.6}
            underlayColor="#0000"
            style={{borderRadius: 100}}
            color={color} 
            onPress={onPress}>
                <Ionicons style={{position: "relative", left: "0%", top: "20%"}} name="chevron-down-outline" color={color} size={20}/>
          </Button>
      </View>

  </ItemView>
}