import { CustomText } from "@components/index";
import NewMAtchImg from "@imgs/loading.gif";
import { useEffect, useState } from "react";
import { Animated, Image, TouchableHighlight, View } from "react-native";

const NewMatchView: React.FC<{
    onPress: () => void;
    show: boolean;
}> = ({onPress, show}) => {

    const [scaleAnim] = useState(new Animated.Value(0))  // Initial value for scale: 0

    useEffect(() => {
        if (show) {
            Animated.spring(
                scaleAnim,
                {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true
                }
            ).start();
        }
    }, [show])

    return show ? <TouchableHighlight
                style={{
                    flex:1,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 2000,
                    top: 0,
                    right: 0,}}
                onPress={onPress}>
                <View
                    style={{
                        //transform: [{scale: scaleAnim}],
                        width: "100%",
                        height: "100%",
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                <CustomText>NEW MATTTCH</CustomText>
                <Image source={NewMAtchImg} style={{ width: "40%", height: "40%" }} />
        </View>
    </TouchableHighlight>
    : <></>
}

export default NewMatchView;