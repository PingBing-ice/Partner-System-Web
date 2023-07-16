import {worker} from "./initWorker";
import {getToken} from "@/util/cookie";
import {chatStateEnum} from "@/states/chat";
import store from "@/store";

class websocket {

    constructor() {
        worker.postMessage('{"type":"initWS"}')
        worker.addEventListener("message", this.onWorkerMsg)
    }

    onWorkerMsg = (e: MessageEvent) => {
        const params: { type: string; value: unknown } = JSON.parse(e.data)
        switch (params.type) {
            case 'message': {
                this.onMessage(params.value as string);
                break
            }
            case 'open': {
                this.inspectLoginStatus()
                break
            }
            case 'close':
            case 'error': {
                break
            }
        }
    }
    send = (msg: any) => {
        worker.postMessage(`{"type":"message","value": ${JSON.stringify(msg)}}`)
    }
    auth = (token: string | undefined) => {
        if (!token) {
            token = getToken();
        }
        if (token) {
            this.send({type: chatStateEnum.LJ, data: token});
        }
    }
    inspectLoginStatus = () => {
        this.auth(undefined)
    }
    onMessage = (value: string) => {
        const params: { type: chatStateEnum; data: unknown; } = JSON.parse(value);
        switch (params.type) {
            case chatStateEnum.XX:
                store.commit("loginOut")
                break;
            case chatStateEnum.HY:
                break;
            case chatStateEnum.ADV:
                break;

        }
    }
}

export default new websocket();