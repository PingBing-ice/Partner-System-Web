<template>
  <van-notify v-model:show="isNotify" @click="to(friend.friendType,friend.friendId)">
    <img
        class="nav"
        width="40"
        height="40"
        :src="friend.friendAUrl"
     alt=""/>
    <div style="margin-left: 10px;">
      <div style="font-size: 15px;color: #000103;font-weight: bold;float: left">{{ friend.friendTitle }}
      </div>
      <br>
      <div style="font-size: 1px;color: #61666c">
        {{ friend.friendName + ': ' + friend.friendTxt }}
      </div>
    </div>
  </van-notify>
  <EmptyLayout/>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import EmptyLayout from "./layouts/EmptyLayout.vue";
import {useRoute, useRouter} from "vue-router";
import {ChatMessageResp, messageType, UserInfo} from "./services/MessageType";
import {chatStateEnum} from "./states/chat";
import {worker} from "@/util/socket/initWorker";

const route = useRoute();
const router = useRouter();
const friend = ref({
  friendAUrl: "",
  friendName: "",
  friendTxt: "",
  friendTitle: "",
  friendType: 0,
  friendId: 0,
})

const isNotify = ref(false);
onMounted(() => {
  worker.addEventListener("message", onMessage)
})

const onMessage = (e: MessageEvent) => {
  const params: { type: string; value: unknown } = JSON.parse(e.data)
  if (params.type === "message") {
    onNotify(params.value as string)
  }
}
const onNotify = (value: string) => {
  const params: messageType<any> = JSON.parse(value);
  toChatType(params);
}
const toChatType = (params: messageType<any>) => {
  const chatType = params.type;
  friend.value.friendType = chatType;
  switch (chatType) {
      // 好友
    case chatStateEnum.HY:
      chatFriend(params.data);
      break;
      // 队伍
    case chatStateEnum.DW:
      chatTeam(params.data);
      break;
      // 上线通知
    case chatStateEnum.ADV:
      chatSx(params.data);
      break;
  }
}
const to = (type: number, id: number) => {
  isNotify.value = false;
  switch (type) {
      // 好友
    case chatStateEnum.HY:
      if (id) {
        router.push({
          path: "/chat",
          query: {
            id: id,
          }
        })
      }
      break;
      // 队伍
    case chatStateEnum.DW:
      if (id) {
        router.push({
          path: "/chat/team",
          query: {
            id: id,
          }
        })
      }
      break;
  }
}
const chatFriend = (message: ChatMessageResp) => {
  const url = message.userInfo.avatar;
  const name = message.userInfo.username;
  const mes = message.message.content;
  const id = message.userInfo.uid;
  if (url && name && mes && id && !isNotUserId(id)) {
    friend.value.friendId = id;
    chatNotify(url, name, name, mes);
  }
}
const chatTeam = (message: ChatMessageResp) => {
  const url = message.userInfo.avatar;
  const name = message.userInfo.username;
  const mes = message.message.content;
  const id = message.userInfo.uid;
  if (url && name && mes && id) {
    friend.value.friendId = id;
    chatNotify(url, name, "群聊", mes);
  }
}
const chatNotify = (url: string, title: string, name: string, message: string) => {
  if (message.length > 18) {
    message = message.slice(0, 18) + "...";
  }
  friend.value.friendAUrl = url
  friend.value.friendTitle = title;
  friend.value.friendName = name;
  friend.value.friendTxt = message;
  isNotify.value = true;
  setTimeout(() => {
    isNotify.value = false;
  }, 2000);

}
const chatSx = (message: UserInfo) => {
  const sendUrl = message.avatar;
  const sendName = message.username;
  const id = message.uid;
  if (sendUrl && sendName && id) {
    friend.value.friendId = id;
    chatNotify(sendUrl, sendName, sendName, "上线了~");
  }
}
const isNotUserId = (id: number) => {
  if (route.path === '/chat') {
    if (route.query.id) {
      return id === Number(route.query.id??0)
    }
  }
  return false;

}
</script>
<style scoped>
.nav{
  border-radius: 999px;
}

</style>
