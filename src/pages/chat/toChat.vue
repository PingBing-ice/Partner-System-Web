<template>
  <van-nav-bar style="height: 7%;width: auto"
      :title="titleName"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRightTeam"
  >
    <template #right>
      <van-icon name="friends-o" size="18"/>
    </template>
  </van-nav-bar>
  <chat-card-box :chatList="testData" :userId="userId"/>
  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"/>
  <van-cell-group inset>
    <van-field
        v-model="messages"
        center
        placeholder="善语结善缘"
    >
      <template #button>
        <van-button size="small" type="primary" @click="getSend">发送</van-button>
      </template>
    </van-field>
  </van-cell-group>
</template>

<script setup lang="ts">

import {Notify, showFailToast, Toast} from "vant";
import {getCurrentInstance, nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
  import myAxios from "../../plugins/myAxios";
import webSocketConfig from "../../config/webSocketConfig";
import {getMessages} from "../../services/MeesageUtils";
import {messageType} from "../../services/MessageType";
import {chatStateEnum} from "../../states/chat";
import store from "../../store";
import ChatCardBox from "../../components/ChatCardBox.vue";

const messages = ref("")
const route = useRoute()
const router = useRouter()
const friendId = route.query.friendId + ""
const friendUrl = ref('')
const friendName = ref('')
const titleName = ref('')

const userId = ref("")
const userName = ref("")
const AvatarUrl = ref("")
const current = ref("")
const recordList = ref([]);
let socket: any = null;
const testData: any = ref([])
onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  const user =store.getters.getUser
  if (user != null) {
    userId.value = user.id;
    current.value = userId.value;
    userName.value = user.username;
    AvatarUrl.value = user.avatarUrl;
    await webSocketConfig.initSocket();
    socket = webSocketConfig.getSocket();
    getOnMessage(userId.value);

    //  加载聊天记录
    const response: any = await myAxios.get("/partner/record/chat", {
      params: {
        friendId: friendId,
      }
    })

    if (response.code === 200 && response.data) {
      recordList.value = response.data.chat;
      friendUrl.value = response.data.avatarUrl;
      friendName.value = response.data.name;
      titleName.value = friendName.value;
      recordList.value.forEach((record: any) => {
        if (record.userId == userId.value) {
          let userData = {
            id: userId.value,
            name: userName.value,
            images: AvatarUrl.value,
            message: record.message,
          };

          testData.value.push(userData);
        }

        if (record.userId == friendId) {
          let FriendData = {
            id: friendId,
            name:friendName.value,
            images: friendUrl.value,
            message: record.message,
          };
          testData.value.push(FriendData,);
        }
      })
    }else {
      router.back();
      showFailToast("数据有误");
    }

  } else {
    showFailToast("请先登录...");
  }
  await nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
  })
})

const getOnMessage = (id: string) => {
  if (socket == null) {
    webSocketConfig.initSocket()
    socket = webSocketConfig.getSocket()
  }

  socket.onmessage = (msg: any) => {
    const chatRecord: messageType = JSON.parse(msg.data)
    const friend = chatRecord.chatRecord.message;
    if (chatRecord.type === chatStateEnum.HY||chatRecord.type===chatStateEnum.SYSTEM) {
      if (route.path === '/toChat') {
        let userData = {
          id: friendId,
          name: friendName.value,
          images: friendUrl.value,
          message: friend,
        }
        testData.value.push(userData)
        titleName.value = friendName.value;
        nextTick(() => {
          // @ts-ignore
          document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
        })
      }
    }
  }
}


const getSend = () => {
  if (messages.value === "") {
    return
  }
  if (userId.value == null) {
    showFailToast("未登录")
    router.back();
    return;
  }
  let mss = messages.value
  messages.value = "";
  let userData = {
    id: userId.value,
    name: userName.value,
    images: AvatarUrl.value,
    message: mss
  }
  testData.value.push(userData)
  let message;
  if (friendId == "1") {
    message = getMessages(chatStateEnum.SYSTEM, userId.value, friendId, mss);
    titleName.value="AI正在思考中..."
  } else {
    message = getMessages(chatStateEnum.HY, userId.value, friendId, mss);
  }
  webSocketConfig.sendSocket(JSON.stringify(message));

  nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
  })
}

const onClickLeft = () => {
  router.back();
}
const onClickRightTeam = () => {
  router.push({
    path: '/find/show',
    query: {
      friendId: friendId
    },
  })
}
</script>
<style scoped>
html,
body {
  background-color: #E8E8E8;
}

#chat {
  height: calc(100vh - 200px);
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

#chat .chatBox {
  /*width: 100%;*/
  /*height: 100%;*/
  background-color: #fff;
  overflow: hidden;
  border-radius: 0.625rem;
}


#chat .chatBox-middle {
  width: 100%;
  height: 80%;
  background-color: #fff;
  /*border-bottom: 0.0625rem solid #2B3D63;*/
}


#chat .chatBox-infoDesk {
  width: 100%;
  height: 10rem;
}

#chat .chatBox-textarea {
  width: 100%;
  height: 6.25rem;
}

#chat .chatBox-sendOut {
  margin-top: 0.625rem;
  width: 100%;
  height: 3.125rem;
  text-align: right;
}

#chat .sendOut {
  padding: 0 1.25rem;
  height: 2.1875rem;
  margin: 0.3125rem 1.25rem 0 0;
}

#chat .chatInfo {
  width: 94%;
  height: 100%;
  margin: auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

#chat .chatUser-box {
  width: 100%;
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
}


#chat .chatUser-box-img {
  display: flex;
}

#chat .chatUser-info {
  margin: 0 0.6rem;
  /*距离底部0*/
  bottom: 0;
}

#chat .chatUser-info-name {
  font-size: 0.875rem;
  color: #888;
  display: flex;
  flex-direction: row;
}

#chat .nowDate {
  margin: 0 0.625rem;
}

#chat .chatUser-info-text {
  margin-top: 0.3125rem;
  max-width: 20rem;
  padding: 0.5rem;
  background-color: #E8E8E8;
  border-radius: 0.5rem;
  float: left;
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
}

#chat .chatUser-info-text span {
  font-size: 0.9375rem;
  line-height: 1.5625rem;
}

#chat .chatUser-box1 {
  flex-direction: row-reverse;
}

#chat .chatUser-info-name1 {
  flex-direction: row-reverse;
}

#chat .chatUser-info-text1 {
  float: right;
}


</style>
