import { CustomText } from "@components/index";
import { Dimensions, Image, TouchableHighlight, View } from "react-native";
import styled from "styled-components/native";
import { theme } from "@screens/theme";
import SmallLoading from "@assets/loading_small.gif";

export const Title: React.FC<React.PropsWithChildren> = ({children}) => {
    return <View style={{width: "100%", flex: 2,flexDirection:"row", alignItems: "flex-end"}}>
        <CustomText>{children}</CustomText>
      </View>
}

const NoContentView = styled.View`
    width: 100%;
    flex:1;
    justify-content: flex-start;
    padding-top: 15%;
    align-items: center;
`

export const NoContent: React.FC<React.PropsWithChildren<{
    loading: boolean;
}>> = ({children, loading}) => {
    return <NoContentView>
        {
            loading ? <View style={{ aspectRatio:1, height: Dimensions.get("screen").width*0.2, zIndex: 10 }}>
                <Image source={SmallLoading} style={{ flex: 1 }} />
            </View> :
            <CustomText color={theme.tertiary_dark}>{children}</CustomText>
        }
      </NoContentView>
}

const ItemChatView = styled.View`
    width: 100%;
    aspect-ratio: 3.5/1;
    justify-content: flex-start;
    flex-direction: row;
    padding: 2%;
    align-items: center;
`

export const ItemChat: React.FC<React.PropsWithChildren<{
    onPress: () => void
}>> = ({children, onPress}) => {
    return <TouchableHighlight
        activeOpacity={0.6}
        onPress={onPress}
        underlayColor="#0000"
        style={{
            width: "100%",
        }}>
            <ItemChatView>{children}</ItemChatView>

    </TouchableHighlight>
}

export const ItemChatImg = styled.View`
    width: 100%;
    height: 100%;
    align-items: center;
    flex: 2;
`

export const ItemChatDescription = styled.View`
    width: 100%;
    height: 100%;
    padding: 5%;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width: 0.7px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    flex: 6;
`

export const UnreadChatAlert = styled.View`
    width: 5%;
    aspect-ratio: 1;
    border-radius: 100px;
    background-color: ${p => p.theme.main};
`

