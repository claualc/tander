import { Dimensions, ScrollView, Text, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";

import { CustomText, ScreenView } from "@components/index";
import matchServices, { UserMAtchInfoDTO } from "@serv/matchServices";
import { LoggedUserContext, UserContextType } from "@screens/context";
import { Avatar } from "@components/avatar";
import { ItemChatDescription, ItemChatImg, ItemChatView, NoContent, Title, UnreadChatAlert } from "./style";
import { routeNames, stackNavigateTo } from "../stackNavigator";
import { ChatParams } from "../userChat";
import chatServices, { ChatDTO } from "@serv/chatServices";


const ChatScreen = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType; 
  
  const [newMatchesDTOs, setNewMatchesDTOs] = useState<UserMAtchInfoDTO[]>([]);
  const [chatDTOs, setChatDTOs] = useState<UserMAtchInfoDTO[]>([]);

  useEffect(() => {
    (async () => {
        if (loggedUser.id) {
        const matchedUsers = await matchServices.listMatches(loggedUser.id)
        setNewMatchesDTOs(matchedUsers.filter(m => !m.match.chatId))
        setChatDTOs(matchedUsers.filter(m => !!m.match.chatId))
      }
    })()
  },[loggedUser])

  const openChat = useCallback(async (info: UserMAtchInfoDTO) => {
    

    let chatDTO: ChatDTO;
    if (info.match.chatId) {

    } else {
      chatDTO = await chatServices.create(info.match)
      let params: ChatParams = { matchInfo: info, chat: chatDTO}
      stackNavigateTo(routeNames.CHAT_MESSAGING_SCREEN, params)
    }

  }, []);

  return <ScreenView style={{paddingLeft: "5%", paddingRight: "5%", paddingTop: "20%"}}>
    <View style={{ flex: 3, width: "100%",flexDirection: "column"}}>
      <Title>New Matches</Title>
      <View style={{ flex: 6, overflow: "hidden"}}>
      {
        !newMatchesDTOs.length ? 
          <NoContent>{"no new matches 💔"}</NoContent> 
          : <ScrollView 
                horizontal={true}
                contentContainerStyle={{flexDirection: "row", alignItems: "center"}}>
                {
                  newMatchesDTOs.map((u, i) => <View key={i} style={{marginRight: Dimensions.get("screen").width*0.03}} >
                    <Avatar 
                      width={`${Dimensions.get("screen").width*0.2}px`}
                      imgURL={u.profilePhoto.value}
                      onPress={() => {openChat(u)}} />
                    </View>)
                }
              </ScrollView>
      }
      </View>
    </View>
    <View style={{flex: 9, width: "100%", flexDirection: "column"}}>
      <Title>Messages</Title>
      <View style={{overflow: "hidden", flex: 28}}>
        {
          !chatDTOs.length ? 
            <NoContent>{"talk with someone!!"}</NoContent>
            : <ScrollView>
              {
                  chatDTOs.filter(m => !!m.match.chatId)
                    .map((u, i) => <ItemChatView key={i}>
                    <ItemChatImg>
                      <Avatar 
                        imgURL={u.profilePhoto.value}
                        onPress={() => {}} />
                    </ItemChatImg>
                    <ItemChatDescription style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <CustomText>{u.username}</CustomText>
                      <UnreadChatAlert />
                    </ItemChatDescription>
                  </ItemChatView>)
              }
            </ScrollView>
        }
      </View>
    </View>
  </ScreenView>;
}

export default ChatScreen;
