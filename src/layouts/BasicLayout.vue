<!--基础布局-->
<template xmlns="http://www.w3.org/1999/html">
  <div v-if="route.path==='/'">
    <UserLogin/>
  </div>
  <div v-if="route.path==='/register'">
    <UserRegister/>
  </div>
  <div v-if="route.path!=='/'&& route.path!=='/register'">
    <van-nav-bar v-if="route.path==='/index'|| route.path==='/team'|| route.path==='/find'"
                 title="用户中心"
                 @click-left="findUser"
                 @click-right="onClickRight"
    >
      <template #left>
        <van-image
            round
            width="25px"
            height="25px"
            :src="user?.avatarUrl"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>

    <van-nav-bar v-else-if="route.path!=='/chatTeam' &&route.path!=='/toChat '&&route.path!== '/userTeam' "
        :title="route.path==='/user'? '用户中心': '搜索'"
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
      <!--    </template>-->
      <!--    <template v-if="active === 'team'">-->
      <!--      <Team/>-->
      <!--    </template>-->
      <router-view/>
    </div>
    <van-tabbar route @change="onChange">
      <van-tabbar-item replace to="/index" icon="home-o" name="index">主页</van-tabbar-item>
      <van-tabbar-item replace to="/team" icon="search" name="team">队伍</van-tabbar-item>
      <van-tabbar-item replace to="/find" icon="chat-o" name="chat">发现</van-tabbar-item>
    </van-tabbar>
  </div>


</template>
<script setup>
import {Toast} from 'vant';
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import UserLogin from "../pages/user/UserLogin.vue";
import UserRegister from "../pages/user/UserRegister.vue";
import {getCurrentUser} from "../services/users";

const router = useRouter();
const route = useRoute();
const user = ref();
const onChange = (index) =>{

}
onMounted(async () => {
  user.value = await getCurrentUser();
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
#contents{
  padding-bottom: 50px;
  overflow-y: auto;
}
</style>
