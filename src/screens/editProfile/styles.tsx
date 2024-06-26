import styled from "styled-components/native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { TouchableHighlight, View } from "react-native";

import { CustomText } from "@components/index";
import { gobalFont, theme } from "@screens/globalstyle";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { useState } from "react";
import { responsiveValue } from "@screens/globalstyle";


export const CenteredView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

export const MainWrapper = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex: ${responsiveValue(1.9,2.3,2.3)}; 
  width: 110%;
  padding-bottom:${responsiveValue("7%", "5%","2%")};
  margin-top:${responsiveValue("0%", "0%","5%")};
  z-index: 3;
  position: relative;
`;

export const DescriptionView = styled.View`
    width: 100%;
    background-color: ${p => p.theme.secondary_background};
    justify-content: center;
    align-items: center;
    padding: ${responsiveValue("3% 5% 3% 5%","3% 5% 3% 5%","1% 3% 1% 2%")};
    margin-bottom: ${responsiveValue(0,0,"1%")};
    z-index: 0;
    position: relative;
  `;


export const ItemView = styled.View<{
  showBottomBorder: boolean;
}>`
    width: 100%;
    padding: ${responsiveValue("4% 0% 4% 0%","2.3% 0% 2.3% 0%","2.5% 0% 2.5% 0%")};
    border-color: ${p => p.theme.secondary_background};
    border-bottom-width:  ${p => p.showBottomBorder ? "0.7px" : 0};;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
`

export const Button = styled.View<{
  color: string
}>`
  width:${responsiveValue("55%", "40%","45%")};
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

    return <TouchableHighlight   
        onPress={onPress}
        style={{
          width: responsiveValue("100%","100%","50%")
        }}
        activeOpacity={0.6}
        underlayColor="#0000">
      <ItemView showBottomBorder={!noBorder}>
        <View style={{flex: 5, flexDirection: "row"}}>
            <SimpleLineIcons name={icon as any} size={gobalFont.size.title*0.8} color={theme.tertiary_dark} />
            <CustomText>{`  ${title}`}</CustomText>
        </View>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button 
              style={{borderRadius: 100}}
              color={color} >
                  <Ionicons style={{
                    position: "relative",
                    left: "0%",
                    top: responsiveValue("20%", "22%","20%")}}
                    name="chevron-down-outline"
                    color={color}
                    size={responsiveValue(20, 22,32)}/>
            </Button>
        </View>
  </ItemView>
  </TouchableHighlight>
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
          <SimpleLineIcons name="logout" size={gobalFont.size.title*0.8} color={theme.tertiary_dark} />
          <CustomText>{"  Log Out"}</CustomText>
      </View>
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          
      </View>
      </ItemView>
      </TouchableHighlight>
}