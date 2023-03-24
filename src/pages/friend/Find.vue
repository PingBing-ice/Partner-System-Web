<template>
  <van-cell title="添加好友" is-link to="/findFriend"/>
  <div>
    <van-badge :content="friendUserListLength" style="width: 98%" v-if="friendUserListLength!==0">
      <van-cell is-link @click="showPopup" title="好友申请"></van-cell>
    </van-badge>
    <van-cell is-link @click="showPopup" title="好友申请" v-else></van-cell>
  </div>
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
      <van-cell :value="userList.userAccount" v-for="userList in list" center
                @click="toChat(userList.id,userList.username,userList.avatarUrl)">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <van-image
              round
              width="1.8rem"
              height="1.8rem"
              :src="userList.avatarUrl"
          />
        </template>
      </van-cell>
    </van-collapse-item>
  </van-collapse>

</template>
<script setup>
import {inject, onMounted, ref} from "vue";
import {showSuccessToast, showFailToast} from 'vant';
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import store from "../../store";

const router = useRouter();
const show = ref(false);
const friendUserList = ref([]);
const friendUserListLength = ref();
const user = ref();
const activeNames = ref(['1']);
const list = ref([]);
const reload = inject('reload')

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
      for (let i = 0; i < userList.length; i++) {
        if (userList[i].tags) {
          userList[i].tags = JSON.parse(userList[i].tags)
        }
        friendUserList.value.push(userList[i])
      }
      friendUserListLength.value = friendUserList.value.length;
    }
  })
  myAxios.get("/partner/friend/userFriend/select").then(resp => {
    if (resp.code === 200 && resp.data) {
      list.value = resp.data;
    }
  })
})
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
    --friendUserListLength.value ;
    showSuccessToast("成功");
  } else {
    showFailToast(resp.message);
  }
  show.value = false;
}
const addFriend = async (id) => {
  await reject(id, null);
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
    path: "/toChat",
    query: {
      friendId: friendId,
      username: name,
      avatarUrl: avatarUrl,
    }
  })
}

</script>

<style scoped>

</style>
