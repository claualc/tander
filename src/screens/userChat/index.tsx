import { CustomText, ScreenView } from "@components/index";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContent, ChatInput, HeaderInfo, Message, NoContent, SendMessageButton, TextInputChat, TimesStampInfo } from "./style";
import { UserMAtchInfoDTO } from "@serv/matchServices";
import chatServices from "@serv/chatServices";
import { ChatDTO, MsgStates } from "@serv/chatServices/DTOs";
import { ScrollView, View } from "react-native";
import { LoggedUserContext, UserContextType } from "@context/user";
import { stackGetParams, stackNavigateTo } from "@screens/stackNavigator/navigateService";
import { routeNames } from "@screens/stackNavigator/routes";

export interface ChatParams {
  matchInfo: UserMAtchInfoDTO;
  chat: ChatDTO;
}

interface MessageUI {
  // the key is the day
  ofLoggedUser: boolean;
  firstMsgInBatch: boolean;
  value: string;
}

const ChatMessagingScreen = () => {

  const { loggedUser, setShowBottomNav } = useContext(LoggedUserContext) as UserContextType; 

  const [matchInfo, setMAtchInfo] = useState<UserMAtchInfoDTO>();
  const [chatDTO, setChatDTO] = useState<ChatDTO>({} as ChatDTO);

  const [newMesage, setNewMessage] = useState<string>("");

  const messages: {[key: string]: MessageUI[]} = useMemo(() => {
    let updatedReadMsgsChatDTO: ChatDTO = chatDTO || {} as ChatDTO
    let msgs=  chatDTO?.messages ?
      Object.keys(chatDTO?.messages).reduce(
        (acc,day: string) => {
          let msgs = chatDTO?.messages[day]
          let daylyMsgs: MessageUI[] = msgs.map((msg, id) => {
            updatedReadMsgsChatDTO.messages[day][id].state = MsgStates.READ
            return {
            ofLoggedUser: msg.user == loggedUser.id,
            firstMsgInBatch: id==0 || msgs[id-1].user != msgs[id].user,
            value: msg.value
            } as MessageUI 
          })
        return {
          ...acc,
          [day]: daylyMsgs
        }
    }, {}) : {}
    setChatDTO(updatedReadMsgsChatDTO)
    return msgs
  }, [chatDTO])


  const sendMessage = useCallback(async () => {
    if (chatDTO && matchInfo && newMesage) {
      await chatServices.sendMessage(newMesage, chatDTO, matchInfo)
      setNewMessage("");
    }
  }, [newMesage, chatDTO, matchInfo, messages])

  const goBack = useCallback(() => {
    setShowBottomNav(true)
    stackNavigateTo(routeNames.CHAT_SCREEN)
    if (chatDTO?.id)
      chatServices.update(chatDTO)
  }, [chatDTO]);

  const chatScroll: any = useRef();

  useEffect(() => {
    let closeChatListener: () => void;
    (async() => {
       //stackNavigateTo(routeNames.CHAT_SCREEN)
        setShowBottomNav(false)
        const params = stackGetParams() as ChatParams
        setMAtchInfo(params?.matchInfo)
        setChatDTO(params?.chat)
        closeChatListener = await chatServices.chatListener(params?.chat.id,setChatDTO)
    })();
    return () => {
      goBack()
      closeChatListener()
    }
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
         : <ScrollView 
              ref={(el: any) => {chatScroll.current = el}}
              style={{width: "100%"}} 
              onContentSizeChange={() => chatScroll.current.scrollToEnd({animated: true})}>
          {
            Object.keys(messages).map((day, i) => {
              return <View key={i}>
                <TimesStampInfo value={day}/>
                {  messages[day].map((msg, id) => <Message
                      key={id}
                      ofLoggedUser={msg.ofLoggedUser}
                      firstMsgInBatch={msg.firstMsgInBatch}
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
