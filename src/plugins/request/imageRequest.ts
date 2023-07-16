import myAxios from "../../config/myAxios";
import {response} from "@/plugins/request/dao/type";

const getImageCode =async ():Promise<response> => {
    return await myAxios.get('/captchaImage')
}

export default {
    getImageCode,
};