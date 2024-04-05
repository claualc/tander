import dbService from "./firebase/database";
import { converter } from "./firebase/database/converterDTO";
import matchServices, { MatchFactory, UserMAtchInfoDTO } from "./matchServices";

export enum MsgStates {
    SENDING,
    SENT
}

export interface MessageDTO {
    id: number;
    value: string;
    user: string;
    timestamp: string; // ISO with millisecond
    state: MsgStates
}

export interface messagesObject {
    [key: string]: MessageDTO[]; // the key is the YYY-MM-DD
}

export interface ChatDTO {
    id: string;
    matchFactoryId: string;
    messages: messagesObject;
    messageCount: number;
}

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
    // to play with msgs
    let otheruser = "Xak6maKrr0mRL2NokYig_"
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate())
    //


    const upToDateChat = await getById(chat.id)
    let newMsg: MessageDTO = {
        id: upToDateChat.messageCount+1,
        value: value,
        user: match.loggedUser.id,
        timestamp: yesterday.toISOString(),
        state: MsgStates.SENDING
    }

    let updatedChat: ChatDTO = upToDateChat
    updatedChat.messages = addNewMsgToMsgObject(updatedChat.messages, newMsg)

    updatedChat.messageCount = updatedChat.messageCount + 1

    let send = async () => {
        await dbService.update(COLLECTION_ID, updatedChat,chat.id)
        console.log("..:: ChatService.sendMessage (msg sent)")
    }
    send();

    return newMsg
}

export default {
    create,
    getById,
    sendMessage,
}