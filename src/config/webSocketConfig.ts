import {ref} from "vue";
import {getMessages} from "../services/MeesageUtils";

import {chatStateEnum} from "../states/chat";
import {messageType} from "../services/MessageType";
import store from "../store";

const socketList: any = ref([])
const message = ref('')
let socket: any;
let cloneTime: any;
let retryNum = 10;
const initSocket =  () => {
    // 初始化
    if (!store.getters.getIsLogin) {
        return;
    }
    const user = store.getters.getUser
    const userId = user.id;
    socket = getSocket();
    socket.onopen = () => {
        // 构建发给服务器的消息体
        if (userId == null) {
            return;
        }
        // const message = getMessage(0, userId, null, null, null, null);
        const message = getMessages(0, userId);
        // 发送消息
        sendSocket(JSON.stringify(message));
        // 定时发送心跳包
        try {
            cloneTime = setInterval(() => {
                if (userId == null) {
                    clearInterval(cloneTime)
                    return;
                }
                keepalive(userId);
            }, 10000);
        } catch (e) {
            initSocket()
        }
    };
    socket.onclose = () => {
        clearSocket()
        clearInterval(cloneTime)
        const retry = setInterval(() => {
            socket = getSocket();
            if (socket != null|| retryNum<=0) {
                retryNum = 10;
                clearInterval(retry)
            }
            retryNum--;
        }, 20000);
    };

    socket.onerror = () => {
        clearSocket()
        clearInterval(cloneTime)
    };


}

const sendSocket =  (msg: string) => {
    if (socket != null && socket.readyState == WebSocket.OPEN) {
        socket.send(msg);
    } else {
        socket = getSocket();
        // 异步调用需要设置延时
        setTimeout(() => {
            // 重新连接
            socket.send(msg);
        }, 1000);
    }
}

const clearSocket = () => {
    if (socket != null) {
        socket.close();
    }
    socket = null;
    socketList.value = [];
}

const keepalive =  (userId:string) => {
    // 构建对象
    const heartMessage = getMessages(chatStateEnum.XT,userId);
    sendSocket(JSON.stringify(heartMessage));
}
const getSocket = () => {
    // 如果当前状态已经连接，无需再次初始化websocket
    if (socket != null && socket.readyState == WebSocket.OPEN) {
        return socket;
    }
    if (socketList.value.length === 0) {
        const sockets = new WebSocket(import.meta.env.VITE_SOCKET_URL);
        socketList.value.push(sockets)
    }

    socket = socketList.value[0];
    return socketList.value[0];

    // return socket;
}

export default {
    initSocket,
    sendSocket,
    getSocket,
    clearSocket,
}