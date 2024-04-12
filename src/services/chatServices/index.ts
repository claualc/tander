import { collection, onSnapshot } from "firebase/firestore";
import dbService from "@firebaseServ/database";
import { converter } from "@firebaseServ/database/converterDTO";
import matchServices, { MatchFactory, UserMAtchInfoDTO } from "@serv/matchServices";
import { ChatDTO, messagesObject, MessageDTO, MsgStates } from "./DTOs";

const COLLECTION_ID = "chat";

export const chatConverter: converter<ChatDTO> = {
    toFirestore: (item) => {
        return {...item}
    },
    fromFirestore: async (snap, opt) => {
        const data = snap.data(opt)!;
        console.log("..:: FirebaseService.fromFirestore (chat)", snap.id)
        return {
            id: snap.id,
            matchFactoryId: data.matchFactoryId,
            messages: data.messages, // ISO
            messageCount: data.messageCount
        } as ChatDTO
    }
}


const create = async (matchFac: MatchFactory) => {

    let newChat: ChatDTO = {
        id: "", // unread
        matchFactoryId: matchFac.id,
        messages: {} as messagesObject, // ISO
        messageCount: 0
    }

    let {id, ...rest} = newChat

    // createChat
    let chatRef = await dbService.create(COLLECTION_ID,rest, chatConverter)

    let updatedFac = matchFac
    updatedFac.chatId = chatRef.id

    // update Factory
    await matchServices.update(matchFac, matchFac.id)

    const chat = await dbService.getObjectByRef(chatRef) as ChatDTO
    return chat
}

const getById = async (chatId: string) => {
    console.log("..:: Chatservices.getById")
    let chat = await dbService.getObjectById(COLLECTION_ID,chatId, chatConverter)
    return chat as ChatDTO
}

export const addNewMsgToMsgObject = (messages: messagesObject, newMsg: MessageDTO) => {
    let dayKey: string = newMsg.timestamp.split("T")[0]
    let dayMessages: MessageDTO[] = messages[dayKey] || []
    messages[dayKey] =  [...dayMessages, newMsg]
    return messages
}

const sendMessage = async (value: string, chat: ChatDTO, match: UserMAtchInfoDTO) => {
    let newMsg: MessageDTO = {
        id: chat.messageCount+1,
        value: value,
        user: match.loggedUser.id,
        timestamp: new Date().toISOString(),
        state: MsgStates.UNREAD
    }

    let updatedChat: ChatDTO = chat
    updatedChat.messages = addNewMsgToMsgObject(updatedChat.messages, newMsg)

    updatedChat.messageCount = updatedChat.messageCount + 1

    let send = async () => {
        await dbService.update(COLLECTION_ID, updatedChat,chat.id)
        console.log("..:: ChatService.sendMessage (msg sent)")
    }
    send();

    return newMsg
}

const chatListener = async (id: string, onChatChange: (v: ChatDTO) => void) => {
    let ref = await dbService.getRefById(COLLECTION_ID,id);
    const unsub = onSnapshot(
        ref, (doc) => {
            console.log("..:: Chatservice.listener (new msg)")
            const chat: ChatDTO= doc.data();
            onChatChange({...chat, id: ref.id})
        });
    return unsub;
}


const getLastMsgChat = async (id: string) => {
    let doc = await dbService.getObjectById(COLLECTION_ID,id, chatConverter) as ChatDTO;
    
    let days = Object.keys(doc.messages)
    let lastMsgDay = days?.length-1
    let msgsOfDay = doc.messages[days[lastMsgDay]]

    // returns the last msg in the array
    return doc?.messages ? msgsOfDay[msgsOfDay?.length-1] : {} as MessageDTO;
}

const update = async(chat: ChatDTO) => {
    console.log("update,chatDTO", chat)
    await dbService.update(COLLECTION_ID, chat, chat.id)
}

export default {
    create,
    getById,
    sendMessage,
    chatListener,
    getLastMsgChat,
    update
}