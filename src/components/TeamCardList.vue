<template>
  <div class="teamCard">
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
        <van-button plain size="mini" type="primary" @click="addTeam(team.id,team.status)">加入队伍</van-button>
        <van-button size="mini" plain type="primary" @click="isShow(team.id,team.status)">查看详情</van-button>
      </template>
    </van-card>
  </div>

</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStateEnum} from "../states/team";
import {ref} from "vue";

const emits = defineEmits(['addTeam', 'teamShow'])
const show = ref(false)

interface TeamCardListType {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListType>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
})


/**
 * 加入队伍
 */
const addTeam = async (id: string, status: number) => {

  emits("addTeam", id, status);
}

const isShow = (id: string, status: number) => {

  emits("teamShow", id, status);

}
</script>

<style scoped>
.van-popup--center {
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate3d(-50%, -50%, 0);
}
</style>
