<template>
  <UserCardList :user-list="userList"/>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../config/myAxios";
import {showSuccessToast, showFailToast, showToast} from 'vant';
import UserCardList from "../../components/UserCardList.vue";

const route = useRoute();
let tags = route.query.tags;
const searchTest = route.query.searchTest;

const userList = ref([]);

// 页面加载完成之后执行
onMounted(async () => {
  if (tags === ''|| searchTest==='') {
    return;
  }
  if (tags.length <= 0) {
    tags = [];
  }
// 上面的请求也可以这样做
  const userListData = await myAxios.post('/api/user/search/tags/txt', {
    'tagNameList': tags,
    'searchTxt': searchTest,
  }).then((response) => {
    showToast({message: '查找成功', position: 'top'});
    const res = response.data
    if (res.length !== 0) {
      showToast({message: '查找成功', position: 'top'});
    } else {
      showToast({message: '查无此人', position: 'top'});
    }
    return res;

  }).catch(((error) => {
    showToast({message: '查找失败', position: 'top'});
  }));
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
})

</script>

<style scoped>

</style>
