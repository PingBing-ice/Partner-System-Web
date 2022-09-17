<template>
  <template v-if="team">
    <van-cell :title="teamName.name" is-link :value="team.name"/>
    <van-cell :title="teamName.description" :value="team.description"/>
    <van-cell :title="teamName.maxNum" is-link :value="team.maxNum"/>
    <van-cell :title="teamName.status" is-link :value="team.status"/>
    <van-cell :title="teamName.userVo" is-link @click="isShow"/>
    <van-cell :title="teamName.expireTime" :value="team.expireTime"/>
    <van-cell :title="teamName.createTime" :value="team.createTime"/>
    <van-button type="danger" round @click="edit" plain hairline :loading="editState" loading-text="退出中..." size="large">退出队伍</van-button>
  </template>
  <van-action-sheet
      v-model:show="show"
      round
      position="bottom"
  >
    <user-card-list :userList="userVo"/>
  </van-action-sheet>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import MyAxios from "../../plugins/myAxios";
import myAxios from "../../plugins/myAxios";
import UserCardList from "../../components/UserCardList.vue";
import {getCurrentUser} from "../../services/users";
import {Dialog, Toast} from "vant";

const editState = ref(false);
const show = ref(false);
const route=useRoute()
const router=useRouter()
const teamID =route.query.teamID
const userVo = ref([])
const teamName = {
  name: '队伍名称',
  description: '队伍描述',
  maxNum: '最大人数',
  status: '状态',
  userVo: '人员',
  expireTime: '过期时间',
  createTime: '创建时间'
}
const team = ref();
onMounted(async ()=>{
  const userStatue =await getCurrentUser()
  const response = await MyAxios.get("/partner/team/get",{
    params: {
      id: teamID,
    }
  })
  if (response.code === 200) {
    team.value = response.data;
    const userList = response.data.userVo
    userVo.value= userList.filter(user => {
      if (user.id === userStatue.id) {
        return false;
      }
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
      return true;

    })
  }
})
const edit =  () => {
  editState.value = true;
  Dialog.confirm({
    title: '确认退出吗?',
  }).then(async() => {
        const res = await myAxios.post("/api/user/Logout");
        // @ts-ignore
        if (res.code === 200) {
          editState.value = false;
          await router.push({path: '/find'})
        }else {
          Toast.fail(res.description)
        }
        // on confirm
      }).catch(() => {
        editState.value = false;
        // on cancel
      });
}
const isShow = () => {
  show.value = true;

}
</script>

<style scoped>

</style>
