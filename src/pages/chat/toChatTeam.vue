<template>
  <van-nav-bar
      :title="teamNane"
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
      <div class="chatInfo" id="chatInfo" ref="main">
        <div class="chatUser-box" id="chatUser-box-id" v-for="(item,index) in testData" :key="index"
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
<!--  <van-sticky :offset-bottom="50" position="bottom">-->
<!--&lt;!&ndash;    <van-button type="primary">吸底距离</van-button>&ndash;&gt;-->
<!--  </van-sticky>-->
</template>


<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {getCurrentUser} from "../../services/users";
import {useRoute, useRouter} from "vue-router";
import {Notify, Toast} from "vant";
import webSocketConfig from "../../config/webSocketConfig";
import {messageType} from "../../services/MessageType";
import {getMessages} from "../../services/MeesageUtils";
import MyAxios from "../../plugins/myAxios";


const route=useRoute()
const router=useRouter()
const testData:any = ref([]);
const userList = ref([]);
const teamChatRecord = ref([]);
const messages = ref("");
const userId = ref("");
const userName = ref("")
const avatarUrl = ref("")
const teamID = route.query.teamID+""
const teamNane = route.query.teamNane
let socket: any = null;
onMounted(async ()=>{

  // 获取用户人的信息,获取socket连接
  const user = await getCurrentUser();
  const res = await MyAxios.get("/partner/userTeam/get",{
    params: {
      teamId: teamID,
    }
  })
  // @ts-ignore
  if (res.code === 200){
    userList.value = res.data;
  }
  await webSocketConfig.initSocket();
  socket = webSocketConfig.getSocket();

  // 获取队伍的队员信息

  // 查看队伍的聊天信息
  const response:any = await MyAxios.get("/partner/teamChatRecord/getTeam",{
    params: {
      teamId: teamID,
    }
  })
  if (response.code === 200) {
    teamChatRecord.value = response.data;
  }else if (response.code === 40000) {
    Toast.fail("你已被踢出该队伍...")
    await router.push({
      path: '/team'
    })
  }
  getOnMessage();
  userId.value = user.id;
  userName.value=user.userAccount
  avatarUrl.value = user.avatarUrl;

  if (teamChatRecord.value.length > 0) {
      teamChatRecord.value.forEach(teamChat => {
        userList.value.forEach(user => {
          // @ts-ignore
          if (user.id == teamChat.userId) {
            let userData = {
              // @ts-ignore
              id: user.id,
              // @ts-ignore
              name: user.userAccount,
              // @ts-ignore
              images: user.avatarUrl,
              // @ts-ignore
              message: teamChat.message,
            };
            // @ts-ignore
            testData.value.push(userData);
          }
        })
      })
  }
  await nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop =document.getElementById('chatInfo').scrollHeight
  })

})
// 发送信息
const getSend = () => {

  if (messages.value === "") {
    Toast('请输入咨询信息')
    return
  }
  if (userId.value == null) {
    Toast("userId 为空")
  }
  let userData = {
    id: userId.value,
    name: userName.value,
    images: avatarUrl.value,
    message: messages.value
  }
  // @ts-ignore
  testData.value.push(userData);
  const sendMessage = getMessages(2, userId.value, teamID, messages.value);
  webSocketConfig.sendSocket(JSON.stringify(sendMessage));
  messages.value = "";
   nextTick(() => {
    // @ts-ignore
    document.getElementById('chatInfo').scrollTop =document.getElementById('chatInfo').scrollHeight
  })

}
const getOnMessage = () => {
  if (socket == null) {
    webSocketConfig.initSocket()
    socket = webSocketConfig.getSocket()
  }
  socket.onmessage=(msg:any)=>{

    const messages:messageType =JSON.parse(msg.data);
    if (messages.type === 2) {
      userList.value.forEach((user: { id: string | undefined; userAccount: any; avatarUrl: any; }) => {
        const chat =messages.chatRecord;
        if (chat.userId == user.id){
          let userData = {
            id: user.id,
            name: user.userAccount,
            images: user.avatarUrl,
            message: chat.message,
          }

          testData.value.push(userData);
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
      teamName: teamNane,
    }
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
