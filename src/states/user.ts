import {UserType} from "../models/user";
 

let chatUserState: UserType[] = [];


const setChatUserState = (userState: UserType) => {
    if (!chatUserState || chatUserState.length != 1) {
        chatUserState.push(userState);
    }

}
const getChatUserState = () => {
    let userData:UserType;
    chatUserState.forEach(user =>{
        userData = user;
    });
    // @ts-ignore
    return userData;
}
const removeChatUser = () => {
    chatUserState = [];
}
export {
    setChatUserState,
    getChatUserState,
    removeChatUser,
};
