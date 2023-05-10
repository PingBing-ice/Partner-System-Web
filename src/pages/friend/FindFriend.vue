<template>
  <van-dialog v-model:show="showAddUser" title="确认添加好友吗?" @confirm="sendFriendRequest" @closed="close"
              show-cancel-button>
    <van-cell-group inset>
      <van-field
          v-model="message"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="请输入备注"
      />
    </van-cell-group>
  </van-dialog>
  <form action="/">
    <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
  </form>
  <div v-if="searchUserList&&searchUserList.length>0">
    <user-card-list :user-list="searchUserList" v-on:userId="showAddUserOn"/>
  </div>
  <van-empty v-if="searchUserList.length<=0" description="无数据"/>
  <div v-if="is">
    <van-loading size="24px" vertical>加载中...</van-loading>
  </div>


</template>

<script setup>
import {ref, onMounted} from "vue";
import {showFailToast, showSuccessToast, showToast} from 'vant';
import {useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import UserCardList from "../../components/UserCardList.vue";
import store from "../../store";

const user = ref();
const is = ref(false);
const showAddUser = ref(false);
const searchValue = ref("");
const userId = ref("");
const searchUserList = ref([]);
const router = useRouter();

onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录!', position: 'top'});
    router.back();
    return;
  }
  user.value = store.getters.getUser
})

const message = ref('');

const onSearch = async () => {
  if (user.value == null || searchValue.value === '') {
    showToast({message: '请输入内容', position: 'top'});
    return;
  }
  is.value = true;
  const response = await myAxios.post('/api/user/search', {
    pageNum: 1,
    pageSize: 10,
    userName: searchValue.value
  });
  if (response.code === 200 && response.data) {
    const userList = response.data.records;
    for (let userListElement of userList) {
      userListElement.tags = JSON.parse(userListElement.tags)
    }
    searchUserList.value = userList;
  } else {
    showFailToast(response.description)
    is.value = false;
  }
  is.value = false;
}
const showAddUserOn = (id) => {
  showAddUser.value = true;
  userId.value = id;
}
const sendFriendRequest = async () => {
  if (userId.value === '') {
    return;
  }
  const resp = await myAxios.post("/partner/friend/userFriend/friend", {
    toUserId: userId.value,
    message: message.value,
  })
  console.log(resp.code)
  console.log(resp.data)
  debugger
  if (resp.code === 200) {
    if (resp.data === 1) {
      showToast({message: '同意好友申请', position: 'top'});
      return;
    }
    showToast({message: '发送成功', position: 'top'});
  } else {
    if (resp.description) {
      showToast({message: resp.description, position: 'top'});
    }
  }
}
const close = () => {
  message.value = '';
  userId.value = '';
}
</script>

<style scoped>

</style>
