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


  <div style="width: 100%;display: flex;justify-content: center;">
    <div class="chatBut">
      <div class="sendBut">
        <input type="text" placeholder="善语结善缘" v-model="messages" class="chatIput" >
        <van-button size="small"  type="primary" @click="getSend">发送</van-button>
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">

import {showFailToast} from "vant";
import {nextTick, onActivated, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import webSocketConfig from "../../config/webSocketConfig";
import {getMessages} from "../../services/MeesageUtils";
import {messageType} from "../../services/MessageType";
import {chatStateEnum} from "../../states/chat";
import store from "../../store";
import ChatCardBox from "../../components/ChatCardBox.vue";

const messages = ref("")
const route = useRoute()
const router = useRouter()
const friendUrl = ref('')
const friendName = ref('')
const titleName = ref('')
const friendId = route.query.id + ""

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
  const user = store.getters.getUser
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
    console.log(response.data)
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
            name: friendName.value,
            images: friendUrl.value,
            message: record.message,
          };
          testData.value.push(FriendData,);
        }
      })
    } else {
      await router.back();

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
    if (chatRecord.type === chatStateEnum.HY || chatRecord.type === chatStateEnum.SYSTEM) {
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
  if (userId.value == null || friendUrl.value === '' || friendName.value === '') {
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
    titleName.value = "AI正在思考中..."
  } else {
    message = getMessages(chatStateEnum.HY, userId.value, friendId, mss, AvatarUrl.value, userName.value);
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
    path: '/show',
    query: {
      friendId: friendId
    },
  })
}
</script>
<style scoped>

</style>
