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
      <div style="padding: 1px"  >
        <van-tag @click="toTag" v-if="tagList.length>0" plain v-for="tag in tagList" type="primary" style="margin-right: 3px">{{ tag }}</van-tag>
      </div>
      <div style="height: 20px">
        <p class="wenzi">{{ !user.profile||user.profile === '' ? '这个人很神秘，什么都没有写' : user.profile }}</p>
      </div>
    </div>
    <div class="space-box">
      <div class="spaceBox">
        <div class="box1">
          <img class="box1-image" src="../../assets/jf.png" alt="">
          <div class="box-txt">积分管理</div>
        </div>
        <div class="box1" @click="toRecord">
          <img class="box1-image" src="../../assets/jl.png" alt="">
          <div class="box-txt">浏览记录</div>
        </div>
      </div>
    </div>

    <div class="spaceTab">
      <van-tabs v-model:active="active" shrink animated>
        <van-tab title="最新"/>
        <van-tab title="最热"/>
      </van-tabs>
    </div>

    <div class="cont">
      <post-card-list :sorted="sorted" :is-own="true" v-on:showDeletePost="deletePost"></post-card-list>
    </div>
    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <van-loading class="block" color="#0094ff" text-color="#0094ff" vertical>加载中...</van-loading>
      </div>
    </van-overlay>
  </div>

</template>

<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, watchEffect} from "vue";
import myAxios from "../../config/myAxios";
import {showSuccessToast, showFailToast, showConfirmDialog} from 'vant';
import store from "../../store";
import postRequest from "../../plugins/request/postRequest";
import PostCardList from "../../components/PostCardList.vue";

const show = ref(false);
const description = ref("加载中......")
const active = ref(0)
const router = useRouter();
const route = useRoute();
const tagList = ref([]);
const user = ref(store.getters.getUser);
const totalCollect = ref(0);
const totalPost = ref(0);
const totalThumb = ref(0);
const sorted = ref(0);

