

export enum MsgStates {
    UNREAD,
    READ
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
