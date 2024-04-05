import { Dimensions, ScrollView, Text, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";

import { CustomText, ScreenView } from "@components/index";
import matchServices, { UserMAtchInfoDTO } from "@serv/matchServices";
import { LoggedUserContext, UserContextType } from "@screens/context";
import { Avatar } from "@components/avatar";
import { ItemChat, ItemChatDescription, ItemChatImg, NoContent, Title, UnreadChatAlert } from "./style";
import { routeNames, stackNavigateTo } from "../stackNavigator";
import { ChatParams } from "../userChat";
import chatServices, { ChatDTO } from "@serv/chatServices";


const ChatScreen = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType; 
  
  const [newMatchesDTOs, setNewMatchesDTOs] = useState<UserMAtchInfoDTO[]| null>(null);
  const [chatDTOs, setChatDTOs] = useState<UserMAtchInfoDTO[] | null>(null);

  useEffect(() => {
    (async () => {
        if (loggedUser.id) {
        const matchedUsers = await matchServices.listMatches(loggedUser)
        setNewMatchesDTOs(matchedUsers.filter(m => !m.match.chatId))
        setChatDTOs(matchedUsers.filter(m => !!m.match.chatId))
      }
    })()
  },[loggedUser])

  const openChat = useCallback(async (info: UserMAtchInfoDTO) => {
    let chatDTO: ChatDTO;
    if (info.match.chatId) {
      chatDTO = await chatServices.getById(info.match.chatId)
      let params: ChatParams = { matchInfo: info, chat: chatDTO}
      stackNavigateTo(routeNames.CHAT_MESSAGING_SCREEN, params)
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
        !newMatchesDTOs?.length ? 
          <NoContent loading={newMatchesDTOs==null}>{"no new matches 💔"}</NoContent> 
          : <ScrollView 
                horizontal={true}
                contentContainerStyle={{flexDirection: "row", alignItems: "center"}}>
                {
                  newMatchesDTOs.map((info, i) => <View key={i} style={{marginRight: Dimensions.get("screen").width*0.03, justifyContent: "center"}} >
                    <Avatar 
                      width={`${Dimensions.get("screen").width*0.2}px`}
                      imgURL={info.targetUser.profilePhoto.value}
                      onPress={() => {openChat(info)}} />
                      <CustomText>{info.targetUser.username}</CustomText>
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
          !chatDTOs?.length ? 
            <NoContent loading={chatDTOs==null}>{"talk with someone!!"}</NoContent>
            : <ScrollView>
              {
                  chatDTOs?.filter(m => !!m.match.chatId)
                    .map((info, i) => <ItemChat key={i} onPress={() => openChat(info)}>
                    <ItemChatImg>
                      <Avatar 
                        imgURL={info.targetUser.profilePhoto.value}
                        onPress={() => {}} />
                    </ItemChatImg>
                    <ItemChatDescription style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <CustomText>{info.targetUser.username}</CustomText>
                      <UnreadChatAlert />
                    </ItemChatDescription>
                  </ItemChat>)
              }
            </ScrollView>
        }
      </View>
    </View>
  </ScreenView>;
}

export default ChatScreen;
