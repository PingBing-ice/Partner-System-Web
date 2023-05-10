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
            {{ userList.userAccount }}
          </span>
        </template>
        <template #right-icon>
          <div class="find-status">
            {{ listStatus.has(userList.id) ? '在线' : '离线' }}
          </div>

        </template>
      </van-cell>
    </van-collapse-item>
  </van-collapse>
</template>
<script setup>
import {inject, onMounted, provide, ref, watch, watchEffect} from "vue";
import {showSuccessToast, showFailToast, showNotify} from 'vant';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import store from "../../store";

const router = useRouter();
const route= useRoute();
const show = ref(false);
const friendUserList = ref([]);
const friendUserListLength = ref(0);
const user = ref();
const activeNames = ref(['1']);
const list = ref([]);
const reload = inject('reload')
const ADV = inject('ADV')

const listStatus = ref(new Set("1"));
watchEffect(() => {
  const userId = ADV.value.userId
  const statuts = ADV.value.statuts
  if (userId && statuts) {
    listStatus.value.add(userId);
  } else if (userId && !statuts) {
    listStatus.value.delete(userId)
  }
})


onMounted(() => {
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  user.value = store.getters.getUser
  myAxios.get("/partner/friend/userFriend/check").then(res => {
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
  selectFriends();
})
const selectFriends = () => {
  myAxios.get("/partner/friend/userFriend/select").then(resp => {
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
    showSuccessToast("成功");
  } else {
    showFailToast(resp.message);
  }
  show.value = false;
}
const addFriend = async (id) => {
  await reject(id, null);
  selectFriends();
}

const showPopup = () => {
  if (!friendUserList.value || friendUserList.value.length <= 0) {
    showFailToast("没有好友申请")
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
    }
  })
}


const showNotifyAV = () => {
  let userAv = {
    username: user.value.userAccount,
    av: user.value.avatarUrl,
  }
};
const toUser = () => {
  router.push({path: '/user'})
}
const toSearch = () => {
  router.push({path: '/search'})
}
</script>

<style scoped>
.find-name {
  margin-left: 15px;
  position: absolute;
}

.find-status {
  color: #777;
  font-size: 13px;
}
</style>
