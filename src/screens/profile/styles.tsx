import styled from "styled-components/native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { TouchableHighlight, View } from "react-native";

import { CustomText } from "@components/index";
import { theme } from "@screens/theme";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { useState } from "react";
import { responsiveValue } from "@screens/theme";


export const CenteredView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

export const MainWrapper = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex: ${responsiveValue(2,2.3)}; 
  width: 110%;
  padding-bottom:${responsiveValue("10%", "5%")};
  z-index: 3;
  position: relative;
`;

export const DescriptionView = styled.View`
    width: 100%;
    background-color: ${p => p.theme.secondary_background};
    justify-content: center;
    align-items: center;
    padding: 3% 5% 3% 5%;
    z-index: 0;
    position: relative;
  `;


export const ItemView = styled.View<{
  showBottomBorder: boolean;
}>`
    width: 100%;
    padding: 2.3% 0% 2.3% 0%;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width:  ${p => p.showBottomBorder ? "0.7px" : 0};;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
`

export const Button = styled.TouchableHighlight<{
  color: string
}>`
  width:${responsiveValue("55%", "40%")};
  aspect-ratio: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p => convertHexToRGBA(p.color, 0.2)};
  transform:  rotate(-90deg);
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
                <Ionicons style={{
                  position: "relative",
                  left: "0%",
                  top: responsiveValue("20%", "22%")}}
                  name="chevron-down-outline"
                  color={color}
                  size={responsiveValue(20, 22)}/>
          </Button>
      </View>

  </ItemView>
}


export const LogOutItem: React.FC<{
  onPress: () => void;
}> = ({onPress}) => {

    return <TouchableHighlight 
            activeOpacity={0.6}
            style={{borderRadius: 100, justifyContent: "center"}}
            underlayColor={theme.light_background} 
            onPress={onPress}>
              <ItemView showBottomBorder={false}>
       <View style={{flex: 5, flexDirection: "row"}}>
          <SimpleLineIcons name="logout" size={20} color={theme.tertiary_dark} />
          <CustomText>{"  Log Out"}</CustomText>
      </View>
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          
      </View>
      </ItemView>
      </TouchableHighlight>
}