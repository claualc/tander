import { ScrollView, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";

import { CustomText, ScreenView, ScrollDownAlarm } from "@components/index";
import matchServices, { UserMAtchInfoDTO } from "@serv/matchServices";
import { LoggedUserContext, UserContextType } from "@context/user";
import { Avatar } from "@components/avatar";
import { ItemChat, ItemChatDescription, ItemChatImg, NoContent, Title, UnreadChatAlert } from "./style";
import { ChatParams } from "../userChat";
import chatServices from "@serv/chatServices";
import { ChatDTO, MessageDTO, MsgStates } from "@serv/chatServices/DTOs";
import { stackNavigateTo } from "@screens/stackNavigator/navigateService";
import { routeNames } from "@screens/stackNavigator/routes";
import { DEV_DIM, gobalFont, responsiveValue } from "@screens/globalstyle";


const ChatScreen = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType; 
  
  const [newMatchesDTOs, setNewMatchesDTOs] = useState<UserMAtchInfoDTO[]| null>(null);
  const [chatDTOs, setChatDTOs] = useState<UserMAtchInfoDTO[] | null>(null);
  const [chatsLastsMsgs, setChatsLastsMsgs] = useState<MessageDTO[]>([]);

  useEffect(() => {
    
    (async () => {
        if (loggedUser.id) {
        const matchedUsers = await matchServices.listUsersMatchedAsTrue(loggedUser)
        setNewMatchesDTOs(matchedUsers.filter(m => !m.match.chatId))
        let chats = matchedUsers.filter(m => !!m.match.chatId)
        setChatDTOs(chats)
        setChatsLastsMsgs(new Array(chats?.length).fill({}))
      }
    })()
  },[])

  useEffect(() => {
    // non required - to load after
    (async () => {
      let lastMsgsProm = chatDTOs?.map(
        async (m) => m.match.chatId ?
          await chatServices.getLastMsgChat(m.match.chatId)
          : {} as MessageDTO) || []
      let lastMsgs = await Promise.all(lastMsgsProm)

      if (lastMsgs && lastMsgs?.length)
        setChatsLastsMsgs(lastMsgs)
      })();
  },[chatDTOs])

  const openChat = useCallback(async (info: UserMAtchInfoDTO) => {
    let chatDTO: ChatDTO;
    let params: ChatParams;
    if (info.match.chatId) {
      chatDTO = await chatServices.getById(info.match.chatId)
      params = { matchInfo: info, chat: chatDTO}
    } else {
      chatDTO = await chatServices.create(info.match)
      params = { matchInfo: info, chat: chatDTO}
    }
    stackNavigateTo(routeNames.CHAT_MESSAGING_SCREEN, params)

    if (chatDTOs)
      setChatsLastsMsgs(chatDTOs.map((c, i) => {
        let msg = chatsLastsMsgs[i]
        if (c.match.chatId == chatDTO.id){
          msg.state = MsgStates.READ
        }
        return msg
      }))
  }, []);

  return <ScreenView style={{
    paddingLeft: "5%", 
    paddingRight: "5%", 
    paddingTop: responsiveValue("15%", "5%","5%")}}>
    <View style={{ 
        flex: responsiveValue(3.5, 4,9), width: "100%",flexDirection: "column"}}>
      <Title>New Matches</Title>
      <View style={{ flex: 6, overflow: "hidden"}}>
      {
        !newMatchesDTOs?.length ?
          <NoContent
              paddingTop={responsiveValue("9%","7%","7%")}
              imgSize={responsiveValue("65%","110%","60%")}
              loading={newMatchesDTOs==null}>
                {"no new matches 💔"}
          </NoContent> 
          : <ScrollView
                showsHorizontalScrollIndicator={false} 
                horizontal={true}
                style={{flex: 1}}
                contentContainerStyle={{
                  flexDirection: "row", 
                  paddingRight: `${DEV_DIM.width*0.01}%`,
                  alignItems: "center"}}>
                {
                  newMatchesDTOs.map((info, i) => <View key={i} style={{alignItems: "center"}} >
                    <Avatar 
                      width={`${DEV_DIM.width*responsiveValue(0.2, 0.12,0.1)}px`}
                      imgURL={info.targetUser.profilePhoto.value}
                      onPress={() => {openChat(info)}} />
                      <CustomText size={gobalFont.size.default*responsiveValue(0.9,0.9,1)}>{info.targetUser.username}</CustomText>
                    </View>)
                }
              </ScrollView>
      }
      </View>
    </View>
    <ScrollDownAlarm 
        bottom={responsiveValue("7%","7%","7%")}
        width={responsiveValue("","","6%")}
        left={responsiveValue("90%","90%","88%")}
        show={!!chatDTOs && chatDTOs?.length >= responsiveValue(6,6,2)}/>

    <View style={{flex: responsiveValue(9, 9, 9), width: "100%", flexDirection: "column"}}>
      <Title>Messages</Title>
      <View style={{overflow: "hidden", flex: responsiveValue(28,28,10)}}>
        {
          !chatDTOs?.length ?
          <NoContent
              paddingTop={responsiveValue("20%","8%","2%")}
              imgSize={responsiveValue("19%","30%","40%")}
              loading={chatDTOs==null}>
                {"talk with someone!!"}
            </NoContent>
            : <ScrollView>
              {
                  chatDTOs?.filter(m=> !!m.match.chatId)
                    .map((info, i) => <ItemChat key={i} onPress={() => openChat(info)}>
                    <ItemChatImg>
                      <Avatar 
                        width={`${DEV_DIM.width*responsiveValue(0.17, 0.13,0.1)}px`}
                        imgURL={info.targetUser.profilePhoto.value}
                        onPress={() => {}} />
                    </ItemChatImg>
                    <ItemChatDescription style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <CustomText size={gobalFont.size.default}>{info.targetUser.username}</CustomText>
                      { (chatsLastsMsgs[i] && chatsLastsMsgs[i].state==MsgStates.UNREAD &&  chatsLastsMsgs[i].user != loggedUser.id) ?
                         <UnreadChatAlert /> : <></>}
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
