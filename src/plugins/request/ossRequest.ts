import myAxios from "@/config/myAxios";
import {response} from "@/plugins/request/dao/type";

export const upload =async (file:FormData):Promise<response> => {
    return  await myAxios.post("/oss/file/upload", file);
}