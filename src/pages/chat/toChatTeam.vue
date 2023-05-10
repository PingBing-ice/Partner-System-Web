<template>
  <van-nav-bar
      :title="teamNane"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRightTeam"
  >
    <template #right>
      <van-icon name="friends-o" size="18"/>
    </template>
  </van-nav-bar>

  <chat-card-box :chat-list="testData" :user-id="userId"></chat-card-box>
  <div style="width: 100%;display: flex;justify-content: center;">
    <div class="chatBut">
      <div class="sendBut">
        <input type="text" placeholder="善语结善缘" v-model="messages" class="chatIput" >
        <van-button size="small"  type="primary" @click="getSend">发送</van-button>
      </div>

    </div>
  </div>

</template>


<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast, showSuccessToast, showToast} from "vant";
import webSocketConfig from "../../config/webSocketConfig";
import {getMessages} from "../../services/MeesageUtils";
import MyAxios from "../../config/myAxios";
import {chatStateEnum} from "../../states/chat";
import store from "../../store";
import ChatCardBox from "../../components/ChatCardBox.vue";


const route = useRoute()
const router = useRouter()
const testData = ref([]);
const userList = ref([]);
const teamChatRecord = ref([]);
const messages = ref("");
const userId = ref("");
const userName = ref("")
const avatarUrl = ref("")
const teamUrl = ref("")
const teamID = route.query.id + ""
const teamNane = ref("")
let socket = null;
onMounted(async () => {

  // 获取用户人的信息,获取socket连接
  if (!store.getters.getIsLogin) {
    showToast({message:'未登录!',position: 'top'});

    router.back();
    return;
  }
  const user = store.getters.getUser
  const resp = await MyAxios.post("/partner/team/chat/team", {
    id: teamID,
  })
  if (resp.code === 200 && resp.data) {
    const data = resp.data
    teamNane.value = data.teamName;
    userList.value = data.userList;
    teamChatRecord.value = data.teamChat;
    teamUrl.value = data.teamUrl;
  } else {
    router.back();
    return;
  }

  await webSocketConfig.initSocket();
  socket = webSocketConfig.getSocket();

  getOnMessage();
  userId.value = user.id;
  userName.value = user.userAccount
  avatarUrl.value = user.avatarUrl;

  if (teamChatRecord.value.length > 0) {
    const userMap = userList.value.map(user => [user.id, user]);
    const map = new Map(userMap);
    for (let chat of teamChatRecord.value) {
      const uId = chat.userId;
      const u = map.get(uId);
      let userData={
        id: "",
        name: "",
        images: "",
        message: "",
      }
      if (u !== null && u) {
        userData.id = u.id;
        userData.name = u.username;
        userData.images = u.avatarUrl;
        userData.message = chat.message;
      }else {
        userData.id = user.id;
        userData.name = user.userAccount;
        userData.images = user.avatarUrl;
        userData.message = chat.message;
      }
      testData.value.push(userData);
      await nextTick(() => {
        document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
      })
    }

  }


})
// 发送信息
const getSend = () => {

  if (messages.value === "") {
    return
  }

  if (userId.value == null) {
    showSuccessToast("未登录");
    router.back();
    return;
  }
  let mes = messages.value;
  messages.value = "";
  let userData = {
    id: userId.value,
    name: userName.value,
    images: avatarUrl.value,
    message: mes
  }
  testData.value.push(userData);
  const sendMessage = getMessages(chatStateEnum.DW, userId.value, teamID, mes,teamUrl.value,teamNane.value);
  webSocketConfig.sendSocket(JSON.stringify(sendMessage));

  nextTick(() => {
    document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
  })

}
const getOnMessage = () => {
  if (socket == null) {
    webSocketConfig.initSocket()
    socket = webSocketConfig.getSocket()
  }
  socket.onmessage = (msg) => {
    const messages = JSON.parse(msg.data);
    if (messages.type === chatStateEnum.DW) {
      userList.value.forEach((user) => {
        const chat = messages.chatRecord;
        if (chat.userId === user.id) {
          let userData = {
            id: user.id,
            name: user.userAccount,
            images: user.avatarUrl,
            message: chat.message,
          }

          testData.value.push(userData);
          nextTick(() => {
            document.getElementById('chatInfo').scrollTop = document.getElementById('chatInfo').scrollHeight
          })
        }
      })
    }
  }
}
const onClickLeft = () => {
  router.push({
    path: '/team'
  })
}
const onClickRightTeam = () => {
  router.push({
    path: '/userTeam',
    query: {
      teamID: teamID,
      teamName: teamNane.value,
    }
  })
}
</script>

<style scoped>
html,
body {
  background-color: #E8E8E8;
}


</style>
