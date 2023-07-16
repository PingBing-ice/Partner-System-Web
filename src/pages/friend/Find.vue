<template>
  <van-nav-bar :title="route.name">
    <template #right>
      <van-icon name="search" size="18" @click="toSearch"/>
    </template>
    <template #left v-if="store.getters.getIsLogin">
      <img @click="toUser" :src="user?.avatarUrl" alt="" class="avatar">
    </template>
  </van-nav-bar>
  <van-cell title="添加好友" is-link to="/search/friend"/>
  <van-cell is-link @click="showPopup" title="好友申请">
    <template #title v-if="friendUserListLength!==0">
      <van-badge :content="friendUserListLength" style="width: 98%" >
        好友申请
      </van-badge>
    </template>
  </van-cell>

  <van-popup v-model:show="show" position="bottom" round :style="{ height: '30%' }">
    <div v-for="friendUser in friendUserList">
      <van-card
          v-if="friendUserList!=null && friendUserList.length >=0"
          :desc="friendUser.profile"
          :title="friendUser.username"
          :thumb="friendUser.avatarUrl"
      >
        <template #tags>
          <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger"
                   v-for="tag in friendUser.tags">
            {{ tag }}
          </van-tag>
        </template>
        <template #footer>
          <van-button size="mini" @click="rejectFriend(friendUser.id)">拒绝添加</van-button>
          <van-button size="mini" @click="addFriend(friendUser.id)">添加好友</van-button>
        </template>
      </van-card>

    </div>
  </van-popup>
  <van-collapse v-model="activeNames" @click="selectFriend">

    <van-collapse-item title="队伍列表" name="2">
      <van-cell :value="team.name" v-for="team in teamList" center @click="toTeam(team?.teamId,)">
        <template #title>
          <van-image
              round
              width="40px"
              height="40px"
              :src="team.avatarUrl"
          />
          <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger">
            {{ team?.captain ? '队长':'队员' }}
          </van-tag>
        </template>
      </van-cell>
    </van-collapse-item>
    <van-collapse-item title="好友列表" name="1">
      <van-cell v-for="userList in list" center
                @click="toChat(userList.id,userList.username,userList.avatarUrl)">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <van-image
              round
              width="1.8rem"
              height="1.8rem"
              :src="userList.avatarUrl"
          />
          <span class="find-name">
            <span class="find-username">
              {{ userList.username }}
            </span>
            <span class="find-stu">
              [{{userList.online ? '在线' : '离线' }}]
            </span>
          </span>

        </template>
        <template #right-icon>
        </template>
      </van-cell>
    </van-collapse-item>
  </van-collapse>
</template>
<script setup lang="ts">
import {inject, onMounted, provide, ref, watch, watchEffect} from "vue";
import {showSuccessToast, showFailToast, showNotify, showToast} from 'vant';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import store from "../../store";
import teamRequest from "../../plugins/request/teamRequest";

const router = useRouter();
const route= useRoute();
const show = ref(false);
const friendUserList = ref([]);
const friendUserListLength = ref(0);
const user = ref();
const activeNames = ref(['1']);
const list = ref([]);
const teamList = ref([]);

onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  user.value = store.getters.getUser
  myAxios.get("/friend/check").then(res => {
    if (res.code === 200 && res.data) {
      const userList = res.data;
      for (let userListElement of userList) {
        if (userListElement.tags) {
          userListElement.tags = JSON.parse(userListElement.tags)
        }
        friendUserList.value.push(userListElement)
      }

      friendUserListLength.value = friendUserList.value.length;
    }
  })
   const response = await teamRequest.check();
  if (response.code === 200) {
    teamList.value = response.data;

  }
  selectFriends();
})
const selectFriends = () => {
  myAxios.get("/friend/select").then(resp => {
    if (resp.code === 200 && resp.data) {
      list.value = resp.data;
    }
  })
}
const rejectFriend = async (id) => {
  await reject(null, id)
}
const reject = async (acceptId, refuseId) => {
  if (friendUserList.value.length === 0) {
    return;
  }
  const resp = await myAxios.post("/partner/friend/userFriend/reject", {
    acceptId: acceptId,
    refuseId: refuseId
  })
  if (resp.code === 200) {
    friendUserList.value = friendUserList.value.filter(user => {
      if (acceptId != null) {
        if (user.id === acceptId) {
          return false;
        }
      }
      if (refuseId != null) {
        if (user.id === refuseId) {
          return false;
        }
      }
      return true;
    })
    --friendUserListLength.value;
    showToast({message: '成功', position: 'top'});
  } else {
    showToast({message: resp.message, position: 'top'});
  }
  show.value = false;
}
const addFriend = async (id) => {
  await reject(id, null);
  selectFriends();
}

const showPopup = () => {
  if (!friendUserList.value || friendUserList.value.length <= 0) {
    showToast({message:'无申请',position: 'top'});
    return;
  }
  show.value = true;
};

const selectFriend = async () => {

}
const toChat = (friendId, name, avatarUrl) => {
  router.push({
    path: "/chat",
    query: {
      id: friendId,
      name: name
    }
  })
}
const toTeam = (teamId) => {
  router.push({
    path: '/chat/team',
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
.find-username {
  font-weight: 500;
  font-size: 1rem;
  color: black;
}
.find-name{
  display: flex;
  margin-left: 15px;
  flex-direction: column;
}
.find-status {
  color: #777;
  font-size: 13px;
}
.find-stu{
  color: #777;
}
</style>
