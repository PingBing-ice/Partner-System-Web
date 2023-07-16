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
    <SearchCard @mess="setTxt" @click="onSearch" :placeholder="'请输入好友昵称'"/>
  </form>
  <div v-if="searchUserList&&searchUserList.length>0">
    <user-card-list :user-list="searchUserList" @userId="showAddUserOn"/>
  </div>
  <van-empty v-if="searchUserList.length<=0" description="无数据"/>
  <div v-if="is">
    <van-loading size="24px" vertical>加载中...</van-loading>
  </div>


</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {showToast} from 'vant';
import {useRouter} from "vue-router";
import SearchCard from "@/components/SearchCard.vue";
import UserCardList from "@/components/UserCardList.vue";
import store from "@/store";
import userRequest from "@/plugins/request/userRequest";

const user = ref();
const is = ref(false);
const showAddUser = ref(false);
const searchValue = ref("");
const userId = ref<number>(0);
const searchUserList = ref([]);
const router = useRouter();
const message = ref('');

const setTxt = (value:string) => {
  searchValue.value = value;
}
onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
    router.back();
    return;
  }
  user.value = store.getters.getUser
})


const onSearch = async () => {
  if (user.value == null || searchValue.value === '') {
    showToast({message: '请输入内容', position: 'top'});
    return;
  }
  is.value = true;
  const response = await userRequest.search(1, 10, searchValue.value);
  if (response.code === 200 && response.data) {
    const userList = response.data.records;
    for (let userListElement of userList) {
      userListElement.tags = JSON.parse(userListElement.tags)
    }
    searchUserList.value = userList;
  }
  is.value = false;
}
const showAddUserOn = (id:number) => {
  showAddUser.value = true;
  userId.value = id;
}
const sendFriendRequest = async () => {
  if (userId.value === 0) {
    return;
  }
  const response = await userRequest.addFriend(userId.value, message.value);
  if (response.code === 200) {
    if (response.data === 1) {
      showToast({message: '同意好友申请', position: 'top'});
      return;
    }
    showToast({message: '发送成功', position: 'top'});
  } else {
    if (response.description) {
      showToast({message: response.description, position: 'top'});
    }
  }
}
const close = () => {
  message.value = '';
  userId.value = 0;
}
</script>

<style scoped>

</style>
