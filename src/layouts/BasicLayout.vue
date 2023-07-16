<!--基础布局-->
<template xmlns="http://www.w3.org/1999/html">
  <van-nav-bar v-if="!route.meta.isHeardAv&&route.path!=='/space'"
               :title="route.name"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight"

  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <van-nav-bar v-if="!route.meta.isHeardAv&&route.path==='/space'"
               :title="route.name"
               @click-right="onClickRight"

  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div class="content">

    <div class="con">
      <div id="viewContent" class="contents">
        <router-view v-slot="{ Component }">
          <transition>
            <keep-alive include="Index,teamPost">
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </div>


    </div>
  </div>
  <div class="tail">
        <van-tabbar route>
          <van-tabbar-item replace to="/" icon="home-o" name="index">主页</van-tabbar-item>
          <van-tabbar-item replace to="/team"  name="team" icon="friends-o">队伍
          </van-tabbar-item>
          <van-tabbar-item replace to="/find" icon="chat-o" name="chat">通讯录</van-tabbar-item>
          <van-tabbar-item replace to="/space" icon="user-o" name="chat">我的</van-tabbar-item>
        </van-tabbar>


  </div>
</template>
<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, provide, readonly, ref, watch} from "vue";

import store from "../store";

const router = useRouter();
const route = useRoute();
const user = ref();
const toAddPost = () => {
  router.push({
    path: '/post/add'
  })
}

const type = ref("");
const isAV = ref(false);
const DEFAULT_TITLE = "聚星";
const title = ref(DEFAULT_TITLE);
onMounted(() => {
  isAV.value = store.getters.getIsLogin;
  user.value = store.getters.getUser
  console.log()
})
const onClickLeft = () => {
  router.back()
}
const onClickRight = () => {
  router.push('/search')
}

</script>

<style scoped>

.tabs {
  display: flex;
  position: relative;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 99px;
}

.tabs * {
  z-index: 2;
}

.tabCon input[type="radio"] {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  position: relative;
  width: 50px;
  font-size: .8rem;
  color: black;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: 1%;
  left: 80%;
  font-size: 10px;
  margin-left: 0.75rem;
  border-radius: 50%;
  margin: 0px;
  background-color: #e6eef9;
  transition: 0.15s ease-in;
}

.tabCon input[type="radio"]:checked + label {
  color: #185ee0;
}

.tabCon input[type="radio"]:checked + label > .notification {
  background-color: #185ee0;
  color: #fff;
  margin: 0;
}

/*.tabCon input[id="radio-1"]:checked ~ .glider {*/
/*  transform: translateX(calc(10% - 300%));*/
/*}*/

/*.tabCon input[id="radio-2"]:checked ~ .glider {*/
/*  transform: translateX(-148%);*/
/*}*/


/*.tabCon input[id="radio-4"]:checked ~ .glider {*/
/*  transform: translateX(148%);*/
/*}*/

/*.tabCon input[id="radio-5"]:checked ~ .glider {*/
/*  transform: translateX(296%);*/
/*}*/

.glider {
  position: absolute;
  display: flex;
  height: 30px;
  width: 50px;
  background-color: #e6eef9;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 700px) {

  .tabs {
    /*transform: scale(0.6);*/
  }
}

.tabCon {

}

.tabs {
}
</style>
