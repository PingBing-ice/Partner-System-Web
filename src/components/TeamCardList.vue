<template>
  <van-card v-for="team in props.teamList"
            :desc="team.description"
            :title="team.name"
            thumb="https://pic1.zhimg.com/80/v2-88c46f9f5b2aa6d6e04469fb989b7b54_720w.jpg"
  >
    <template #tags>
      <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger">
        {{ teamStateEnum[team.status] }}
      </van-tag>
    </template>
    <template #bottom>
      <div>
        {{ '当前人数: ' + team.userVo.length }}
      </div>
      <div>
        {{ '过期时间: ' + team.expireTime }}
      </div>
    </template>
    <template #footer>
      <van-button size="mini" plain type="primary" @click="isShow(team.id,team.status)">查看详情</van-button>
    </template>

  </van-card>
  <van-action-sheet
      v-model:show="show"
      round
      position="bottom"
  >
    <van-divider>{{'队伍最大人数: '+ max }}</van-divider>
    <van-button plain type="primary" round block @click="addTeam">加入队伍</van-button>
    <van-divider>队员</van-divider>
    <user-card-list :userList="userListVo"/>
  </van-action-sheet>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStateEnum} from "../states/team";
import {ref} from "vue";
import UserCardList from "./UserCardList.vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

interface TeamCardListType {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListType>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
})
const show = ref(false)
const max = ref(0)
const userListVo = ref([])
const teamID = ref("")
/**
 * 加入队伍
 */
const addTeam =async () => {
  const res:any =await myAxios.post("/partner/team/join",{
    teamId: teamID.value
  })
  if (res?.code == 200) {
    Toast.success("加入成功");
  }else {
    Toast.fail(res.description);
  }
}

const isShow = (id: string,status:number) => {

  if (status === 2) {
    console.log("=====================")
  }
  show.value = true;
  for (let i = 0; i < props.teamList.length; i++) {
    const team= props.teamList[i];
    if (team.id == id) {
      teamID.value = id
      userListVo.value = [];
      max.value = team.maxNum;
      // @ts-ignore
      userListVo.value = team.userVo
    }
  }
}
</script>

<style scoped>

</style>
