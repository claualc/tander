import styled from "styled-components/native";
import Gradient from "@imgs/linear_gradient_background.png"
import React from "react";
import { Dimensions, ImageBackground, TextInput, TouchableHighlight, View, ViewBase } from "react-native";
import { CustomSelectView } from "@components/selects/select/style";
import { gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@components/index";
import { getYYYYMMDDFromDate } from "@components/utils";

export const HeaderInfo: React.FC<{
    photoUrl?: string;
    username?: string;
    onPressBackButton?: () => void;
}> = ({photoUrl, username, onPressBackButton}) => {
    return <Header 
            style={{
                elevation: 8,
                zIndex:0,
                backgroundColor: "white",
                shadowColor: "black",
                shadowOffset: { height: 10, width:10} }}>
        <View style={{flex: 1,
            paddingBottom: responsiveValue("2%","3%","3%"), 
            height: "100%", 
            justifyContent: "flex-end", alignItems: "center"}}>
                <Ionicons 
                    onPress={onPressBackButton}
                    name={"chevron-back-outline"} 
                    color={theme.main_background}
                    size={gobalFont.size.title} />
        </View>
        <View style={{ flex: 4, height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "flex-end"}}>
          <View style={{width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <View style={{ marginRight: "4%", overflow: "hidden", width: responsiveValue("20%", "20%", "15%"), aspectRatio: 1, borderRadius: 300}}>
                <ImageBackground 
                    style={{flex: 1}}
                    source={{uri:  `data:image/jpeg;base64,${photoUrl || ""}`}}/>
            </View>
            <CustomText>{username}</CustomText>
          </View>
        </View>
        <View style={{flex: 2, height: "100%"}} />
    </Header>

}

export const ChatContent = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: ${responsiveValue(0, "4%","4%")};
    flex: ${responsiveValue(17, 60, 60)};
`

export const Header = styled.View`
    width: 110%;
    top: ${responsiveValue("-8%", 0, 0)};
    position: relative;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex: ${responsiveValue(4.5, 20,30)};
    padding-bottom: ${responsiveValue("6%", "3%","3%")};
`

export const ChatInput = styled.View`
    padding: ${responsiveValue("8% 5% 8% 5%","8% 5% 8% 5%","4% 5% 5% 5%")};
    width: 100%;
    justify-content: center;
    align-items: center;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`

export const NoContentIcon = styled.View`
    width: ${responsiveValue("30%","30%","17%")};
    aspect-ratio: 1;
    border-radius: 100px;
    position: relative;
    overflow: hidden;
    left: ${responsiveValue("34%","34%","-6%")};
    top: ${responsiveValue("0%","0%","63%")};
    z-index: 3;
`

export const NoContentView = styled.View`
    border-color: ${p => p.theme.tertiary_dark};
    border-width: 2.5px;
    border-style: dashed;
    border-radius: 25px;
    text-align: center;
    position: relative;
    padding: ${responsiveValue("20% 5% 10% 5%","20% 5% 10% 5%","5% 5% 3% 3%")};
    z-index: 0;
    top: -7%;
`

export const NoContent: React.FC<React.PropsWithChildren> = ({children}) => {
    return <View style={{width: responsiveValue("65%","50%","50%"), position: "relative", top:"-7%"}}>
            <NoContentIcon style={{
                elevation: 8,
                backgroundColor: "#0000",
                shadowColor: "black",
                shadowOffset: { height: 10, width:10} }}>
                <ImageBackground
                        resizeMode='cover'
                        source={Gradient}
                        style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Ionicons name="rocket" size={40} color={theme.light_background} />
                </ImageBackground>
            </NoContentIcon>
            <NoContentView>
                    <CustomText style={{textAlign: "center", marginBottom: "5%"}}>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}>{"In italian, you can start a conversation with "}</CustomText>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}  fontFam="BD">ciao, salve o ehi!</CustomText>
                    </CustomText>
                    <CustomText style={{textAlign: "center", marginBottom: "9%"}}>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}>{"To continue, ask also "}</CustomText>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}  fontFam="BD">come stai?</CustomText>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}>{" to know how your match is feeling."}</CustomText>
                    </CustomText>
                    <CustomText style={{textAlign: "center"}}>
                        <CustomText size={gobalFont.size.default*1.1} color={theme.tertiary_dark}  fontFam="BD">Give a try!</CustomText>
                    </CustomText>
                
            </NoContentView>
        </View>
}

export const SendMessageButton: React.FC<{
    onPress: () => void;
}> = ({onPress}) => {
    return <TouchableHighlight
                onPress={onPress}
                style={{
                    width: responsiveValue("20%","15%","13%"),
                    aspectRatio: responsiveValue("1.6/1", "2/1", "2.2/1"),
                    overflow: "hidden",
                    borderRadius: Dimensions.get("window").width*0.1,
                }}>
                <ImageBackground 
                    resizeMode='cover' 
                    style={{ 
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }} source={Gradient}>

                        <Ionicons name="send" size={gobalFont.size.title*0.7} color={theme.light_background}/>
                    </ImageBackground>
            </TouchableHighlight>
}

export const TextInputChat: React.FC<{
    onChange: (v: string) => void;
    value: string;
    placeholder?: string;
}> = ({onChange, value, placeholder}) => {
    return <>
        <CustomSelectView width={responsiveValue("77%","82%","82%") }
        aspectRatio={responsiveValue("6/1","10/1","14/1")} color={theme.tertiary_dark}>
        <TextInput 
            selectionColor={theme.tertiary_dark}
            onChangeText={onChange}
            value={value}
            style={{fontSize: gobalFont.size.default}}
            placeholder={placeholder || ""}
            />
        </CustomSelectView>
    </>
}

const getBorderRadiousOfmsg = (ofLoggedUser: boolean, firstInBatch: boolean) => {
    const padding = responsiveValue(15,15,15)
    switch(true) {
        case ofLoggedUser && firstInBatch:
            return `${padding}px ${padding}px 0px ${padding}px`
        case ofLoggedUser && !firstInBatch:
            return `${padding}px 0px 0px ${padding}px`
        case !ofLoggedUser && firstInBatch:
            return  `${padding}px ${padding}px ${padding}px 0px`
        case !ofLoggedUser && !firstInBatch:
            return `0px ${padding}px ${padding}px 0px`
    }
}

const MessageView = styled.View<{
    ofLoggedUser: boolean;
    firstMsgInBatch: boolean;
}>`
    width: fit-content;
    background-color: ${p => p.ofLoggedUser ? p.theme.tertiary : p.theme.secondary_background};
    padding: 1.5% 4% 1.5% 4%;
    margin: ${p => p.firstMsgInBatch ? "2% 5% 0.5% 5%": "0.5% 5% 0.5% 5%"};
    border-radius: ${({ofLoggedUser, firstMsgInBatch}) => getBorderRadiousOfmsg(ofLoggedUser,firstMsgInBatch)};
`;

export const Message: React.FC<{
    ofLoggedUser: boolean;
    firstMsgInBatch: boolean;
    value: string;
}> = ({value, ...rest}) => {
    return <View style={{
        flexDirection: "row",
        justifyContent: rest.ofLoggedUser ? "flex-end" : "flex-start",
        width:"100%",
        }}>
            <MessageView {...rest}>
                <CustomText 
                    size={gobalFont.size.default}
                    style={{textAlign:rest.ofLoggedUser ? "right" : "left"}} 
                    color={rest.ofLoggedUser ? theme.light_background : theme.main_background}
                        >{value}</CustomText>
            </MessageView>
        </View> 
}

const getDateStringInfo = (v: string) => {
    const date = new Date(v);
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate()-1)
    return (getYYYYMMDDFromDate(date)==getYYYYMMDDFromDate(today)) ?
        "Today" : (getYYYYMMDDFromDate(date)==getYYYYMMDDFromDate(yesterday)) ?
            "Yesterday" : date.toDateString()
}

export const TimesStampInfo: React.FC<{
    value: string; // YYYY-MM-DD
}> = ({value}) => {
    return <View style={{ width:"100%", justifyContent: "center", alignItems: "center" }}>
                <CustomText 
                    color={theme.tertiary_dark}
                    fontFam="MD"
                    size={gobalFont.size.default*0.8}
                        >{getDateStringInfo(value)}</CustomText>
        </View> 
}