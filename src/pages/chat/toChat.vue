<template>
  <div class="content_box">
    <van-nav-bar class="chat_hat"
                 :title="titleName"
                 left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRightTeam"
    >
      <template #right>
        <van-icon name="friends-o" size="18"/>
      </template>
    </van-nav-bar>
    <div class="content_box">
      <chat-card-box :chatList="chatData" :userId="user.id"/>
      <MsgInput @input="setValue" @but="getSend"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import {showFailToast, showToast} from "vant";
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import store from "@/store";
import MsgInput from "@/components/MsgInput.vue";
import {worker} from "@/util/socket/initWorker";
import {chatStateEnum} from "@/states/chat";
import {ChatMessageResp, messageType} from "@/services/MessageType";
import chatRequest from "@/plugins/request/chatRequest";
import ChatCardBox from "@/components/chat/ChatCardBox.vue";
import {chatList} from "@/plugins/request/dao/chat";

const messages = ref("")
const route = useRoute()
const router = useRouter()
const titleName = ref<string>(String(route.query.name));
const fid = ref<number>(Number(route.query.id??0));
const chatData = ref<chatList[]>([])
const user = store.getters.getUser
let curr = 0;
let isCurr = true;
let isLast = false;
onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  worker.addEventListener("message", onMessage);
  //  加载聊天记录
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
  const response = await chatRequest.sendMsg(mss, fid.value, null);
  if (response.code !== 200) {
    chatData.value.pop();
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
const setValue = (value: string) => {
  messages.value = value;
}
const onMessage = (e: MessageEvent) => {
  const data = parseME(e);
  if (!data) {
    return;
  }
  pushChatData(data)
  goTop();
}
const parseME = (e: MessageEvent) => {
  const params: { type: string; value: unknown } = JSON.parse(e.data)
  if ("message" === params.type) {
    const param: messageType<ChatMessageResp> = JSON.parse(params.value as string);
    if (param.type === chatStateEnum.HY) {
      return param.data;
    }
  }
}
const getMessage = async (cursor: number) => {
  if (fid.value <= 0 || !fid.value) {
    showToast({message: '数据有误', position: 'top'});
    await router.replace("/index");
    return;
  }
  const response = await chatRequest.chatUserList(fid.value, 20, cursor);
  if (response.code === 200 && response.data) {
    curr = response.data.cursor
    isLast = response.data.isLast
    const data: ChatMessageResp[] = response.data.data;
    const chatList = buildChatList(data);
    pushChatDataList(chatList);
    if (cursor == 0) {
      goTop();
    }
  } else {
    await router.replace("/index");
    showToast({message: '数据有误', position: 'top'});
  }
}

const pushChatData = (messageResp: ChatMessageResp) => {
  const userInfo = messageResp.userInfo;
  const message = messageResp.message;
  chatData.value.push({
    id: message.id, userId: userInfo.uid, name: userInfo.username, images: userInfo.avatar,
    message: message.content
  });
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
  chatData.value = [...chatList, ...chatData.value];
}
const onClickLeft = () => {
  router.back();
}
const onClickRightTeam = () => {
  router.push({
    path: '/show',
    query: {
      friendId: fid.value
    },
  })
}
</script>
<style scoped>
.chat_hat {
  height: var(--van-tabs-line-height)
}


.content_box {
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
}
</style>
