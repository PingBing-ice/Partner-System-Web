import {messageType} from "./MessageType";

let sendMessage: messageType ={
    type: 0,
    chatRecord: {
        userId: "",
        sendId: "",
        message: "",
    },
    ext: undefined,
};
export const getMessages = (type: number, userid?: string, sendId?: string, msg?: string, ext?: object) =>{
    sendMessage.type = type;
    sendMessage.chatRecord.userId = userid;
    sendMessage.chatRecord.sendId=sendId
    sendMessage.chatRecord.message=msg
    sendMessage.ext = ext;
    return sendMessage;
}
