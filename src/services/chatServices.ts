import dbService from "./firebase/database";
import { converter } from "./firebase/database/converterDTO";
import matchServices, { MatchFactory } from "./matchServices";

export interface MessageDTO {
    id: string;
    value: string;
    loggedUserId: string;
    matchUserId: string;
    timestamp: string; // ISO with millisecond
}

export interface messagesObject {
    [key: string]: MessageDTO; // the key is the timestamp of the message ISO
}

export interface ChatDTO {
    id?: string;
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
        matchFactoryId: matchFac.id,
        messages: {} as messagesObject, // ISO
        messageCount: 0
    }

    // createChat
    let chatRef = await dbService.create(COLLECTION_ID,newChat, chatConverter)

    let updatedFac = matchFac
    updatedFac.chatId = chatRef.id

    // update Factory
    await matchServices.update(matchFac, matchFac.id)

    const chat = await dbService.getObjectByRef(chatRef) as ChatDTO
    return chat
}

export default {
    create
}