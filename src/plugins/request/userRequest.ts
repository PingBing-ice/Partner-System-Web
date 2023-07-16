import {response} from "@/plugins/request/dao/type";
import myAxios from "@/config/myAxios";
import store from "@/store";
import {removeChatUser} from "@/states/user";
import {removeToken, setToken} from "@/util/cookie";
import {updateRequest} from "@/plugins/request/dao/user";
import wsIns from "@/util/socket/websocket";


const getUserList = async (page: number, size: number): Promise<response> => {
    return await myAxios.get('/api/user/recommend', {
        params: {
            current: page,
            size: size
        }
    });
}
const search = async (current: number, size: number, name: string): Promise<response> => {
    return await myAxios.post('/api/user/search', {
        current: current,
        size: size,
        userName: name
    });
}
const getCurrentUser = async (): Promise<response> => {
    return await myAxios.get('/api/user/current');
}
const Login = async (userAccount: string, password: string, uuid: string, codeImage: string): Promise<response> => {
    return await myAxios.post("/api/user/login", {
        userAccount: userAccount,
        password: password,
        uuid: uuid,
        code: codeImage,
    });
}
const qqLogin = async (): Promise<response> => {
    return await myAxios.get("/api/user/qq/login");
}

const getQQInfo =async (type:string,code:string) => {
    const response:response=await myAxios.post("/api/user/qq/getInfo",{
         type: type,
         code: code,
     });
    if (response.code === 200 && response.data) {
        setToken(response.data)
        wsIns.auth(response.data);
        const resp = await getCurrentUser();
        if (resp.code === 200 && resp.data) {
            await store.dispatch('setUser', resp.data);
        }
    }
}
const forget = async (userAccount: string, password: string, checkPassword: string, email: string, code: string): Promise<response> => {
    return await myAxios.post('/api/user/forget', {
        userAccount: userAccount,
        password: password,
        checkPassword: checkPassword,
        email: email,
        code: code
    });
}
const register = async (userAccount: string, password: string, checkPassword: string, email: string, code: string): Promise<response> => {
    return await myAxios.post('/api/user/register', {
        userAccount: userAccount,
        password: password,
        checkPassword: checkPassword,
        email: email,
        code: code
    });
}
const match = async (size: number): Promise<response> => {
    return await myAxios.get("/api/user/match", {
        params: {
            num: size
        }
    })
}
const sendEmail = async (email: string): Promise<response> => {
    return await myAxios.post('/oss/send', {
        email: email
    });
}
const searchTag = async (tag: string): Promise<response> => {
    return await myAxios.get('/api/user/search/tag', {
        params: {
            tag: tag
        }
    });
}
const addFriend = async (fid: number, message: string | null): Promise<response> => {
    return await myAxios.post("/friend/add", {
        fid: fid,
        message: message,
    })
}
const Logout = async (): Promise<boolean> => {
    const res: response = await myAxios.post("/api/user/Logout");
    if (res.code !== 200) {
        return false;
    }
    await store.dispatch("LoginOut")
    removeChatUser()
    removeToken()
    return true;
}
const update = async ({ id, username, gender, tags, profile, email, tel, status, code }: updateRequest): Promise<response> => {
    return await myAxios.post("/api/user/update", {
        id,
        username,
        gender,
        tags,
        profile,
        email,
        tel,
        status,
        code,
    });
};
export default {
    getUserList,
    search,
    getCurrentUser,
    Login,
    qqLogin,
    forget,
    register,
    sendEmail,
    match,
    searchTag,
    addFriend,
    Logout,
    update,
    getQQInfo
}