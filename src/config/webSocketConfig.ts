import {ref} from "vue";
import {getCurrentUser} from "../services/users";
import {getMessages} from "../services/MeesageUtils";
import {Notify, Toast} from "vant";
import {useRouter} from "vue-router";
import {getCurrentUserState} from "../states/user";
import {messageType} from "../services/MessageType";
const socketList:any = ref([])
let socket: any;
let cloneTime: any;
const router = useRouter();
const initSocket = async () => {
    const user = await getCurrentUser();
    if (user == null) {
        Toast.fail("未登录,请重试")
        router.back();
        return;
    }
    // @ts-ignore
    const userId = user.id;

    socket =getSocket();
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
            cloneTime =setInterval(() => {
                const userState = getCurrentUserState();
                if (!userState.id) {
                    clearInterval(cloneTime)
                }
                keepalive();
            }, 10000);
        } catch (e){
            // @ts-ignore
            initSocket()
        }
    };
    socket.onclose = function () {
        clearInterval(cloneTime)
        socket = null;
    };

    socket.onerror = function () {
        clearInterval(cloneTime)
    };

}

const sendSocket = async (msg: string) => {
    if (socket != null && socket.readyState == WebSocket.OPEN) {
        socket.send(msg);
    } else {
        socket = null;
        // 异步调用需要设置延时
        // 三秒后再重新发送
        setTimeout( () => {
            // 重新连接
            initSocket();
            socket.send(msg);
        }, 1000);
    }
}

const getOnMessage = () => {
    return null;
}

const keepalive =  async () =>{
    // 构建对象
    // const heartMessage = getMessage(3, null, null, null, null, null);
    const heartMessage = getMessages(3);
    await sendSocket(JSON.stringify(heartMessage));
}
const getSocket = () => {
    // 如果当前状态已经连接，无需再次初始化websocket
    if (socket != null && socket.readyState == WebSocket.OPEN) {
        return socket;
    }
     // socket = new WebSocket("ws://localhost:9001/ws");
    const sockets = new WebSocket("ws://localhost:9001/ws");

    if (socketList.value.length === 0) {
        socketList.value.push(sockets)
    }
    socket = socketList.value[0];
     return socketList.value[0]

    // return socket;
}
export default {
    initSocket,
    sendSocket,
    getSocket,
    getOnMessage
}
