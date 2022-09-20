<template>
  <van-nav-bar
      :title="friendName"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRightTeam"
  >
    <template #right>
      <van-icon name="friends-o" size="18" />
    </template>
  </van-nav-bar>
  <div id="chat">
    <div class="chatBox">
<!--      <div class="chatBox-middle">-->
        <div class="chatInfo" id="chatInfo">
          <div class="chatUser-box" v-for="(item,index) in testData" :key="index"
               :class="userId===item.id?'chatUser-box1':'chatUser-box'">
            <div class="chatUser-box-img">
              <van-image round width="2.5rem" height="2.5rem"
                         :src="item.images"/>
            </div>
            <div class="chatUser-info" ref= "chatRoom">
              <div class="chatUser-info-name" :class="userId===item.id?'chatUser-info-name1':'chatUser-info-name'">
                <span>{{ item.name }}</span><span class="nowDate">{{ item.time }}</span>
              </div>
              <div class="chatUser-info-text" :class="userId===item.id?'chatUser-info-text1':'chatUser-info-text'">
                <span>{{ item.message }}</span>
              </div>
            </div>
          </div>

        </div>
      <!--      </div>-->
    </div>
  </div>
  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"/>
  <van-cell-group inset>
    <van-field
        v-model="messages"
        center
        clearable
        placeholder="善语结善缘"
    >
      <template #button>
        <van-button size="small" type="primary" @click="getSend" >发送</van-button>
      </template>
    </van-field>
  </van-cell-group>
</template>

<script setup lang="ts">

import {Notify, Toast} from "vant";
import {getCurrentInstance, nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getCurrentUser} from "../../services/users";
import myAxios from "../../plugins/myAxios";
import webSocketConfig from "../../config/webSocketConfig";
import {getMessages} from "../../services/MeesageUtils";
import {messageType} from "../../services/MessageType";

const messages = ref("")
const route = useRoute()
const router = useRouter()
const friendId = route.query.friendId+""
const friendName = route.query.username
const FriendNameAvatarUrl = route.query.avatarUrl
const userId = ref("")
const userName = ref("")
const AvatarUrl = ref("")
const current = ref("")
const recordList = ref([]);
let socket: any = null;
const testData = ref([])

onMounted(async () => {
  const user = await getCurrentUser()
  if (user != null) {
    userId.value = user.id;
    current.value = userId.value;
    userName.value = user.username;
    AvatarUrl.value = user.avatarUrl;
    await webSocketConfig.initSocket();
    socket = webSocketConfig.getSocket();
    getOnMessage(userId.value);

    //  加载聊天记录
    const response = await myAxios.get("/partner/record/getList", {
      params: {
        userId: userId.value,
        friendId: friendId,
      }
    })
    // @ts-ignore
    if (response.code === 200 && response.data) {
      // @ts-ignore
      recordList.value = response.data;
      recordList.value.forEach(record => {
        // @ts-ignore
        if (record.userId == userId.value) {
          let userData = {
            id: userId.value,
            name: userName.value,
            images: AvatarUrl.value,
            // @ts-ignore
            message: record.message,
          };
          // @ts-ignore
          testData.value.push(userData);
        }
        // @ts-ignore
        if (record.userId == friendId) {
          let FriendData = {
            id: friendId,
            name: friendName,
            images: FriendNameAvatarUrl,
            // @ts-ignore
            message: record.message,
          };
          // @ts-ignore
          testData.value.push(FriendData,);
        }
      })
    }

  } else {
    Toast.fail("请先登录...");
  }
  await nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop =document.getElementById('chatInfo').scrollHeight
  })
})

const getOnMessage = (id: string) => {
  if (socket == null) {
    webSocketConfig.initSocket()
    socket = webSocketConfig.getSocket()
  }

  socket.onmessage = (msg: string) => {


    // @ts-ignore
    const chatRecord:messageType = JSON.parse(msg.data)
    if (chatRecord.type === 1) {
      // @ts-ignore
      const friend = chatRecord.chatRecord.message
      let userData = {
        id: friendId,
        name: friendName,
        images: FriendNameAvatarUrl,
        message: friend,
      }
      // @ts-ignore
      testData.value.push(userData)
    }
     nextTick(() => {
      // @ts-ignore
      document.getElementById('chatInfo').scrollTop =document.getElementById('chatInfo').scrollHeight
    })
  }
}


const getSend = () => {
  if (messages.value === "") {
    Toast('请输入咨询信息')
    return
  }
  let userData = {
    id: userId.value,
    name: userName.value,
    images: AvatarUrl.value,
    message: messages.value
  }
  // @ts-ignore
  testData.value.push(userData)
  if (userId.value == null) {
    Toast("userId 为空")
  }
  // const message = getMessage(1, userId.value, friendId, messages.value, null);
  const message = getMessages(1, userId.value,friendId, messages.value);
  webSocketConfig.sendSocket(JSON.stringify(message));
  messages.value = "";
  nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop =document.getElementById('chatInfo').scrollHeight
  })
}

const onClickLeft = () => {
  router.back();
}
const onClickRightTeam = () => {
  router.push({
    path: '/find/show',
    query: {
      friendId:friendId
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
  height: 100%;
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
  height: 650px;
  margin:  auto;
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
