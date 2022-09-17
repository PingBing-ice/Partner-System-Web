<template>

  <van-cell title="添加好友" is-link to="/findFriend" style="width: 365px"/>
  <div>
    <van-badge :content="friendUserListLength" style="width: 365px" v-if="friendUserListLength!==0">
      <van-cell is-link @click="showPopup">好友申请</van-cell>
    </van-badge>
    <van-cell is-link @click="showPopup" style="width: 365px" v-else>好友申请</van-cell>
  </div>
  <van-popup v-model:show="show" position="bottom" round :style="{ height: '30%' }">
    <div v-for="friendUser in friendUserList">
      <van-card
          v-if="friendUserList!=null && friendUserList.length >=0"
          :desc="friendUser.profile"
          :title="friendUser.username"
          :thumb="friendUser.avatarUrl"
      >
        <template #footer>
          <van-button size="mini" @click="rejectFriend(friendUser.id)">拒绝添加</van-button>
          <van-button size="mini" @click="addFriend(friendUser.id)">添加好友</van-button>
        </template>
      </van-card>

    </div>
  </van-popup>
  <van-collapse v-model="activeNames" style="width: 365px" @click="selectFriend">
    <van-collapse-item title="好友列表" name="1">
      <van-cell :value="userList.userAccount" v-for="userList in list" center
                @click="toChat(userList.id,userList.username,userList.avatarUrl)">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <van-image
              round
              width="40px"
              height="40px"
              :src="userList.avatarUrl"
          />
        </template>
      </van-cell>
    </van-collapse-item>
  </van-collapse>

</template>
<script setup>
import {inject, onMounted, ref} from "vue";

import {Toast} from "vant";
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {getCurrentUser} from "../../services/users";

const router = useRouter();
const show = ref(false);
const friendUserList = ref([]);
const friendUserListLength = ref();
const user = ref();
const activeNames = ref(['1']);
const list = ref([]);

onMounted(async () => {
  user.value = getCurrentUser()
  if (user.value == null) {
    return;
  }
  const friendUser = await myAxios.get("/partner/friend/userFriend/checkFriend").then(res => {
    if (res.data !== null) {
      friendUserList.value = res.data;
      friendUserListLength.value = friendUserList.value.length;
    }
  })
  const res = await myAxios.get("/partner/friend/userFriend/selectFriendList")
  if (res) {
    list.value = res.data;
  }
})
const rejectFriend = async (id) => {

  const res = await myAxios.get("/partner/friend/userFriend/rejectFriend", {
    params: {
      id: id,
    }
  });
  if (res.code === 200 && friendUserList.value.length !== 0) {
    friendUserList.value = friendUserList.value.filter(user => {
      if (user.id === id) {
        return false;
      }
    })
    friendUserListLength.value -= 1;
    Toast.success("拒绝成功!");

  } else {
    Toast.fail(res.message);
  }

}
const addFriend = async (id) => {
  const res = await myAxios.get("/partner/friend/userFriend/acceptFriendReq", {
    params: {
      reqId: id,
    }
  });
  if (res.code === 200 && friendUserList.value.length !== 0) {
    friendUserList.value = friendUserList.value.filter(user => {
      if (user.id === id) {
        return false;
      }
    })
    friendUserListLength.value -= 1;
    await router.push({path: '/find'})
    Toast.success("添加成功!");
  }
}

const showPopup = () => {
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
