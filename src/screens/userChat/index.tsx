import { ScreenView } from "@components/index";
import { useContext, useEffect, useState } from "react";
import { routeNames, stackGetParams, stackNavigateTo } from "../stackNavigator";
import { ChatContent, ChatInput, Header } from "./style";
import { LoggedUserContext, UserContextType } from "../context";
import { UserMAtchInfoDTO } from "@serv/matchServices";
import { ChatDTO } from "@serv/chatServices";

export interface ChatParams {
  matchInfo: UserMAtchInfoDTO;
  chat: ChatDTO;
}

const ChatMessagingScreen = () => {

  const { loggedUser, setShowBottomNav } = useContext(LoggedUserContext) as UserContextType; 

  const [matchInfo, setMAtchInfo] = useState<UserMAtchInfoDTO>();
  const [chatDTO, setChatDTO] = useState<ChatDTO>();

  useEffect(() => {
    setShowBottomNav(false)
    const params = stackGetParams() as ChatParams
    setMAtchInfo(params.matchInfo)
    setChatDTO(params.chat)

    return () => {
      setShowBottomNav(true)
      stackNavigateTo(routeNames.CHAT_SCREEN)
    }
  }, [])
  return <ScreenView style={{zIndex: 30}}>
    <Header>

    </Header>
    <ChatContent></ChatContent>
    <ChatInput></ChatInput>
  </ScreenView>;
}

export default ChatMessagingScreen;
