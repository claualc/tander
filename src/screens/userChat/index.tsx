import { CustomText, ScreenView } from "@components/index";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { routeNames, stackGetParams, stackNavigateTo } from "../stackNavigator";
import { ChatContent, ChatInput, HeaderInfo, Message, NoContent, SendMessageButton, TextInputChat, TimesStampInfo } from "./style";
import { LoggedUserContext, UserContextType } from "../context";
import { UserMAtchInfoDTO } from "@serv/matchServices";
import chatServices, { ChatDTO, addNewMsgToMsgObject, messagesObject } from "@serv/chatServices";
import { ScrollView, View } from "react-native";

export interface ChatParams {
  matchInfo: UserMAtchInfoDTO;
  chat: ChatDTO;
}

const ChatMessagingScreen = () => {

  const { loggedUser, setShowBottomNav } = useContext(LoggedUserContext) as UserContextType; 

  const [matchInfo, setMAtchInfo] = useState<UserMAtchInfoDTO>();
  const [chatDTO, setChatDTO] = useState<ChatDTO>();

  const [newMesage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<messagesObject>({});


  const sendMessage = useCallback(async () => {
    if (chatDTO && matchInfo && newMesage) {
      let msg = await chatServices.sendMessage(newMesage, chatDTO, matchInfo)
      setMessages(
        addNewMsgToMsgObject(messages, msg)
      )
      setNewMessage("");
    }
  }, [newMesage, chatDTO, matchInfo, messages])

  const goBack = useCallback(() => {
    setShowBottomNav(true)
    stackNavigateTo(routeNames.CHAT_SCREEN)
  }, []);

  useEffect(() => {
    //stackNavigateTo(routeNames.CHAT_SCREEN)
    setShowBottomNav(false)
    const params = stackGetParams() as ChatParams
    setMAtchInfo(params?.matchInfo)
    setChatDTO(params?.chat)
    setMessages(params?.chat.messages)
    return () => goBack()
  }, [])
  return <ScreenView style={{zIndex: 0}}>
    <HeaderInfo 
      photoUrl={matchInfo?.targetUser.profilePhoto.value}
      username={matchInfo?.targetUser.username}
      onPressBackButton={goBack}/>
      
    <ChatContent>
      {
         !Object.keys(messages).length ?
          <NoContent />
         : <ScrollView style={{width: "100%"}}>
          {
            Object.keys(messages).map((day, i) => {
              let daylyMsgs = messages[day]
              return <View key={i}>
                <TimesStampInfo value={day}/>
                { daylyMsgs.map((msg, id) => <Message
                      key={id}
                      ofLoggedUser={msg.user == loggedUser.id}
                      firstMsgInBatch={id==0 || daylyMsgs[id-1].user != daylyMsgs[id].user}
                      value={msg.value} />
                  )}
              </View>
            })
          }
         </ScrollView>
      }

    </ChatContent>
    <ChatInput>
      <TextInputChat
        placeholder="Write something..."
        value={newMesage} 
        onChange={setNewMessage}/>
      
      <SendMessageButton 
        onPress={sendMessage} />
    </ChatInput>
  </ScreenView>;
}

export default ChatMessagingScreen;
