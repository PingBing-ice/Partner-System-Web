<template>

  <van-button type="primary" @click="doJoinTeam" block round >创建队伍</van-button>
  <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
  >
    我的队伍
  </van-divider>
  <van-cell :value="team.name" v-for="team in teamList" center @click="toChat(team?.teamId,team?.name)">
    <template #title>
      <van-image
          round
          width="40px"
          height="40px"
          src="https://pic1.zhimg.com/80/v2-88c46f9f5b2aa6d6e04469fb989b7b54_720w.jpg"
      />
      <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger">
        {{ team?.captain ? '队长':'队员' }}
      </van-tag>
    </template>
  </van-cell>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

import {inject, onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
  import { showSuccessToast, showFailToast } from 'vant';
import webSocketConfig from "../../config/webSocketConfig";
import {messageType} from "../../services/MessageType";
import store from "../../store";

const router = useRouter();
const teamList = ref([]);
const userId = ref();
const user = ref();

let socket: any;
onMounted(async ()=>{
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
   user.value =store.getters.getUser
  await webSocketConfig.initSocket();
  if (socket == null) {
    socket = webSocketConfig.getSocket();
  }
  getMessage();
  userId.value = user.value.id;
   myAxios.get("/partner/team/check").then(res =>{
     if (res.code === 200) {
       teamList.value = res.data;
     }
   });


})

const getMessage=() =>{
  socket.onmessage = (msg:string) => {
    const messages:messageType =JSON.parse(msg.data);
    if (messages.type === 2) {
    }
  }
}


const doJoinTeam = () => {
  router.push({
    path: "/team/add",
  })
}
const toChat = (teamId:string,name:string) => {
  router.push({
    path: '/chatTeam',
    query: {
      teamID: teamId,
      teamNane: name,
    },
    replace: true,

  })
}
</script>

<style scoped>

</style>
