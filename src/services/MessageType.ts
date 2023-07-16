import {chatStateEnum} from "@/states/chat";

export type  messageType<T> = {
    type: chatStateEnum;
    data: T;
}
export type ChatMessageResp={
    userInfo: UserInfo;
    message: Message
}
export type UserInfo = {
    // 用户id
    username: string;
    // 发送的id
    uid: number;
    avatar: string;
}
export type Message={
    id: number;
    sendTime: number;
    content: string;
    status: number;
    reply: any;
}


