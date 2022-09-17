import myAxios from '../plugins/myAxios';
import {getCurrentUserState, setCurrentUserState} from "../states/user";

export const getCurrentUser = async () => {
    const currentUser = getCurrentUserState();
    if (currentUser) {
        return currentUser;
    }
    const res = await myAxios.get("/api/user/current");
    // @ts-ignore
    if (res.code === 200) {
        setCurrentUserState(res.data);
        return res.data;
    }
    return null;
}