onMounted(() => {
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
  getCollect()
})
const getCollect = () => {
  myAxios.get("/post/col").then(rsp => {
    if (rsp.code === 200 && rsp.data) {
      const data = rsp.data
      totalCollect.value = data.totalCollect
      totalPost.value = data.totalPost
      totalThumb.value = data.totalThumb
    }
  })
}
// 删除post
const deletePost = (id) => {
  showConfirmDialog({
    title: '确认删除吗？'
  })
      .then(async () => {
        const response = await postRequest.delPost(id);
        if (response.code === 200) {
          window.location.reload();

          showSuccessToast("删除成功");
        } else {
          if (response.description) {
            showFailToast(response.description);
          } else {
            showFailToast(response.message);
          }
        }
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
}


const toUser = () => {
  router.push({
    path: '/user'
  })
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
watchEffect(() => {
  if (active.value === 0) {
    sorted.value = 0;
  } else if (active.value === 1) {
    sorted.value = 3;
  }
})
</script>

<style scoped>


.head1 {
  height: 8%;
  align-items: center;
  width: 63%;
  float: right;

  padding-top: 2.13333vmin;
}

.head2 {
  display: flex;
  justify-content: center;
}

.cont {
  height: auto;
}

.fans {
  width: 19.2vmin;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.van-hairline--right {
  width: 19.2vmin;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.num {
  font-size: 3.73333vmin;
  color: #212121;
  line-height: 4.26667vmin;
}

.type {
  font-size: 2.93333vmin;
  color: #999;
}

.wenzi {
  margin-top: 2.13333vmin;
  font-size: 3.46667vmin;
  color: #999;
  line-height: 4.53333vmin;
  width: 83.46667vmin;
  height: 4.53333vmin;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left
}

.userName {
  font-size: 4.8vmin;
  color: #212121;
  max-width: 62.66667vmin;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner {
  width: 100%;
  height: 14vh;
  overflow: hidden;
  background: url(/public/svg.png) 50% 50%;
}

.image_head {
  padding: 0 3.2vmin;
}


.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
}

@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}

.background {
  position: relative;
  width: 100%;
  height: 100%;

  overflow: hidden;
}

.background span {
  width: 1vmin;
  height: 1vmin;
  border-radius: 1vmin;
  backface-visibility: hidden;
  position: absolute;
  animation: move;
  animation-duration: 46;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}


.background span:nth-child(0) {
  color: #b6b235;
  top: 84%;
  left: 48%;
  animation-duration: 24s;
  animation-delay: -15s;
  transform-origin: -1vw -18vh;
  box-shadow: -2vmin 0 0.800851570823155vmin currentColor;
}

.background span:nth-child(1) {
  color: #b6b235;
  top: 25%;
  left: 9%;
  animation-duration: 34s;
  animation-delay: -5s;
  transform-origin: -4vw -15vh;
  box-shadow: -2vmin 0 0.46958058203518793vmin currentColor;
}

.background span:nth-child(2) {
  color: #b6b235;
  top: 85%;
  left: 47%;
  animation-duration: 20s;
  animation-delay: -31s;
  transform-origin: 19vw -11vh;
  box-shadow: -2vmin 0 0.3730213075852733vmin currentColor;
}

.background span:nth-child(3) {
  color: #b6b235;
  top: 57%;
  left: 53%;
  animation-duration: 33s;
  animation-delay: -36s;
  transform-origin: 10vw -20vh;
  box-shadow: -2vmin 0 0.28096671524263095vmin currentColor;
}

.background span:nth-child(4) {
  color: #b6b235;
  top: 4%;
  left: 59%;
  animation-duration: 37s;
  animation-delay: -8s;
  transform-origin: 2vw 23vh;
  box-shadow: 2vmin 0 1.0579425934635205vmin currentColor;
}

.background span:nth-child(5) {
  color: #b6b235;
  top: 24%;
  left: 65%;
  animation-duration: 10s;
  animation-delay: -34s;
  transform-origin: 4vw 10vh;
  box-shadow: -2vmin 0 0.5439787468442165vmin currentColor;
}

.background span:nth-child(6) {
  color: #262aab;
  top: 92%;
  left: 13%;
  animation-duration: 37s;
  animation-delay: -29s;
  transform-origin: -6vw 14vh;
  box-shadow: 2vmin 0 0.4573568907747463vmin currentColor;
}

.background span:nth-child(7) {
  color: #b6b235;
  top: 2%;
  left: 74%;
  animation-duration: 42s;
  animation-delay: -8s;
  transform-origin: -10vw 23vh;
  box-shadow: 2vmin 0 0.2991242048166671vmin currentColor;
}

.background span:nth-child(8) {
  color: #b6b235;
  top: 32%;
  left: 48%;
  animation-duration: 14s;
  animation-delay: -10s;
  transform-origin: 8vw 13vh;
  box-shadow: 2vmin 0 0.6042007504912097vmin currentColor;
}

.background span:nth-child(9) {
  color: #b6b235;
  top: 40%;
  left: 52%;
  animation-duration: 10s;
  animation-delay: -5s;
  transform-origin: 15vw 8vh;
  box-shadow: 2vmin 0 0.8110282309148902vmin currentColor;
}

.background span:nth-child(10) {
  color: #262aab;
  top: 24%;
  left: 58%;
  animation-duration: 28s;
  animation-delay: -34s;
  transform-origin: 13vw 17vh;
  box-shadow: -2vmin 0 0.8859185828024017vmin currentColor;
}

.background span:nth-child(11) {
  color: #b6b235;
  top: 99%;
  left: 23%;
  animation-duration: 29s;
  animation-delay: -1s;
  transform-origin: 23vw -3vh;
  box-shadow: 2vmin 0 0.5224597300185392vmin currentColor;
}

.background span:nth-child(12) {
  color: #b6b235;
  top: 75%;
  left: 76%;
  animation-duration: 23s;
  animation-delay: -11s;
  transform-origin: -17vw -13vh;
  box-shadow: -2vmin 0 0.7189693898754965vmin currentColor;
}

.background span:nth-child(13) {
  color: #262aab;
  top: 6%;
  left: 34%;
  animation-duration: 42s;
  animation-delay: -29s;
  transform-origin: -6vw -2vh;
  box-shadow: 2vmin 0 1.2382102982438055vmin currentColor;
}

.background span:nth-child(14) {
  color: #b6b235;
  top: 38%;
  left: 89%;
  animation-duration: 37s;
  animation-delay: -15s;
  transform-origin: -18vw 21vh;
  box-shadow: -2vmin 0 0.7174694232734558vmin currentColor;
}

.background span:nth-child(15) {
  color: #1d1c22;
  top: 48%;
  left: 97%;
  animation-duration: 38s;
  animation-delay: -35s;
  transform-origin: -6vw 25vh;
  box-shadow: 2vmin 0 0.6224868292622394vmin currentColor;
}

.background span:nth-child(16) {
  color: #262aab;
  top: 9%;
  left: 51%;
  animation-duration: 33s;
  animation-delay: -19s;
  transform-origin: -9vw -22vh;
  box-shadow: -2vmin 0 0.8647579982978193vmin currentColor;
}

.background span:nth-child(17) {
  color: #b6b235;
  top: 46%;
  left: 73%;
  animation-duration: 45s;
  animation-delay: -24s;
  transform-origin: -20vw -11vh;
  box-shadow: -2vmin 0 0.6467067254826073vmin currentColor;
}

.background span:nth-child(18) {
  color: #1d1c22;
  top: 48%;
  left: 52%;
  animation-duration: 23s;
  animation-delay: -22s;
  transform-origin: -15vw -20vh;
  box-shadow: -2vmin 0 1.178908566033595vmin currentColor;
}

.background span:nth-child(19) {
  color: #1d1c22;
  top: 51%;
  left: 70%;
  animation-duration: 33s;
  animation-delay: -24s;
  transform-origin: -19vw 20vh;
  box-shadow: -2vmin 0 1.086199901919919vmin currentColor;
}

.background span:nth-child(20) {
  color: #b6b235;
  top: 68%;
  left: 19%;
  animation-duration: 17s;
  animation-delay: -36s;
  transform-origin: -23vw 9vh;
  box-shadow: 2vmin 0 1.0847563100388355vmin currentColor;
}

.background span:nth-child(21) {
  color: #1d1c22;
  top: 67%;
  left: 71%;
  animation-duration: 30s;
  animation-delay: -39s;
  transform-origin: 19vw 19vh;
  box-shadow: -2vmin 0 0.26859834477691913vmin currentColor;
}

.background span:nth-child(22) {
  color: #262aab;
  top: 13%;
  left: 18%;
  animation-duration: 42s;
  animation-delay: -17s;
  transform-origin: -18vw -1vh;
  box-shadow: 2vmin 0 0.543451197694202vmin currentColor;
}

.background span:nth-child(23) {
  color: #1d1c22;
  top: 60%;
  left: 42%;
  animation-duration: 37s;
  animation-delay: -31s;
  transform-origin: 12vw 5vh;
  box-shadow: 2vmin 0 0.8501828540365135vmin currentColor;
}

.background span:nth-child(24) {
  color: #b6b235;
  top: 62%;
  left: 72%;
  animation-duration: 25s;
  animation-delay: -33s;
  transform-origin: -15vw 22vh;
  box-shadow: 2vmin 0 0.46681475166327724vmin currentColor;
}

.background span:nth-child(25) {
  color: #1d1c22;
  top: 34%;
  left: 39%;
  animation-duration: 21s;
  animation-delay: -26s;
  transform-origin: 7vw -18vh;
  box-shadow: -2vmin 0 0.91939463191024vmin currentColor;
}

.background span:nth-child(26) {
  color: #262aab;
  top: 28%;
  left: 33%;
  animation-duration: 17s;
  animation-delay: -29s;
  transform-origin: 9vw 24vh;
  box-shadow: 2vmin 0 0.4621204806894439vmin currentColor;
}

.background span:nth-child(27) {
  color: #1d1c22;
  top: 31%;
  left: 21%;
  animation-duration: 34s;
  animation-delay: -31s;
  transform-origin: 21vw 11vh;
  box-shadow: -2vmin 0 0.8119948939319954vmin currentColor;
}

.background span:nth-child(28) {
  color: #262aab;
  top: 11%;
  left: 59%;
  animation-duration: 21s;
  animation-delay: -18s;
  transform-origin: 12vw 12vh;
  box-shadow: 2vmin 0 0.45117785871740623vmin currentColor;
}

.background span:nth-child(29) {
  color: #1d1c22;
  top: 100%;
  left: 60%;
  animation-duration: 37s;
  animation-delay: -5s;
  transform-origin: 5vw 11vh;
  box-shadow: -2vmin 0 1.1768649571875636vmin currentColor;
}

.background span:nth-child(30) {
  color: #b6b235;
  top: 25%;
  left: 81%;
  animation-duration: 28s;
  animation-delay: -39s;
  transform-origin: 11vw -21vh;
  box-shadow: -2vmin 0 0.8129351372411007vmin currentColor;
}

.background span:nth-child(31) {
  color: #1d1c22;
  top: 57%;
  left: 33%;
  animation-duration: 15s;
  animation-delay: -19s;
  transform-origin: 5vw 21vh;
  box-shadow: -2vmin 0 1.1386656299973013vmin currentColor;
}

.background span:nth-child(32) {
  color: #1d1c22;
  top: 47%;
  left: 43%;
  animation-duration: 11s;
  animation-delay: -2s;
  transform-origin: -16vw 3vh;
  box-shadow: -2vmin 0 0.7601214814485324vmin currentColor;
}

.background span:nth-child(33) {
  color: #b6b235;
  top: 6%;
  left: 14%;
  animation-duration: 44s;
  animation-delay: -19s;
  transform-origin: -18vw -19vh;
  box-shadow: -2vmin 0 0.6938327096315169vmin currentColor;
}

.background span:nth-child(34) {
  color: #b6b235;
  top: 22%;
  left: 34%;
  animation-duration: 13s;
  animation-delay: -28s;
  transform-origin: 22vw 2vh;
  box-shadow: -2vmin 0 1.154268802507705vmin currentColor;
}

.background span:nth-child(35) {
  color: #b6b235;
  top: 59%;
  left: 14%;
  animation-duration: 12s;
  animation-delay: -20s;
  transform-origin: -2vw 1vh;
  box-shadow: 2vmin 0 1.166721119808012vmin currentColor;
}

.background span:nth-child(36) {
  color: #b6b235;
  top: 6%;
  left: 38%;
  animation-duration: 6s;
  animation-delay: -11s;
  transform-origin: -5vw 22vh;
  box-shadow: 2vmin 0 1.0063795207852728vmin currentColor;
}

.background span:nth-child(37) {
  color: #262aab;
  top: 24%;
  left: 62%;
  animation-duration: 34s;
  animation-delay: -1s;
  transform-origin: -23vw -3vh;
  box-shadow: 2vmin 0 1.0861260539320619vmin currentColor;
}

.background span:nth-child(38) {
  color: #262aab;
  top: 48%;
  left: 17%;
  animation-duration: 45s;
  animation-delay: -38s;
  transform-origin: 13vw -5vh;
  box-shadow: 2vmin 0 0.7785712656051238vmin currentColor;
}

.background span:nth-child(39) {
  color: #1d1c22;
  top: 73%;
  left: 70%;
  animation-duration: 32s;
  animation-delay: -27s;
  transform-origin: -12vw -11vh;
  box-shadow: 2vmin 0 0.4553404226575346vmin currentColor;
}

.background span:nth-child(40) {
  color: #b6b235;
  top: 28%;
  left: 64%;
  animation-duration: 32s;
  animation-delay: -3s;
  transform-origin: 2vw 14vh;
  box-shadow: -2vmin 0 0.5015508008950393vmin currentColor;
}

.background span:nth-child(41) {
  color: #262aab;
  top: 14%;
  left: 50%;
  animation-duration: 21s;
  animation-delay: -9s;
  transform-origin: -15vw -17vh;
  box-shadow: 2vmin 0 0.6388602785030533vmin currentColor;
}

.background span:nth-child(42) {
  color: #262aab;
  top: 38%;
  left: 67%;
  animation-duration: 14s;
  animation-delay: -36s;
  transform-origin: -1vw -3vh;
  box-shadow: 2vmin 0 0.4099667300020169vmin currentColor;
}

.background span:nth-child(43) {
  color: #262aab;
  top: 72%;
  left: 33%;
  animation-duration: 10s;
  animation-delay: -12s;
  transform-origin: -8vw -6vh;
  box-shadow: 2vmin 0 0.6933076952471395vmin currentColor;
}

.background span:nth-child(44) {
  color: #1d1c22;
  top: 69%;
  left: 24%;
  animation-duration: 7s;
  animation-delay: -31s;
  transform-origin: -24vw 10vh;
  box-shadow: -2vmin 0 0.5125754994234237vmin currentColor;
}

.background span:nth-child(45) {
  color: #1d1c22;
  top: 81%;
  left: 15%;
  animation-duration: 42s;
  animation-delay: -28s;
  transform-origin: -10vw 15vh;
  box-shadow: 2vmin 0 0.5798780731589239vmin currentColor;
}

.background span:nth-child(46) {
  color: #1d1c22;
  top: 70%;
  left: 30%;
  animation-duration: 21s;
  animation-delay: -39s;
  transform-origin: 10vw -14vh;
  box-shadow: 2vmin 0 0.5872810869045775vmin currentColor;
}

.background span:nth-child(47) {
  color: #262aab;
  top: 87%;
  left: 6%;
  animation-duration: 33s;
  animation-delay: -40s;
  transform-origin: -1vw -22vh;
  box-shadow: 2vmin 0 0.5213321671704825vmin currentColor;
}

.background span:nth-child(48) {
  color: #b6b235;
  top: 1%;
  left: 22%;
  animation-duration: 22s;
  animation-delay: -17s;
  transform-origin: -8vw 24vh;
  box-shadow: -2vmin 0 0.51671837541754vmin currentColor;
}

.background span:nth-child(49) {
  color: #1d1c22;
  top: 33%;
  left: 49%;
  animation-duration: 40s;
  animation-delay: -10s;
  transform-origin: -23vw -3vh;
  box-shadow: 2vmin 0 0.6969744070504578vmin currentColor;
}
.space-box{
  padding: 6px 0 6px 0;
  background-color: rgb(240, 242, 245);
}
.spaceBox{
  justify-content: space-around;
  align-items: center;
  display: flex;
  width: 100%;
  height: 62px;
  background-color: #ffffff;
  border-radius: 6px
}
.box1{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box1-image{
  width: 26px;
  height: 26px;
}
.box-txt{
  margin-top: 3px;
  font-size: 10px;
}
</style>