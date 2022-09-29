<template>
  <UserCardList :user-list="userList"/>
  <van-empty v-if="!userList || userList.length<1" description="空空如也"/>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import qs from 'qs'
import {Toast} from "vant";
import UserCardList from "../../components/UserCardList.vue";

const route = useRoute();
const tags = route.query.tags;

const userList = ref([]);

// 页面加载完成之后执行
onMounted(async () => {
// 上面的请求也可以这样做
  const userListData = await myAxios.get('/api/user/search/tags', {
    params: {
      tagNameList: tags
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false});
    }
  }).then((response) => {
    Toast.success("查找成功")
    const res = response.data
    if (res.length !== 0) {
      Toast.success("查找成功");
    } else {
      Toast.success("查无此人")
    }
    return res;

  }).catch(((error) => {
    Toast.fail("查找失败")
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
