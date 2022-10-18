<!--基础布局-->
<template xmlns="http://www.w3.org/1999/html">
  <div v-if="route.path==='/'">
    <UserLogin/>
  </div>
  <div v-if="route.path==='/register'">
    <UserRegister/>
  </div>
  <div v-if="route.path==='/forget'">
    <UserForget/>
  </div>
  <div v-if="route.path!=='/'&& route.path!=='/register'&& route.path!=='/forget'">
    <van-nav-bar v-if="route.path==='/index'|| route.path==='/team'|| route.path==='/find'"
                 :title="title"
                 @click-left="findUser"
                 @click-right="onClickRight"
    >
      <template #left>
        <van-image
            round
            width="1.8rem"
            height="1.8rem"
            :src="user?.avatarUrl"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>

    <van-nav-bar v-if="route.path!=='/index'&& route.path!=='/team'&& route.path!=='/find'
    && route.path!== '/chatTeam'&& route.path!=='/toChat'&& route.path!=='/userTeam'"
                 :title="title"
                 left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRight"
    >
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>
    <div id="contents">
      <!--    <template v-if="active === 'index'">-->
      <!--      <Index/>-->
      <!--    </template   v-if="route.path ==='/user'|| route.path === '/search'||
    route.path==='/user/edit'||route.path==='/userTeam/add'">-->
      <!--    <template v-if="active === 'team'">-->
      <!--      <Team/>-->
      <!--    </template>-->
      <router-view/>
    </div>
    <van-tabbar route >
      <van-tabbar-item replace to="/index" icon="home-o" name="index">主页</van-tabbar-item>
      <van-tabbar-item replace to="/team" icon="search" name="team">队伍</van-tabbar-item>
      <van-tabbar-item replace to="/find" icon="chat-o" name="chat">发现</van-tabbar-item>
    </van-tabbar>
  </div>


</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {nextTick, onMounted, provide, ref} from "vue";
import UserLogin from "../pages/user/UserLogin.vue";
import UserRegister from "../pages/user/UserRegister.vue";
import {getCurrentUser} from "../services/users";
import routeConfig from "../config/routeConfig";
import UserForget from "../pages/user/UserForget.vue";


const router = useRouter();
const route = useRoute();
const user = ref();
const DEFAULT_TITLE = "伙伴系统";
const title = ref(DEFAULT_TITLE);

router.beforeEach(async (to,from)=>{
  if (to.path === '/index' || to.path === '/team' || to.path === '/find') {
    if (!user.value || user.value.avatarUrl.length <= 0) {
      user.value = await getCurrentUser();
    }
  }
  let toPath =to.path;
  const route =routeConfig.routes.find((router)=>{

    return toPath == router.path;
  })

  title.value = route?.title ?? DEFAULT_TITLE;

})

provide('indexUser', async () => {
  // 防止每次执行
  if (!user.value || user.value.avatarUrl.length <= 0) {
    user.value = await getCurrentUser();
  }

});

onMounted(async () => {

})
const findUser = () => {
  router.push({
    path: "/user"
  })
}
const onClickLeft = () => {
  router.back()
}
const onClickRight = () => {
  router.push('/search')
}


</script>

<style scoped>
#contents {
  padding-bottom: 50px;
  overflow-y: auto;
}
</style>
