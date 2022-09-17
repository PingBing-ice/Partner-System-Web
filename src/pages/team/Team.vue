<template>

  <van-button type="primary" @click="doJoinTeam" block round >创建队伍</van-button>
  <van-cell  v-for="team in teamList"  center  :value="team.description"  @click="toChat(team.teamId,team.name)">
    <template #title>
      <span class="custom-title">{{team.name+' '}}</span>
      <van-tag plain type="primary">{{userId === team.userId?'队长':'队员'}}</van-tag>
    </template>
    <template #right-icon >
      <span class="custom-title">{{team.description}}</span>
    </template>
  </van-cell>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import {getCurrentUser} from "../../services/users";
import {Toast} from "vant";
import webSocketConfig from "../../config/webSocketConfig";
import {messageType} from "../../services/MessageType";

const router = useRouter();
const teamList = ref([]);
const userId = ref();
const user = ref();

let socket: any;
onMounted(async ()=>{
   user.value = await getCurrentUser();
  if (user.value == null) {
    Toast.fail("未登录");
    return;
  }
  await webSocketConfig.initSocket();
  if (socket == null) {
    socket = webSocketConfig.getSocket();
  }
  getMessage();
  userId.value = user.value.id;
   const res =await myAxios.get("/partner/team/Check");
  if (res.code === 200) {
    teamList.value = res.data;
  }

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
