<template>
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
    <user-card-list :user-list="searchUserList"/>
  </div>
  <div v-if="is">
    <van-loading size="24px" vertical>加载中...</van-loading>
  </div>



</template>

<script setup>
import {ref, onMounted} from "vue";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {getCurrentUser} from "../../services/users";
import UserCardList from "../../components/UserCardList.vue";

const user = ref();
const is = ref(false);
const searchValue = ref("");
const searchUserList = ref([]);
const router = useRouter();

onMounted(async () => {
  user.value = await getCurrentUser();
  if (user.value == null) {
    Toast.fail("未登录");
  }
})



const onSearch = async () => {
  if (user.value == null || searchValue.value ==='') {
    return;
  }
  is.value = true;
  const searchUserTo = await myAxios.get('/api/user/searchUserName', {
    params: {
      userID: user.value.id,
      friendUserName: searchValue.value,
    }
  });
  if ( searchUserTo.code ===200&&searchUserTo.data) {
    for (let i = 0; i < searchUserTo.data.length; i++) {
      if (searchUserTo.data[i].tags) {
        searchUserTo.data[i].tags = JSON.parse(searchUserTo.data[i].tags)
      }
    }
    searchUserList.value = searchUserTo.data;
  }else {
    Toast.fail(searchUserTo.description)
    is.value = false;
  }
  is.value = false;
}


</script>

<style scoped>

</style>
