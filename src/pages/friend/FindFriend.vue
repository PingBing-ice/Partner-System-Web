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
  <van-empty v-if="searchUserList.length<=0" description="无数据"/>
  <div v-if="is">
    <van-loading size="24px" vertical>加载中...</van-loading>
  </div>


</template>

<script setup>
import {ref, onMounted} from "vue";
import {showFailToast, showToast} from 'vant';
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import UserCardList from "../../components/UserCardList.vue";
import store from "../../store";

const user = ref();
const is = ref(false);
const searchValue = ref("");
const searchUserList = ref([]);
const router = useRouter();

onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  user.value = store.getters.getUser
})


const onSearch = async () => {
  if (user.value == null || searchValue.value === '') {
    showToast('请输入内容');
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
    for (let i = 0; i < userList; i++) {
      if (userList[i].tags) {
        userList[i].tags = JSON.parse(userList[i].tags)
      }
    }
    searchUserList.value = userList;
  } else {
    showFailToast(searchUserTo.description)
    is.value = false;
  }
  is.value = false;
}


</script>

<style scoped>

</style>
