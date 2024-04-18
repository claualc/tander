import Avatar from "@components/avatar";
import { CustomText } from "@components/index";
import { getRandomColor } from "@components/utils";
import { User } from "@domain/User";
import { DEV_DIM, gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import { useEffect, useMemo, useState } from "react";
import { Animated, Modal, TouchableHighlight, View } from "react-native";

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

    return <Modal transparent={true} visible={!!match} style={{justifyContent: "center", alignItems: "center"}}>
        <TouchableHighlight
                style={{
                    width: DEV_DIM.width,
                    height: DEV_DIM.height,
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
                        justifyContent: "center",
                        backgroundColor: color,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 2000,
                        alignItems: "center",
                    }}>
                <CustomText style={{marginBottom: responsiveValue(10, 20)}} size={gobalFont.size.title} color={theme.light_background}>NEW MAAAAAATCH</CustomText>
                <Avatar 
                      width={`${DEV_DIM.width*responsiveValue(0.40, 0.30)}px`}
                      imgURL={match.photos[0].value}
                      onPress={() => {}} />
                <CustomText size={gobalFont.size.title} color={theme.light_background} >{match.username}</CustomText>
            </View>
        </TouchableHighlight>
    </Modal>
}

export default NewMatchView;