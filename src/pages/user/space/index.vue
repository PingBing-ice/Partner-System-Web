<template>
  <div id="space">
    <div class="banner">
      <div class="background">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>


      </div>

    </div>
    <div class="image_head" v-if="user!=null">
      <van-image style="position: relative;margin-top: -1.6vmin"
                 round
                 width="22.4vmin"
                 height="22.4vmin"
                 :src="user.avatarUrl"
      />
      <div class="head1">
        <div class="head2">
        <span class="van-hairline--right">
          <span class="num">
            {{ totalThumb }}
          </span>
          <br>
          <span class="type">获赞数</span>
        </span>
          <span class="van-hairline--right">
          <span class="num">
                        {{ totalPost }}

          </span>
          <br>
          <span class="type">文章数</span>
        </span>
          <span class="fans" @click="toCollect">
          <span class="num">
            {{ totalCollect }}
          </span>
          <br>
          <span class="type">收藏数</span>
        </span>
        </div>
        <van-button plain hairline @click="toUser" type="primary" size="small"
                    style="margin-top: 3.2vmin;font-size: 3.73333vmin" block>
          编辑资料
        </van-button>
      </div>
    </div>

    <div style="padding: 3.2vmin;clear: both;height: auto">
      <div>
          <span class="userName">
            {{ user.userAccount }}
          </span>
      </div>
      <div style="padding: 1px">
        <van-tag @click="toTag" v-if="tagList.length>0" plain v-for="tag in tagList" type="primary"
                 style="margin-right: 3px">{{ tag }}
        </van-tag>
      </div>
      <div style="height: 20px">
        <p class="wenzi">{{ !user.profile || user.profile === '' ? '这个人很神秘，什么都没有写' : user.profile }}</p>
      </div>
    </div>
    <div class="space-box">
      <div class="spaceBox">
        <div class="box1" @click="toScore">
          <img class="box1-image" src="../../../assets/jf.png" alt="">
          <div class="box-txt">积分管理</div>
        </div>
        <div class="box1" @click="toRecord">
          <img class="box1-image" src="../../../assets/jl.png" alt="">
          <div class="box-txt">浏览记录</div>
        </div>
      </div>
    </div>

    <div class="spaceTab">
      <van-tabs v-model:active="active" shrink animated>
        <van-tab title="最新" name="最新"/>
        <van-tab title="最热" name="最热"/>
        <van-tab v-if="checkList.length>0" v-for="check in checkList" :title="check.name" :name="check.teamId"/>

      </van-tabs>
    </div>

    <div class="cont">
      <PostCardList @showDeletePost="deletePost" :group-id="tid" :is-own="true" :scope="scope"/>
    </div>

    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <van-loading class="block" color="#0094ff" text-color="#0094ff" vertical>加载中...</van-loading>
      </div>
    </van-overlay>
  </div>

</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, watchEffect} from "vue";
import myAxios from "../../../config/myAxios";
import {showSuccessToast, showFailToast, showConfirmDialog, showToast} from 'vant';
import store from "../../../store";
import postRequest from "../../../plugins/request/postRequest";
import PostCardList from "@/components/post/PostCardList.vue";
import teamRequest from "@/plugins/request/teamRequest";
import {PostSortedEnum} from "@/plugins/request/dao/postEnum";

const show = ref(false);
const description = ref("加载中......")
const active = ref('')
const router = useRouter();
const route = useRoute();
const tagList = ref([]);
const checkList = ref([]);
const user = ref(store.getters.getUser);
const totalCollect = ref(0);
const totalPost = ref(0);
const totalThumb = ref(0);
const sorted = ref(1);
const tid = ref(0);
const scope = ref('lat');
onMounted(async () => {
  user.value = store.getters.getUser
  const tag = user.value.tags;
  if (tag && tag !== '' && tag !== '[]') {
    try {
      tagList.value = JSON.parse(tag);
    } catch (e) {
      if (tag) {
        try {
          tagList.value = JSON.parse(JSON.stringify(tag));
        } catch (e) {
        }
      }
    }
  }
  await getCollect()
  await getCheck();
})
const getCheck = async () => {
  const response = await teamRequest.check();
  if (response.code === 200 && response.data) {
    checkList.value = response.data;
  }
}
const getCollect = async () => {
  const response = await postRequest.col();
  if (response.code === 200 && response.data) {
    const data = response.data
    totalCollect.value = data.totalCollect
    totalPost.value = data.totalPost
    totalThumb.value = data.totalThumb
  }
}



const toUser = () => {
  router.push({path: '/user'})
}
const toTag = () => {
  router.push({
    path: '/label'
  })
}
const toCollect = () => {
  router.push({
    path: '/collect'
  })
}
const toRecord = () => {
  router.push({
    path: '/record'
  })
}
watch(() => active.value, () => {
  if (active.value === '最新') {
    tid.value = 0;
    scope.value = PostSortedEnum.DESC;
  } else if (active.value === '最热') {
    tid.value = 0;
    scope.value = PostSortedEnum.THUMB;
  } else {
    tid.value = Number(active.value);
  }
})
watchEffect(() => {

})
const toScore = () => {
  router.push({
    path: '/score'
  })
}
</script>

<style scoped src="./styles.css">


</style>