import { useContext, useEffect, useMemo, useState } from "react";
import { Animated, Image, ImageBackground, Modal, TouchableHighlight, View } from "react-native";

import Avatar from "@components/avatar";
import { CustomText } from "@components/index";
import { getRandomColor } from "@components/utils";
import { User } from "@domain/User";

import { DEV_DIM, gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import GradientBackground from "@imgs/linear_gradient_background2.png";
import NewMatchMsg from "@imgs/new_match.png";
import { LoggedUserContext, UserContextType } from "@context/user";

const NewMatchView: React.FC<{
    onPress: () => void;
    match: User;
}> = ({onPress, match}) => {

    const [scaleAnim] = useState(new Animated.Value(0))  // Initial value for scale: 0
    const color = useMemo(() => getRandomColor(), [match])

    useEffect(() => {
        if (match) {
            Animated.spring(
                scaleAnim,
                {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true
                }
            ).start();
        }
    }, [match])

    const { loggedUser, setLoading } = useContext(LoggedUserContext) as UserContextType; 

    return <Modal transparent={true} visible={!!match} style={{
            height: "100%",
            justifyContent: "center", alignItems: "center"}}>
        <TouchableHighlight
                style={{
                    width: DEV_DIM.width,
                    height: DEV_DIM.height,
                    position: "absolute",
                    zIndex: 2000,
                    top: "-2%",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    right: 0,}}
                onPress={onPress}>
                <View
                    style={{
                        //transform: [{scale: scaleAnim}],
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        backgroundColor: color,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 2000,
                        alignItems: "center",
                    }}>
                        
                        <ImageBackground 
                            style={{
                                flex:1,
                                position: "absolute", 
                                width: "100%", 
                                height: "100%",}} 
                                resizeMode="cover" 
                                source={GradientBackground} />

                <View 
                    style={{
                        flexDirection: "row",
                        paddingLeft: "4%",
                        width: "100%",
                        marginBottom: responsiveValue("20%","20%","10%"),
                        justifyContent: "center"}}>
                    <Avatar 
                        width={`${DEV_DIM.width*responsiveValue(0.39, 0.30,0.20)}px`}
                        imgURL={match.photos[0].value}
                        onPress={() => {}} />
                    <Avatar 
                        width={`${DEV_DIM.width*responsiveValue(0.39, 0.30,0.20)}px`}
                        imgURL={loggedUser.photos[0].value}
                        onPress={() => {}} />

                    <Image 
                        style={{
                            position: "absolute",
                            zIndex: 1000,
                            width: responsiveValue("60%","60%","35%"), 
                            left: responsiveValue("22%","22%","37%"),
                            top: responsiveValue("48%","48%","70%"),
                            aspectRatio: 3/1}} 
                            resizeMode="contain"
                            source={NewMatchMsg} />
                </View>    
                <CustomText style={{textAlign: "center",width: "80%"}} size={gobalFont.size.default} color={theme.light_background} >{
                    "Go to your messages to start practicing!"}</CustomText>
                
            </View>
        </TouchableHighlight>
    </Modal>
}

export default NewMatchView;