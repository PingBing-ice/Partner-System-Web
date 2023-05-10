export type messageType = {
    type: number;
    chatRecord: ChatRecordVo;
    ext?: object;
}

type ChatRecordVo = {
    // 用户id
    userId?: string;
    // 发送的id
    sendId?: string;
    sendUrl?: string;
    sendName?: string;
    // 消息
    message?: string;
}

