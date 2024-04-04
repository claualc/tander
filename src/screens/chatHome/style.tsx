import { CustomText } from "@components/index";
import { View } from "react-native";
import styled from "styled-components/native";
import { theme } from "@screens/theme";

export const Title: React.FC<React.PropsWithChildren> = ({children}) => {
    return <View style={{width: "100%", flex: 2,flexDirection:"row", alignItems: "flex-end"}}>
        <CustomText>{children}</CustomText>
      </View>
}

const NoContentView = styled.View`
    width: 100%;
    flex:1;
    justify-content: flex-start;
    padding-top: 40%;
    align-items: center;
`

export const NoContent: React.FC<React.PropsWithChildren> = ({children}) => {
    return <NoContentView>
        <CustomText color={theme.tertiary_dark}>{children}</CustomText>
      </NoContentView>
}

export const ItemChatView = styled.View`
    width: 100%;
    aspect-ratio: 3.5/1;
    justify-content: flex-start;
    flex-direction: row;
    padding: 2%;
    align-items: center;
`

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

