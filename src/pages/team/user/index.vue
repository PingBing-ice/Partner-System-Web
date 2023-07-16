<template>
  <van-nav-bar
      :title="teamNameTitle"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRightTeam"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <template v-if="team && team?.captain">
    <van-cell title="头像">
      <van-uploader :after-read="afterRead">
        <van-image
            round
            width="30px"
            height="30px"
            :src="team?.avatarUrl"
        />
      </van-uploader>
    </van-cell>
    <van-cell :title="teamName.name" is-link :value="team.name"/>
    <van-cell :title="teamName.description" is-link @click="toEdit(teamName.description,team?.description,'description')" :value="team?.description"/>
    <van-cell :title="teamName.maxNum" is-link @click="toEdit(teamName.maxNum,team?.maxNum,'maxNum')"  :value="team?.maxNum"/>
    <van-cell :title="teamName.status" is-link :value="teamStateEnum[team?.status]" @click="toEdit(teamName.status,team?.status,'status')"/>
    <van-cell :title="teamName.userVo" is-link @click="isShow"/>
    <van-cell :title="teamName.expireTime" :value="team?.expireTime"/>
    <van-cell :title="teamName.createTime" :value="team?.createTime"/>
    <van-button type="danger" style="background: #fff;color: #ee0a24;border: 1px solid #ee0a24" round @click="edit" plain hairline loading-text="退出中..." size="large">退出队伍</van-button>
    <van-button type="danger" round style="background: #fff;color: #ee0a24;border: 1px solid #ee0a24;margin-top: 10px"
                @click="clearTeam" plain hairline  :loading="editState" loading-text="退出中..." size="large">解散队伍</van-button>
  </template>
  <template v-if="team && !team?.captain">
    <van-cell :title="teamName.name"  :value="team.name"/>
    <van-cell :title="teamName.description" :value="team?.description"/>
    <van-cell :title="teamName.maxNum"  :value="team?.maxNum"/>
    <van-cell :title="teamName.status"  :value="team?.status"/>
    <van-cell :title="teamName.userVo" is-link @click="isShow"/>
    <van-cell :title="teamName.expireTime" :value="team?.expireTime"/>
    <van-cell :title="teamName.createTime" :value="team?.createTime"/>
    <van-button type="danger" style="background: #fff;color: #ee0a24;border: 1px solid #ee0a24" round @click="edit" plain hairline loading-text="退出中..." size="large">退出队伍</van-button>
  </template>
  <van-action-sheet
      v-model:show="show"
      round
      position="bottom"
  >
    <van-card  v-for="user in userVo"
              :desc="user.profile"
              :title="user.userAccount"
              :thumb="user.avatarUrl"
    >
      <template #tags>
        <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger" v-for="tag in user.tags">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" @click="sendFriendRequest(user.id)">添加好友</van-button>
        <van-button v-if="team?.captain" size="mini" @click="quitUser(team?.id,user.id)">踢出队伍</van-button>
      </template>
    </van-card>
  </van-action-sheet>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import MyAxios from "../../../config/myAxios";
import myAxios from "../../../config/myAxios";
import UserCardList from "../../../components/UserCardList.vue";
import {Dialog, showToast} from "vant";
import {teamStateEnum} from "../../../states/team";
import store from "../../../store";
import { showSuccessToast, showFailToast } from 'vant';
import { showConfirmDialog } from 'vant';

const editState = ref(false);
const show = ref(false);
const route=useRoute()
const router=useRouter()
const teamID =route.query.teamID
const teamNameTitle =route.query.teamName
const userVo = ref([])
const userId = ref()
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
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  const userStatue =store.getters.getUser
  userId.value = userStatue.id
  const response = await MyAxios.get("/team/get",{
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
const clearTeam = () => {
  editState.value = true;
  showConfirmDialog({
    title: '删除队伍?',
    message:
        '删除队伍会删除队伍里所有的文章,确定删除吗',
  }).then(async() => {
    const res = await myAxios.post("/post/delete/team",teamID);
    if (res.code === 200) {
      editState.value = false;
      showToast({message: '解散成功', position: 'top'});

      await router.push({path: '/team'})
    }else {
      editState.value = false;
      showFailToast(res.description)
    }
    // on confirm
  }).catch(() => {
    editState.value = false;
    // on cancel
  });
}
// 退出队伍
const edit =  () => {
  editState.value = true;
  showConfirmDialog({
    title: '确认退出吗?',
  }).then(async() => {
        const res = await myAxios.get("/team/quit",{
            params: {
              teamId: teamID
            }
        });
        if (res.code === 200) {
          editState.value = false;
          showToast({message: '退出成功', position: 'top'});
          await router.push({path: '/team'})
        }else {
          editState.value = false;
          showFailToast(res.description)
        }
        // on confirm
      }).catch(() => {
        editState.value = false;
        // on cancel
      });
}
const isShow = () => {
  if (!userVo || userVo.value.length <= 0) {
    showFailToast("人员为空，请邀请好友");
    return;
  }
  show.value = true;

}
// 添加好友
const sendFriendRequest = async (id) => {
  const res = await myAxios.get("/friend/add", {
    params: {
      fid: id,
    }
  })
  // @ts-ignore
  if (res.code === 200) {
    showToast({message: '添加成功', position: 'top'});
  }else {
    // @ts-ignore
    showFailToast(res.description)
  }
}
const quitUser = (teamId,userId) => {
  showConfirmDialog({
    title: '确定踢出吗?',
  }).then( async () => {
        const res = await myAxios.post("/team/quitUserTeam",{
          "teamId": teamId,
          "userId": userId
        })
        if (res.code === 200) {
          userVo.value =userVo.value.filter(user => {
            return  userId !== user.id
          })
          showToast({message: '成功', position: 'top'});
        }
      }).catch(() => {
        // on cancel
      });

}
const onClickLeft = () => {
  router.back();
}
const onClickRightTeam = () => {
  router.push('/search')
}
// 上传头像
const afterRead = (file) => {
  showConfirmDialog({
    title: '每天只能修改一次',
    message: '是否上传?',
  }).then(async () => {
    const File = file.file
    let param =new FormData();
    param.append("file",File)
    const res = await myAxios.post(`/oss/file/upload/team/${teamID}`,param);
    if (res.code === 200) {
      avatar.value = res.data;
      showToast({message: '修改成功', position: 'top'});
    }else {
      showToast({message: res.description, position: 'top'});
    }
  }).catch(() => {

  });
}
const toEdit = (teamName,txt,editKey) => {
    router.push({
      path: '/user/team/add',
      query:{
        teamID,
        txt,
        teamName,
        editKey
      }
    })
}
</script>

<style scoped>

</style>
