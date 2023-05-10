<!--基础布局-->
<template xmlns="http://www.w3.org/1999/html">
  <van-notify v-model:show="isNotify" @click="to(friend.friendType,friend.friendId)">
    <van-image
        round
        width="40px"
        height="40px"
        :src="friend.friendAUrl"
    />
    <div style="margin-left: 10px;">
      <div style="font-size: 15px;color: #000103;font-weight: bold;float: left">{{ friend.friendTitle }}
      </div>
      <br>
      <div style="font-size: 1px;color: #61666c">
        {{ friend.friendName + ': ' + friend.friendTxt }}
      </div>

    </div>

  </van-notify>
  <van-nav-bar v-if="!route.meta.isHeardAv&&route.path!=='/space'"
               :title="route.name"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight"

  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <van-nav-bar v-if="!route.meta.isHeardAv&&route.path==='/space'"
               :title="route.name"
               @click-right="onClickRight"

  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <div class="content">

    <div  class="con">
      <div id="viewContent" class="contents">
        <router-view v-slot="{ Component }">
          <transition>
            <keep-alive include="Index">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>


    </div>
  </div>
  <div class="tail">
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o" name="index">主页</van-tabbar-item>
      <van-tabbar-item replace to="/team" icon="search" name="team">队伍</van-tabbar-item>
      <van-tabbar-item replace to="/find" icon="chat-o" name="chat">通讯录</van-tabbar-item>
      <van-tabbar-item replace to="/space" icon="user-o" name="chat">我的</van-tabbar-item>
      <van-tabbar-item replace to="/test" icon="user-o" name="chat">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, provide, readonly, ref, watch} from "vue";
import UserLogin from "../pages/user/login/UserLogin.vue";
import UserRegister from "../pages/user/login/UserRegister.vue";
import routeConfig from "../config/routeConfig";
import UserForget from "../pages/user/login/UserForget.vue";
import store from "../store";
import webSocketConfig from "../config/webSocketConfig";
import {messageType} from "../services/MessageType";
import {chatStateEnum} from "../states/chat";
import Index from "../pages/Index.vue"
import PostCardList from "../components/PostCardList.vue";

const router = useRouter();
const route = useRoute();
const user = ref();

interface findType {
  userId: string,
  statuts: object
}

const findStatus = ref<findType>({
      userId: "",
      statuts: {},
    }
);
const friend = ref({
  friendAUrl: "",
  friendName: "",
  friendTxt: "",
  friendTitle: "",
  friendType: 0,
  friendId: "",
})
provide("ADV", readonly(findStatus))
const friendId = ref("");
const type = ref("");
const isNotify = ref(false);
const isAV = ref(false);
const DEFAULT_TITLE = "聚星";
const title = ref(DEFAULT_TITLE);
let socket: any;
onMounted(()=>{
  isAV.value = store.getters.getIsLogin;
})
watch(route, (newVal, oldVal) => {
  webSocketConfig.initSocket();
  socket = webSocketConfig.getSocket();
  socket.onmessage = (msg: any) => {
    const chatRecord: messageType = JSON.parse(msg.data);
    toChatType(chatRecord);
  }

})

onMounted(() => {
  user.value = store.getters.getUser

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

const to = (type: number, id: string) => {
  isNotify.value = false;
  switch (type) {
      // 好友
    case chatStateEnum.HY:
      if (id) {
        router.push({
          path: "/toChat",
          query: {
            id: id,
          }
        })
      }
      break;
      // 队伍
    case chatStateEnum.DW:
      if (id) {
        router.push({
          path: "/chatTeam",
          query: {
            id: id,
          }
        })
      }
      break;
      // 系统
    case chatStateEnum.SYSTEM:
      break;
      // 连接
    case chatStateEnum.LJ:
      break;
      // 心跳
    case chatStateEnum.XT:
      break;
      // 上线通知
    case chatStateEnum.ADV:
      break;
      // 大厅
    case chatStateEnum.HAL:
      break;
  }

}
const toChatType = (chatRecord: messageType) => {
  const chatType = chatRecord.type;
  friend.value.friendType = chatType;
  switch (chatType) {
      // 好友
    case chatStateEnum.HY:
      chatFriend(chatRecord);
      break;
      // 队伍
    case chatStateEnum.DW:
      chatTeam(chatRecord);
      break;
      // 系统
    case chatStateEnum.SYSTEM:
      break;
      // 连接
    case chatStateEnum.LJ:
      break;
      // 心跳
    case chatStateEnum.XT:
      break;
      // 上线通知
    case chatStateEnum.ADV:
      const userId = chatRecord.chatRecord.userId;
      const statuts = chatRecord.ext;
      if (userId && statuts != null) {
        findStatus.value.userId = userId
        findStatus.value.statuts = statuts
      }
      break;
      // 大厅
    case chatStateEnum.HAL:
      break;
  }
}
const chatFriend = (chatRecord: messageType) => {
  if (chatRecord.chatRecord.sendName) {
    chatNotify(chatRecord, chatRecord.chatRecord.sendName);
  }
}
const chatTeam = (chatRecord: messageType) => {
  chatNotify(chatRecord, "群聊")
}
const chatNotify = (chatRecord: messageType, notifyName: string) => {
  let userAv = {
    username: chatRecord.chatRecord.sendName,
    url: chatRecord.chatRecord.sendUrl,
  }
  if (userAv && userAv.username && userAv.url && chatRecord.chatRecord.message) {
    let message = chatRecord.chatRecord.message;
    let userId = chatRecord.chatRecord.userId;
    let sendId = chatRecord.chatRecord.sendId;
    if (userId && chatRecord.type === chatStateEnum.HY) {
      friend.value.friendId = userId;
    } else if (sendId && chatRecord.type === chatStateEnum.DW) {
      friend.value.friendId = sendId;
    }

    if (message.length > 18) {
      message = message.slice(0, 18) + "...";
    }
    friend.value.friendAUrl = userAv.url
    friend.value.friendTitle = userAv.username;
    friend.value.friendName = notifyName;
    friend.value.friendTxt = message;
    isNotify.value = true;
    setTimeout(() => {
      isNotify.value = false;
    }, 2000);
  }
}
</script>

<style scoped>




.is_contents {
  overflow-y: auto;
  height: 93%;
  width: auto;
  text-align: left;
}

.content {
  height: 100%;
  width: 100%;
}

.con {
  height: 100%;
  width: 100%;
}

.head {
  height: 7%;
}

.tail {
  height: 7%;
}
</style>
