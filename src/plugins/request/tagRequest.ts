import myAxios from "@/config/myAxios";
import {response} from "@/plugins/request/dao/type";

const getUserTag = async (): Promise<response> => {
    return await myAxios.get('/tag/user/get');
}
const getNotice = async (): Promise<response> => {
    return  await myAxios.get('/notice/get', );
}
const getTag =async (id:number,tid:number|null): Promise<response> => {
    return  await myAxios.get('/tag/get',{
        params:{
            id:id,
            tid: tid,
        }
    });
}
export default {
    getUserTag,
    getNotice,
    getTag
}
