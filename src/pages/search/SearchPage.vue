<template>

  <van-overlay :show="isFor">
    <div class="wrapper" @click.stop>
      <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
        <div class="wheel"></div>
        <div class="hamster">
          <div class="hamster__body">
            <div class="hamster__head">
              <div class="hamster__ear"></div>
              <div class="hamster__eye"></div>
              <div class="hamster__nose"></div>
            </div>
            <div class="hamster__limb hamster__limb--fr"></div>
            <div class="hamster__limb hamster__limb--fl"></div>
            <div class="hamster__limb hamster__limb--br"></div>
            <div class="hamster__limb hamster__limb--bl"></div>
            <div class="hamster__tail"></div>
          </div>
        </div>
        <div class="spoke"></div>
      </div>

      <!--      <van-loading color="#0094ff" text-color="#0094ff" vertical>加载中...</van-loading>-->
    </div>
  </van-overlay>
  <van-action-sheet
      v-model:show="showTeam"
      round
      position="bottom"
  >
    <van-divider>{{ '队伍最大人数: ' + max }}</van-divider>
    <van-divider>队员</van-divider>
    <user-card-list :userList="userListVo" v-on:userId="showAddUserOn"/>
  </van-action-sheet>
  <van-dialog v-model:show="showAddUser" title="确认添加好友吗?" @confirm="sendFriendRequest" @closed="close"
              show-cancel-button>
    <van-cell-group inset>
      <van-field
          v-model="message"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="请输入备注"
      />
    </van-cell-group>
  </van-dialog>
  <van-search
      v-model="searchTxt"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
  >
    <template #action>
      <div @click="onSearch">搜索</div>
    </template>
  </van-search>
  <div v-if="postList && postList.length>0">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      文章
    </van-divider>
    <span v-for="post in postList">
      <div class="fo">
              <div class="txt"
                   v-html="post.content" @click="toDetails(post.id)"/>
      </div>
      <div class="van-hairline--bottom"></div>
    </span>
  </div>
  <div v-if="userList && userList.length>0">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      用户
    </van-divider>
    <user-card-list :user-list="userList" v-on:userId="showAddUserOn"/>
  </div>

  <div v-if="teamList && teamList.length>0">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      队伍
    </van-divider>
    <team-card-list :teamList="teamList" v-on:addTeam="addTeam"
                    v-on:teamShow="isShow"/>
  </div>
  <div v-if="userList.length<=0&&postList.length<=0&&teamList.length<=0">
    <van-empty description="查无数据" />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import postRequest from "../../plugins/request/postRequest";
import teamRequest from "../../plugins/request/teamRequest";
import userRequest from "../../plugins/request/userRequest";
import UserCardList from "../../components/UserCardList.vue";
import myAxios from "../../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import TeamCardList from "../../components/TeamCardList.vue";
import {useRouter} from "vue-router";
const router =useRouter()
const postList = ref([])
const userList = ref([])
const teamList = ref([])
const userListVo = ref([])
const userId = ref('')
const teamID = ref('')
const message = ref('')
const showAddUser = ref(false);
const showTeam = ref(false);
const addPasswordTeam = ref(false);
const teamPassword = ref('');
const teamStatus = ref(0);
const max = ref(0);
const isFor = ref(false);
let txt='';
const searchTxt = ref('');
const onSearch = async () => {

  if (searchTxt.value === '' || txt===searchTxt.value) {
    return;
  }
  isFor.value = true;
  await getUser();
  await getPost()
  await getTeam();
  isFor.value = false;
  txt = searchTxt.value;
}
const getPost = async () => {
  const resp = await postRequest.search(null, searchTxt.value)
  if (resp.code === 200 && resp.data) {
    postList.value = resp.data;
  }
}
const getTeam = async () => {
  const resp = await teamRequest.searchTeam(searchTxt.value)
  if (resp.code === 200 && resp.data) {
    teamList.value = resp.data;
    if (teamList.value.length >= 0) {
      teamList.value.forEach(team => {
        team.expireTime = team.expireTime.split(" ")[0];
        if (team.userVo && team.userVo.length > 0)
          team.userVo.forEach(user => {
            if (user.tags) {
              user.tags = JSON.parse(user.tags)
            }
          })
      });
    }
  }
}
const getUser = async () => {
  const resp = await userRequest.search(1, 10, searchTxt.value);
  if (resp.code === 200 && resp.data) {
    userList.value = resp.data.records;
  }

}
const toDetails = (id) => {
  router.push({
    path: "/space/details",
    query: {
      id: id,
    }
  })
}
const showAddUserOn = (id) => {
  showAddUser.value = true;
  userId.value = id;
}
const sendFriendRequest = () => {
  if (userId.value === '') {
    return;
  }
  myAxios.post("/partner/friend/userFriend/friend", {
    toUserId: userId.value,
    message: message.value,
  }).then(resp => {

    if (resp.code === 200) {
      showSuccessToast("发送成功")
    } else {
      if (resp.description) {
        showFailToast(resp.description);
      }
    }
  }).catch(resp => {
    showFailToast("发送失败");
  });
}
const close = () => {
  message.value = '';
  userId.value = '';
}

/**
 * 加入队伍
 */
const addTeam = async (id, status) => {

  if (status === 2) {
    teamPassword.value = '';
    addPasswordTeam.value = true;
    teamID.value = id
  } else {
    const res = await myAxios.post("/partner/team/join", {
      teamId: id,
    });
    if (res?.code === 200) {
      showSuccessToast("加入成功");
    } else {
      showFailToast(res.description);
    }
  }

}

