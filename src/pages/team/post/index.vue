<template>
  <div class="addPostTop" style="top: 81%;right: 8%">
    <van-button v-if="isTop" class="backTop" icon="arrow-up" @click="backTop" type="primary"
                size="small"
                round></van-button>

  </div>
  <div class="addPostTop" v-if="checked!==2">
    <van-button icon="plus" round @click="toAddPost" type="primary"/>
  </div>
  <div id="teamPost" v-if="team" :style="checked===2?'display: none':'`background-image: url(${team.avatarUrl})`'" />
  <div class="team_post_Tab" :style="checked===2?'black':'color:#fff'">
    <input type="radio" name="team_post_radio" id="radio-1" :value="1" v-model="checked">
    <label class="team_post_radio_label" for="radio-1">文章</label>
    <input type="radio" name="team_post_radio" id="radio-2" :value="2" v-model="checked">
    <label class="team_post_radio_label" for="radio-2">聊天室</label>
    <div class="team_post_Tab_line">
    </div>
  </div>
  <div class="heard_team_icon" :style="checked===2?'black':'color:#fff'">
    <div class="heard_team_left">
      <van-icon name="arrow-left" @click="toPath"/>
      <div v-if="team&&teamIsName" class="heard_team_left_name">
        {{ team.name }}
      </div>
    </div>
    <div class="heard_team_right">
      <div class="heard_team_icon_is" style="">
        <van-icon name="search" size="18" @click="toSearch" style="color:inherit"/>
        <van-icon name="friends-o" size="18" @click="onClickRightTeam(team.id,team.name)" style="color:inherit;"/>
      </div>
    </div>
  </div>
  <div id="content_team" :style="checked===2?'display: none':''" v-if="team">
    <div class="image_back">
      <div class="imag_heard">
        <img
            :src="team.avatarUrl"
            class="av" width="60" height="60" alt="">
        <div class="imag_title">
          <div class="team_title_name_is">
            <div v-if="team">{{ team.name }}</div>
          </div>
          <div style="font-size: 12px;padding-top: 3px;color: #FFFFFF">人数: 561456</div>
        </div>

      </div>
    </div>
    <Tabs :tag-list="tgs" @tag="onTag"></Tabs>
    <div class="team_post_core">
      <div class="post_team">
        <div style="height: 100%">
          <PostCardList @showPostUser="showUser" :group-id="teamId" :scope="tag" :is-own="false"/>
        </div>
      </div>
    </div>
  </div>
  <ToChatTeam :style="checked===1?'display: none':''"/>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {nextTick, onActivated, onMounted, ref, watch, watchEffect} from "vue";
import {showToast} from "vant";
import PostCardList from "@/components/post/PostCardList.vue";
import store from "@/store";
import teamRequest from "@/plugins/request/teamRequest";
import ToChatTeam from "@/pages/chat/toChatTeam.vue";
import Tabs from "@/components/tab/Tabs.vue";
import {PostSortedEnum} from "@/plugins/request/dao/postEnum";

const teamId = ref<number>();
const tgs: string[] = ["最新", "最热"]
const tag = ref<string>(PostSortedEnum.DESC)

const route = useRoute()
const router = useRouter()
const team = ref();
const teamIsName = ref(false);
const isTop = ref(false);
const checked = ref(1);
const active = ref(0);
onMounted(async () => {
  const teamID = route.query.id
  if (teamID === null || teamID === '') {
    showToast({message: '参数错误', position: 'top'});
    router.back();
  }
  teamId.value = Number(teamID);
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
    router.back();
  }
  const resp = await teamRequest.getTeamByAv(teamId.value);
  if (resp && resp.code === 200 && resp.data) {
    team.value = resp.data;
  } else {
    router.back();
  }
  const name = document.querySelector('.team_title_name_is');
  if (name) {
    const observer = new IntersectionObserver(nameCallback, options);
    observer.observe(name);
  }
  const content_team = document.getElementById("content_team");
  if (content_team) {
    content_team.addEventListener("scroll", isTeamPostTop)
  }

})

onActivated(() => {
  const content_team = document.getElementById("content_team");
  if (content_team) {
    content_team.scrollTop = store.getters.getTeamTop;
  }
})
watch(checked,()=>{
  if (checked.value == 2) {
    const chatInfo = document.getElementById("chatInfo");
    if (chatInfo) {
      nextTick(()=>{
        chatInfo.scrollTop = chatInfo.scrollHeight;
      })
    }
  }

})
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
}
const showUser = () => {

}
const nameCallback = (e: any) => {
  for (let item of e) {
    if (item.isIntersecting) {
      // 进入
      teamIsName.value = false;
    } else {
      teamIsName.value = true;
      // 离开
    }
  }
}
const isTeamPostTop = () => {
  const content_team = document.getElementById("content_team");
  if (content_team) {
    if (content_team.scrollTop >= 200 && isTop.value === false) {
      isTop.value = true;
    }
    if (content_team.scrollTop < 200 && isTop.value === true) {
      isTop.value = false
    }
  }

}
const backTop = () => {
  const content_team = document.getElementById("content_team");
  if (content_team) {
    let x = 30;
    let top = content_team.scrollTop//获取点击时页面的滚动条纵坐标位置
    const timeTop = setInterval(() => {
      content_team.scrollTop = (top -= (x += 1.5))//一次减30往上滑动
      if (top <= 0) {
        clearInterval(timeTop)
      }
    }, 5)
  }

}
const onClickRightTeam = (id: number, name: string) => {
  router.push({
    path: '/user/team',
    query: {
      teamID: id,
      teamName: name,
    }
  })
}
const toPath = () => {
  store.commit('setTeamTop', 0);
  router.back();
}
const toSearch = () => {
  router.push({path: '/search'})
}

const toAddPost = () => {
  router.push({
    path: '/post/add',
    query: {
      group: teamId.value,
    }
  })
}
const onTag = (value: string) => {
  switch (value) {
    case "推荐":
      tag.value = PostSortedEnum.RECOMMEND;
      break;
    case "最新":
      tag.value = PostSortedEnum.DESC;
      break;
    case "最热":
      tag.value = PostSortedEnum.HOT;
  }
}
</script>

<style scoped src="./styles.css">

</style>