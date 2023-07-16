/* eslint-disable no-restricted-globals */

// 发消息给主进程
const postMsg = ({type, value}: { type: string; value?: object }) => {
    self.postMessage(JSON.stringify({type, value}))
}

// ws instance
let socket: WebSocket
// 心跳 timer
let heartTimer: any

// 重连 timer
let timer: any
// 重连🔐
let lockReconnect = false

// 往 ws 发消息
const socketSend = (value: object) => {
    socket?.send(JSON.stringify(value))
}

// 发送心跳 10s 内发送
const sendHeartPack = () => {
    // 10s 检测心跳
    heartTimer = setInterval(() => {
        // 心跳消息类型 2
        socketSend({type: 3})
    }, 9900)
}
// 清除❤️跳 timer
const clearHeartPackTimer = () => {
    if (heartTimer) {
        clearInterval(heartTimer)
        heartTimer = null
    }
}

const onCloseHandler = () => {
    clearHeartPackTimer()
    // 已经在连接中就不重连了
    if (lockReconnect) return

    // 标识重连中
    lockReconnect = true

    // 清除 timer，避免任务堆积。
    if (timer) {
        clearTimeout(timer)
        timer = null
    }

    // 断线重连
    timer = setTimeout(() => {
        initSocket()
        // 标识已经开启重连任务
        lockReconnect = false
    }, 2000)
}

// ws 连接 error
const onError = () => {
    onCloseHandler()
    postMsg({type: 'error'})
}
// ws 连接 close
const onClose = () => {
    onCloseHandler()
    postMsg({type: 'close'})
}
// ws 连接成功
const onOpen = () => {
    postMsg({type: 'open'})
    // 心跳❤️检测
    sendHeartPack()
}
// ws 连接 接收到消息
const onMsg = (e: any) => {
    postMsg({type: 'message', value: e.data})
}

// 初始化 ws 连接
const initSocket = () => {
    socket?.removeEventListener('message', onMsg)
    socket?.removeEventListener('open', onOpen)
    socket?.removeEventListener('close', onClose)
    socket?.removeEventListener('error', onError)
    // 建立链接
    // socket = new WebSocket("ws://124.222.223.108:9001/ws");
    socket = new WebSocket("ws://localhost:9001/ws");

    // 收到消息
    socket.addEventListener('message', onMsg)
    // 建立链接
    socket.addEventListener('open', onOpen)
    // 关闭连接
    socket.addEventListener('close', onClose)
    // 连接错误
    socket.addEventListener('error', onError)
}

self.onmessage = (e: MessageEvent<string>) => {
    const {type, value} = JSON.parse(e.data)
    switch (type) {
        case 'initWS': {
            initSocket()
            break
        }
        case 'message': {
            if (socket?.readyState !== 1) {
                return
            }
            socketSend(value)
            break
        }
    }
}
