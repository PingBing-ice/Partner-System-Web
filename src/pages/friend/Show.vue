<template>
  <template v-if="user">
    <van-cell :title="userName.avatarUrl">
      <van-image
          round
          width="30px"
          height="30px"
          :src="user.avatarUrl"
      />
    </van-cell>
    <van-cell :title="userName.username"  :value="user.username"/>
    <van-cell :title="userName.userAccount" :value="user.userAccount"/>
    <van-cell :title="userName.gender" is-link :value="user.gender"/>
    <van-cell title="标签" >
      <template #right-icon>
        <van-tag plain  v-for="tag in user.tags" type="primary"   size="large" >{{tag}}</van-tag>
      </template>
    </van-cell>
    <van-cell :title="userName.tel"  :value="user.tel" />
    <van-cell :title="userName.email"  :value="user.email" />
    <van-cell :title="userName.createTime" :value="user.createTime"/>
    <van-button type="danger" round @click="edit" plain hairline :loading="editState" loading-text="退出中..." size="large">删除用户</van-button>
  </template>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import {Dialog, Toast} from "vant";

const route = useRoute();
const router = useRouter();
const editState = ref(false);
const friendId =route.query.friendId;
const user = ref();
const userName = {
  username: '昵称',
  userAccount: '账号',
  avatarUrl: '头像',
  gender: '性别',
  tel: '号码',
  email: '邮箱',
  planetCode: '编号',
  createTime: '添加时间'
}
onMounted(async ()=>{
  const res = await myAxios.get("/partner/friend/userFriend/getFriendUser",{
    params:{
      friendId:friendId
    }
  })
  if (res.code === 200) {
    const userNum =res.data
    if (userNum.tags) {
      userNum.tags = JSON.parse(userNum.tags);
    }
    user.value = userNum;
  }else {
    Toast.fail(res.description)
  }
})
const edit =  () => {
  editState.value = true;
  Dialog.confirm({
    title: '确认删除吗?',
  }).then(async() => {
    const res = await myAxios.get("/partner/friend/userFriend/delFriendUser",{
      params:{
        friendId:friendId
      }
    })
    // @ts-ignore
    if (res.code === 200) {
      editState.value = false;
      await router.push({path: '/'})
    }else {
      Toast.fail(res.description)
    }

    // on confirm
  }).catch(() => {
    editState.value = false;
    // on cancel
  });
}
</script>

<style scoped>

</style>
