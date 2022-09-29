import myAxios from '../plugins/myAxios';
import {getChatUserState, setChatUserState} from "../states/user";

export const getCurrentUser = async () => {
    const currentUser = getChatUserState();
    if (currentUser) {
        return currentUser;
    }
    const res = await myAxios.get("/api/user/current");
    // @ts-ignore
    if (res.code === 200) {
        setChatUserState(res.data);
        return res.data;
    }
    return null;
}

