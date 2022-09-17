import {UserType} from "../models/user";
import {getCurrentUser} from "../services/users";

let currentUser: UserType;
let ChatUserState: any[] = [];

const setCurrentUserState = (user: UserType) => {
    currentUser = user
}
const getCurrentUserState = (): UserType => {
    return currentUser;
};
const removeCurrentUserState = () => {
    currentUser = {};
};
const setChatUserState = (userState: string) => {
    ChatUserState.push(userState);
}
const getChatUserState = () => {
    return ChatUserState;
}
const removeChatUser = (userName: string) => {
    ChatUserState = ChatUserState.filter(name => {
        return userName !== name;
    })
}
export {
    setCurrentUserState,
    getCurrentUserState,
    setChatUserState,
    getChatUserState,
    removeChatUser,
    removeCurrentUserState
};
