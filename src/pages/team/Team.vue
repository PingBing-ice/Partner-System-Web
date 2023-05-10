<template>
  <van-nav-bar :title="route.name">
    <template #right>
      <van-icon name="search" size="18" @click="toSearch"/>
    </template>
    <template #left v-if="store.getters.getIsLogin">
      <img @click="toUser" :src="user?.avatarUrl" alt="" class="avatar">
    </template>
  </van-nav-bar>
  <van-button type="primary" @click="doJoinTeam" block round >创建队伍</van-button>
  <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
  >
    我的队伍
  </van-divider>
  <van-cell :value="team.name" v-for="team in teamList" center @click="toChat(team?.teamId,)">
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
import {useRouter,useRoute} from "vue-router";

import {onMounted, ref} from "vue";
import myAxios from "../../config/myAxios";
import {showFailToast, showToast} from 'vant';
import webSocketConfig from "../../config/webSocketConfig";
import store from "../../store";

const router = useRouter();
const route = useRoute();
const teamList = ref([]);
const userId = ref();
const user = ref();

onMounted(async ()=>{
  if (!store.getters.getIsLogin) {
    showToast({message:'未登录',position: 'top'});
    router.back();
    return;
  }
   user.value =store.getters.getUser

  userId.value = user.value.id;
   myAxios.get("/partner/team/check").then(res =>{
     if (res.code === 200) {
       teamList.value = res.data;
     }
   });


})




const doJoinTeam = () => {
  router.push({
    path: "/team/add",
  })
}
const toChat = (teamId:string) => {
  router.push({
    path: '/chatTeam',
    query: {
      id: teamId,
    },
    replace: true,

  })
}
const toUser = () => {
  router.push({path: '/user'})
}
const toSearch = () => {
  router.push({path: '/search'})
}
</script>

<style scoped>

</style>
