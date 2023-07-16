<template>
    <div class="content_box">
      <chat-card-box :chat-list="teamChatList" :user-id="user.id"></chat-card-box>
      <MsgInput @input="setValue" @but="getSend"/>
    </div>
</template>


<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import ChatCardBox from "@/components/chat/ChatCardBox.vue";
import MsgInput from "@/components/MsgInput.vue";
import store from "@/store";
import {showFailToast, showToast} from "vant";
import {worker} from "@/util/socket/initWorker";
import {ChatMessageResp, messageType} from "@/services/MessageType";
import {chatStateEnum} from "@/states/chat";
import chatRequest from "@/plugins/request/chatRequest";
import {chatList} from "@/plugins/request/dao/chat";

const route = useRoute()
const router = useRouter()
const teamChatList = ref<chatList[]>([]);
const messages = ref("");
let isLast = false
let isCurr = true;

const tid =ref<number>(Number(route.query.id??0))
const user = store.getters.getUser;
let curr = 0;
onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
  }
  worker.addEventListener("message", onMessage);
  await getMessage(curr);
  const chatInfo = document.getElementById("chatInfo");
  if (chatInfo) {
    chatInfo.addEventListener('scroll', sss)
  }
})
const sss = async () => {
  const chatInfo = document.getElementById("chatInfo");
  if (chatInfo && chatInfo.scrollTop === 0 && isCurr && !isLast) {
    isCurr = false;
    const he = chatInfo.scrollHeight;
    await getMessage(curr);
    if (!isLast) {
      chatInfo.scrollTop = he;
    }
    isCurr = true;
  }
}
const getMessage = async (cu: number) => {
  const response = await chatRequest.chatTeamList(tid.value, 20, cu);
  if (response.code === 200 && response.data) {
    curr = response.data.cursor
    isLast = response.data.isLast
    const data: ChatMessageResp[] = response.data.data;
    const chatList = buildChatList(data);
    pushChatDataList(chatList);
    if (curr == 0) {
      goTop();
    }

  } else {
    await router.replace("/index");
    showToast({message: '数据有误', position: 'top'});
  }
};
const pushChatData = (messageResp: ChatMessageResp) => {
  const userInfo = messageResp.userInfo;
  const message = messageResp.message;
  teamChatList.value.push({
    id: message.id, userId: userInfo.uid, name: userInfo.username, images: userInfo.avatar,
    message: message.content
  })
}
const buildChatList = (messageResp: ChatMessageResp[]) => {
  const chatList: chatList[] = []
  for (let chatMessageResp of messageResp) {
    const userInfo = chatMessageResp.userInfo;
    const message = chatMessageResp.message;
    chatList.push({
      id: message.id, userId: userInfo.uid, name: userInfo.username, images: userInfo.avatar,
      message: message.content
    })
  }
  return chatList;
}
const pushChatDataList = (chatList: chatList[]) => {
  teamChatList.value = [...chatList, ...teamChatList.value];
}
// 接受消息
const onMessage = (e: MessageEvent)=>{
  const data = parseME(e);
  if (!data) {
    return;
  }
  pushChatData(data);
  goTop();
}
const parseME = (e: MessageEvent) => {
  const params: { type: string; value: unknown } = JSON.parse(e.data)
  if ("message" === params.type) {
    const param: messageType<ChatMessageResp> = JSON.parse(params.value as string);
    if (param.type === chatStateEnum.DW) {
      return param.data;
    }
  }
}
const goTop = () => {
  nextTick(() => {
    const chatInfo = document.getElementById("chatInfo");
    if (chatInfo) {
      chatInfo.scrollTop = chatInfo.scrollHeight;
    }
  })
}
const setValue = (value:string) => {
  messages.value = value;
}
// 发送信息
const getSend = async () => {
  if (messages.value === "") {
    return
  }
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  let mss = messages.value
  messages.value = "";
  let message:ChatMessageResp= {
    userInfo: {
      username: user.userAccount,
      uid: user.id,
      avatar: user.avatarUrl
    },
    message: {
      id: 0,
      sendTime: new Date().getTime(),
      content: mss,
      status: 0,
      reply: undefined
    }
  }
  pushChatData(message)
  goTop();
  const response = await chatRequest.sendTeamMsg(mss, tid.value, null);
  if (response.code !== 200) {
    teamChatList.value.pop();
  }

}

</script>

<style scoped>

.content_box {
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
}


</style>
