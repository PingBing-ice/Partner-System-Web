<template>
  <van-notice-bar v-if="notice"
                  left-icon="volume-o"
                  scrollable
                  :text="notice"
  />
  <van-tabs v-model:active="active" @click-tab="onClickTab">
    <van-tab title="用户">
      <van-cell center :title="isMatchMode? '推荐模式':'普通模式'">
        <template #right-icon>
          <van-switch v-model="isMatchMode" size="24" :loading="isMatchModeLoading" />
        </template>
      </van-cell>
      <van-tabs v-if="userList||userList.length>0 && tagUserList|| tagUserList.length>0" v-model:active="activeName"
                @click-tab="onClickTag">
        <van-tab title="全部" name="a">
          <user-card-list :user-list="userList"/>
        </van-tab>
        <van-tab v-for="tag in tagList" :title="tag" :name="tag">
          <user-card-list v-if=" tagUserList || tagUserList.length>0" :user-list="tagUserList"/>
          <van-empty v-if=" !tagUserList || tagUserList.length<1" description="空空如也"/>
        </van-tab>
      </van-tabs>

    </van-tab>
    <van-tab title="队伍">
      <div :class="{'apply-shake':searchTeamName.value}">
        <van-search
            v-model="searchTxt"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @clear="onClear()"

        >
          <template #action>
            <div @click="onClickButton">搜索</div>
          </template>
        </van-search>
      </div>

      <team-card-list v-if="teamList && teamList.length>0" :teamList="teamList"/>
      <van-empty v-if="!teamList || teamList.length<1" description="空空如也"/>
    </van-tab>
  </van-tabs>

</template>

<script setup>
import {inject, onMounted, ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios";
import {Notify, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import TeamCardList from "../components/TeamCardList.vue";


const userList = ref([]);
const active = ref(0)
const description = ref("加载中......")
const teamList = ref([]);
const tagList = ref([]);
const tagUserList = ref([]);
const activeName = ref('a')
const notice = ref('')
const searchTxt = ref('')
const searchTeamName = ref(false)
const isMatchMode = ref(false)
const isMatchModeLoading = ref(false)


onMounted(async () => {
  const indexUser = inject('indexUser')
  indexUser();
  const response = await myAxios.get('/api/userNotice/getNotice', {
    params: {
      region: 1,
    }
  })
  if (response.code === 200) {
    notice.value = response.data;
  }

  const res = await myAxios.get('/api/userLabel/getLabel');
  if (res.code === 200) {
    tagList.value = res.data;
  }
})
const loadData = async () => {
  if (isMatchMode.value) {
    isMatchModeLoading.value = true;

    const response =await myAxios.get("/api/user/match", {
      params: {
        num: 3
      }
    })
    if (response.code === 200 && response.data) {
      userList.value = response.data;
      userList.value.forEach(user => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      });
      isMatchModeLoading.value = false;
    }else {
      isMatchModeLoading.value = false;
    }

  } else {
    isMatchModeLoading.value = true;
    const userListData = await myAxios.get('/api/user/recommend', {
      params: {
        current: 1,
        size: 500
      }
    });
    if (userListData.code === 200 && userListData.data) {
      userList.value = userListData.data.items;
      userList.value.forEach(user => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      });
      isMatchModeLoading.value = false;
    }else {
      isMatchModeLoading.value = false;
    }
  }
  if (userList.value.length === 0||!userList.value) {
    description.value = "空空如也";
  }


}
watchEffect(() => {
  loadData();
})

// 切换 tab
const onClickTab = async () => {
  if (active.value === 1) {
    await getTeamList()
  }
}
const onClickTag = async () => {
  const res = await myAxios.get('/api/user/searchUserTag', {
    params: {
      tag: activeName.value
    }
  });
  if (res.code === 200) {
    const userList = res.data
    userList.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    tagUserList.value = userList;
  }
}
const getTeamList = async (searchTxt) => {
  const res = await myAxios.get("/partner/team/list", {
    params: {
      searchTxt: searchTxt,
    }
  });
  if (res.code === 200) {
    teamList.value = res.data;
    teamList.value.forEach(team => {
      team.expireTime = team.expireTime.split(" ")[0];
      if (team.userVo && team.userVo.length > 0)
        team.userVo.forEach(user => {
          if (user.tags) {
            user.tags = JSON.parse(user.tags)
          }
        })
    })
  }
}

const onSearch = () => {
  if (searchTxt.value === '') {
    Toast.fail("请输入内容")
    return;
  }
  getTeamList(searchTxt.value);
}
const onClickButton = () => {
  if (searchTxt.value === '') {
    Toast.fail("请输入内容")
    return;
  }
  getTeamList(searchTxt.value);
}
const onClear = () => {
  Toast.success("关闭")
}
</script>

<style scoped>
/* Standard syntax */
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.apply-shake {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
}
</style>
