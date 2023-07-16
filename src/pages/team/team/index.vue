<template>
  <div class="addPostTop">
    <van-button icon="plus" round @click="toAddTeam" type="primary"/>
  </div>
  <van-nav-bar :title="route.name">
    <template #right>
      <van-icon name="search" size="18" @click="toSearch"/>
    </template>
    <template #left v-if="store.getters.getIsLogin">
      <img @click="toUser" :src="user?.avatarUrl" alt="" class="avatar">
    </template>
  </van-nav-bar>
  <div @click="toSearch">
    <SearchCard />
  </div>

  <div v-if="teamList&&teamList.length>0" v-for="team in teamList" @click="toTeam(team?.teamId,)">
    <div class="cell_value">
      <div class="cell_content">
        <div class="cell_image" >
          <img :src="team.avatarUrl"  alt="" width="40" height="40" style="border-radius: 10px">
        </div>
        <div class="cell_name">
          <div>
            {{team.name}}
          </div>
        </div>
      </div>
      <div class="cell_conter">
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
  <div v-if="teamList.length<=0&&isTeam===true">
    <div  style="width: 100%;height: 40%">
      <van-empty description="暂无队伍" >
<!--        <van-button round type="primary" class="bottom-button" style="width: 200px">点击创建</van-button>-->
      </van-empty>
    </div>
  </div>

</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import store from "../../../store";
import {showToast} from "vant";
import myAxios from "../../../config/myAxios";
import SearchCard from "../../../components/SearchCard.vue";

const router = useRouter();
const route = useRoute();
const user = ref(store.getters.getUser);
const teamList = ref([]);
const is = ref(0);
const isTeam = ref(false);
watch(is,()=>{
  console.log(is.value)
})
onMounted(() => {

  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
    router.push({
      path: '/index',
    });
    return;
  }
  isTeam.value = false;
  myAxios.get("/team/check").then(res =>{
    if (res.code === 200) {
      teamList.value = res.data;
    }
  });
  isTeam.value = true;
})
const setMess = (value) => {
  message.vale = value;
}
const toAddTeam = () => {
  router.push({
    path: '/post/add',
  })
}
const toSearch = () => {
  router.push({path: '/search'})
}
const toUser = () => {
  router.push({path: '/user'})
}
const toTeam = (teamId:number) => {
  // router.push({
  //   path: '/chat/team',
  //   query: {
  //     id: teamId,
  //   },
  // })
  router.push({
    path: '/team/post',
    query: {
      id: teamId,
    },
  })
}
</script>

<style scoped>
.cell_value{
  align-items: center;
  display: flex;
  height: 67px;
  width: calc(100% - 32px);
  justify-content: space-between;
  padding: 10px 16px;

}
.cell_content{
  flex: 1;
  display: flex;
  align-items: center;
}
.cell_conter{
  text-align: right;
  flex: 1;
}
.cell_name{
  margin-left: 20px;
}


/**/

</style>