const isShow = (id, status) => {
  teamStatus.value = status;
  showTeam.value = true;
  for (let i = 0; i < teamList.value.length; i++) {
    const team = teamList.value[i];
    if (team.id === id) {
      userListVo.value = [];
      max.value = team.maxNum;
      userListVo.value = team.userVo
    }
  }
}
</script>

<style scoped>
.fo {
  position: relative;
  color: #2e2e2f;
  cursor: move;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  margin-bottom: 10px;
  border: 3px dashed transparent;
}

.txt {

  display: -webkit-box; /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 2; /*设置多少行*/
  -webkit-box-orient: vertical; /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
  overflow: hidden; /*文本会被修剪，并且剩余的部分不可见*/
  text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
  font-size: 14px;
  line-height: 24px;
  color: #5a5c66;
  word-wrap: break-word;
  white-space: pre-wrap;

}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

.wheel-and-hamster {
  --dur: 1s;
  position: relative;
  width: 12em;
  height: 12em;
  font-size: 6px;
}

.wheel,
.hamster,
.hamster div,
.spoke {
  position: absolute;
}

.wheel,
.spoke {
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wheel {
  background: radial-gradient(100% 100% at center, hsla(0, 0%, 60%, 0) 47.8%, hsl(0, 0%, 60%) 48%);
  z-index: 2;
}

.hamster {
  animation: hamster var(--dur) ease-in-out infinite;
  top: 50%;
  left: calc(50% - 3.5em);
  width: 7em;
  height: 3.75em;
  transform: rotate(4deg) translate(-0.8em, 1.85em);
  transform-origin: 50% 0;
  z-index: 1;
}

.hamster__head {
  animation: hamsterHead var(--dur) ease-in-out infinite;
  background: hsl(30, 90%, 55%);
  border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
  box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset,
  0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
  top: 0;
  left: -2em;
  width: 2.75em;
  height: 2.5em;
  transform-origin: 100% 50%;
}

.hamster__ear {
  animation: hamsterEar var(--dur) ease-in-out infinite;
  background: hsl(0, 90%, 85%);
  border-radius: 50%;
  box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
  top: -0.25em;
  right: -0.25em;
  width: 0.75em;
  height: 0.75em;
  transform-origin: 50% 75%;
}

.hamster__eye {
  animation: hamsterEye var(--dur) linear infinite;
  background-color: hsl(0, 0%, 0%);
  border-radius: 50%;
  top: 0.375em;
  left: 1.25em;
  width: 0.5em;
  height: 0.5em;
}

.hamster__nose {
  background: hsl(0, 90%, 75%);
  border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
  top: 0.75em;
  left: 0;
  width: 0.2em;
  height: 0.25em;
}

.hamster__body {
  animation: hamsterBody var(--dur) ease-in-out infinite;
  background: hsl(30, 90%, 90%);
  border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
  box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset,
  0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
  top: 0.25em;
  left: 2em;
  width: 4.5em;
  height: 3em;
  transform-origin: 17% 50%;
  transform-style: preserve-3d;
}

.hamster__limb--fr,
.hamster__limb--fl {
  clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
  top: 2em;
  left: 0.5em;
  width: 1em;
  height: 1.5em;
  transform-origin: 50% 0;
}

.hamster__limb--fr {
  animation: hamsterFRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
  transform: rotate(15deg) translateZ(-1px);
}

.hamster__limb--fl {
  animation: hamsterFLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
  transform: rotate(15deg);
}

.hamster__limb--br,
.hamster__limb--bl {
  border-radius: 0.75em 0.75em 0 0;
  clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
  top: 1em;
  left: 2.8em;
  width: 1.5em;
  height: 2.5em;
  transform-origin: 50% 30%;
}

.hamster__limb--br {
  animation: hamsterBRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
  transform: rotate(-25deg) translateZ(-1px);
}

.hamster__limb--bl {
  animation: hamsterBLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
  transform: rotate(-25deg);
}

.hamster__tail {
  animation: hamsterTail var(--dur) linear infinite;
  background: hsl(0, 90%, 85%);
  border-radius: 0.25em 50% 50% 0.25em;
  box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
  top: 1.5em;
  right: -0.5em;
  width: 1em;
  height: 0.5em;
  transform: rotate(30deg) translateZ(-1px);
  transform-origin: 0.25em 0.25em;
}

.spoke {
  animation: spoke var(--dur) linear infinite;
  background: radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
  linear-gradient(hsla(0, 0%, 55%, 0) 46.9%, hsl(0, 0%, 65%) 47% 52.9%, hsla(0, 0%, 65%, 0) 53%) 50% 50% / 99% 99% no-repeat;
}

/* Animations */
@keyframes hamster {
  from, to {
    transform: rotate(4deg) translate(-0.8em, 1.85em);
  }

  50% {
    transform: rotate(0) translate(-0.8em, 1.85em);
  }
}

@keyframes hamsterHead {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(8deg);
  }
}

@keyframes hamsterEye {
  from, 90%, to {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0);
  }
}

@keyframes hamsterEar {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(12deg);
  }
}

@keyframes hamsterBody {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-2deg);
  }
}

@keyframes hamsterFRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(50deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-30deg) translateZ(-1px);
  }
}

@keyframes hamsterFLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-30deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(50deg);
  }
}

@keyframes hamsterBRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-60deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(20deg) translateZ(-1px);
  }
}

@keyframes hamsterBLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(20deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-60deg);
  }
}

@keyframes hamsterTail {
  from, 25%, 50%, 75%, to {
    transform: rotate(30deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(10deg) translateZ(-1px);
  }
}

@keyframes spoke {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-1turn);
  }
}
</style>
