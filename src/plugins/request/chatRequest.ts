import myAxios from "@/config/myAxios";
import {response} from "@/plugins/request/dao/type";

const path='/chat'
 const sendMsg = async (content: string, acceptId: number, replyMsgId: number|null) :Promise<response> => {
    return  await myAxios.post(`${path}/send`, {
        content: content,
        acceptId: acceptId,
        replyMsgId: replyMsgId
    });

}
const sendTeamMsg = async (content: string, tid: number, replyMsgId: number|null) :Promise<response> => {
    return  await myAxios.post(`${path}/team/send`, {
        content: content,
        acceptId: tid,
        replyMsgId: replyMsgId
    });

}
 const sendGPTMsg = async (content: string, acceptId: number, replyMsgId: number|null) :Promise<response> => {
   return  await myAxios.post(`${path}/gpt/send`, {
        content: content,
        acceptId: acceptId,
        replyMsgId: replyMsgId
    });
}
const chatUserList =async (id:number,size:number,cursor:number) :Promise<response> => {
    return  await myAxios.post(`${path}/list`, {
        id: id,
        count: size,
        cursor: cursor
    });
}
const chatTeamList =async (tid:number,size:number,cursor:number) :Promise<response> => {
    return  await myAxios.post(`${path}/team/list`, {
        id: tid,
        count: size,
        cursor: cursor
    });
}
export default {
    sendMsg,
    sendGPTMsg,
    chatUserList,
    chatTeamList,
    sendTeamMsg
}