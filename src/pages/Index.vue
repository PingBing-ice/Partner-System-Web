<template>
  <div class="addPostTop">
    <div>
      <van-button v-if="isTop&&active!=='队伍'" class="backTop" icon="arrow-up" @click="backTop" type="primary"
                  size="small"
                  round></van-button>
    </div>
    <van-button icon="plus" class="addBut" @click="toAddPost" type="primary" round/>
  </div>



  <van-dialog z-index="100" v-model:show="addPasswordTeam" title="密码" show-cancel-button @confirm="JoinTeam">
    <van-field
        z-index="102"
        v-model="teamPassword"
        name="password"
        label="队伍密码"
        placeholder="请输入密码"
    />
  </van-dialog>
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

  <van-action-sheet
      v-model:show="showTeam"
      round
      position="bottom"
  >
    <van-divider>{{ '队伍最大人数: ' + max }}</van-divider>
    <van-divider>队员</van-divider>
    <user-card-list :userList="userListVo" v-on:userId="showAddUserOn"/>
  </van-action-sheet>

  <van-dialog v-model:show="addPasswordTeam" title="密码" show-cancel-button @confirm="JoinTeam">
    <van-cell-group inset>
      <van-field
          v-model="teamPassword"
          name="password"
          label="队伍密码"
          placeholder="请输入密码"
      />
    </van-cell-group>
  </van-dialog>
  <van-popup
      v-model:show="showPostUserVo"
      round
      style="overflow: visible; "
      position="bottom"
      :style="{ height: '40%' }"
  >
    <div class="postUserVoHead">
      <van-image
          class="postUserImage"
          round
          width="4rem"
          height="4rem"
          :src="postUserVo.avatarUrl"
      />
      <div style="position: absolute;top: 52px">
        {{ postUserVo.username }}
      </div>
    </div>
    <div class="head2">
        <span class="van-hairline--right">
          <span class="num">
            {{ postUserVo.joinTime }}
          </span>
          <br>
          <span class="type">加入天数</span>
        </span>

      <span class="van-hairline--right">
          <span class="num">
            {{ postUserVo.postTotal }}
          </span>
          <br>
          <span class="type">发表主题</span>
        </span>
      <span class="fans">
          <span class="num">
            {{ postUserVo.thumbTotal }}
          </span>
          <br>
          <span class="type">获赞数</span>
        </span>
    </div>
    <div class="adduserF">
      <button class="addUser" @click="showAddUserOn(postUserVo.id)">添加好友</button>
    </div>
  </van-popup>

  <div class="indexTabs">
    <van-tabs v-model:active="active" @change="onTabChange" animated swipeable>
      <template #nav-bottom>
      </template>
      <template #nav-left>
        <div style="display: flex;align-items: center;padding: 0 50px 0 16px">
          <img @click="toUser" :src="user?.avatarUrl" alt="" class="avatar" v-if="store.getters.getIsLogin">
        </div>
      </template>

      <van-tab title="用户" name="用户">
        <div id="userList">
          <van-cell style="background-image: linear-gradient(to left,#fbf7f8, #f5f9fc);" center
                    :title="isMatchMode? '推荐模式':'普通模式'">
            <template #right-icon>
              <van-switch v-model="isMatchMode" size="24" @update:model-value="onMatch"/>
            </template>
          </van-cell>
          <van-tabs v-if="userList||userList.length>0 && tagUserList|| tagUserList.length>0" v-model:active="activeName"
                    @click-tab="onClickTag">
            <van-tab title="全部" name="a">

              <div class="indexUserListCard card">
                <user-card-list :user-list="userList" v-on:userId="showAddUserOn"/>
              </div>

            </van-tab>
            <van-tab class="userTabs" v-for="tag in tagList" :title="tag" :name="tag">
              <div class="indexUserListCard card">
                <user-card-list v-if=" tagUserList || tagUserList.length>0" :user-list="tagUserList"/>
              </div>
            </van-tab>
          </van-tabs>
        </div>

      </van-tab>
      <van-tab title="首页" name="首页">
        <van-tabs v-model:active="IndexActive" shrink type="card">
          <div id="indexTags">
            <van-tab title="推荐" :title-class="'indexTitle'">
              <van-swipe :autoplay="3000" lazy-render style="margin: 10px 5px 7px 5px;border-radius: 10px;">
                <van-swipe-item>
                  <div class="banner1 ac">
                  </div>
                </van-swipe-item>
                <van-swipe-item>
                  <div class="banner2 ac">
                  </div>
                </van-swipe-item>
              </van-swipe>

              <van-notice-bar v-if="notice"
                              left-icon="volume-o"
                              scrollable
                              :text="notice"
                              color="rgb(56 121 186)" background="#f0f9fe"
              >
              </van-notice-bar>
              <div class="ls">
                <div class="lll one" @click="toPoints">
                  <div class="llTitle">每日签到</div>
                  <em>
                    <img style="width: 58px;height: 58px" src="https://www.xcng.cn/wp-content/uploads/2023/02/登录成功.png">
                  </em>
                </div>
                <div class="lll two">
                  <div class="llTitle">每日活动</div>
                  <em>
                    <img style="width: 58px;height: 58px" src="https://www.xcng.cn/wp-content/uploads/2023/02/眨眼.png">
                  </em>
                </div>
                <div class="lll three">
                  <div class="llTitle">优质专栏</div>
                  <em>
                    <img style="width: 58px;height: 58px" src="https://www.xcng.cn/wp-content/uploads/2023/02/红包.png">
                  </em>
                </div>
              </div>
              <post-card-list v-on:showPostUser="showUser" :is-own="false" :sorted="0"/>
            </van-tab>
            <van-tab :title="'图片'" :title-class="'indexTitle'">
              <ImgRreviewCard :images="imageList"/>
            </van-tab>
          </div>

        </van-tabs>

      </van-tab>
      <van-tab title="队伍" name="队伍">
        <div :class="{'apply-shake':searchTeamName.value}">
          <van-search
              v-model="searchTxt"
              show-action
              placeholder="请输入队伍关键词"
              @search="onSearch"
              @clear="onClear()"
          >
            <template #action>
              <div @click="onClickButton">搜索</div>
            </template>
          </van-search>
        </div>
        <team-card-list v-if="teamList && teamList.length>0" :teamList="teamList" v-on:addTeam="addTeam"
                        v-on:teamShow="isShow"/>
        <van-empty v-if="!teamList || teamList.length<1" description="空空如也"/>
      </van-tab>
      <template #nav-right>
        <div style="display: flex;align-items: center; padding: 0 16px 0 50px">
          
          <van-icon name="search" size="18" @click="toSearch" style="color:#4a94af;"/>
        </div>
      </template>
    </van-tabs>
  </div>
  <van-overlay :show="isMatchModeLoading">
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

</template>

<script setup>
import {onActivated, onMounted, ref, watch} from "vue";
import myAxios from "../config/myAxios";
import {showSuccessToast, showFailToast, showToast} from 'vant';
import UserCardList from "../components/UserCardList.vue";
import TeamCardList from "../components/TeamCardList.vue";


import {useRoute, useRouter} from "vue-router";
import PostCardList from "../components/PostCardList.vue";
import userRequest from "../plugins/request/userRequest";
import store from "../store";
import ImgRreviewCard from "../components/ImgRreviewCard.vue";
import postRequest from "../plugins/request/postRequest";

const show = ref(false)
const addPasswordTeam = ref(false)
const max = ref(0)
const userListVo = ref([])
const teamID = ref("")
const teamStatus = ref(0);
const teamPassword = ref('');
const showTeam = ref(false);
const userList = ref([]);
const finished = ref(false);
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
const router = useRouter();
const route = useRoute();
const active = ref(route.query.tab ?? '首页')
const loading = ref(false);
const showPostUserVo = ref(false);
const showAddUser = ref(false);
const postUserVo = ref();
const message = ref('');
const userId = ref('');
let page = 0;
const total = ref(100);
const top = ref(0);
const isTop = ref(false);
const IndexActive = ref(0);
const user = ref(store.getters.getUser)
let isUserLod = true;
let imagePage = 0;
let imageLock = true;
let isImageLod = true;
onMounted(async () => {
  await notices();
  await getLabel();
  if (active.value === '队伍') {
    await getTeamList();
  }
  await onUserLoad()
  const card = document.querySelector(".card");
  const indexTags = document.getElementById("indexTags");
  if (card) {
    // 添加滚动监听
    card.addEventListener("scroll", isTops);
  }
  if (indexTags) {
    indexTags.addEventListener("scroll", isIndex)
  }
})
const isIndex = async () => {
  const indexTags = document.getElementById("indexTags");
  if (indexTags.scrollTop >= 200 && isTop.value === false) {
    isTop.value = true
  }
  if (indexTags.scrollTop < 200 && isTop.value === true) {
    isTop.value = false
  }
  // 滚动加载图片
  if (IndexActive.value === 1 && isImageLod) {
    const to = indexTags.scrollHeight - indexTags.scrollTop;
    if (to <= 900) {
      if (imageLock) {
        imageLock = false;
        await loadImage(++imagePage, 10);
        imageLock = true;
      }
    }
  }

}
const isTops = async () => {
  const card = document.querySelector(".card");
  if (card) {
    // 防止isTop 刷新频繁
    if (card.scrollTop >= 200 && isTop.value === false) {
      isTop.value = true
    }
    if (card.scrollTop < 200 && isTop.value === true) {
      isTop.value = false
    }
    if (active.value === '用户') {
      if (!finished.value) {
        const to = card.scrollHeight - card.scrollTop;
        if (to <= 900) {
          if (isUserLod) {
            isUserLod = false;
            await onUserLoad();
            isUserLod = true;
          }
          // 滚动加载
        }
      }
    }
  }
}
onActivated(() => {
  const indexTags = document.getElementById("indexTags");
  if (indexTags) {
    indexTags.scrollTop = store.getters.getTop;
  }
})
watch(IndexActive, async () => {
  if (IndexActive.value === 1 && imageList.value.size <= 0) {
    await loadImage(++imagePage, 10)
  }
})
// 加载image】
const loadImage = async (num, size) => {
  const resp = await postRequest.getImageList(num, size);
  if (resp.code === 200 && resp.data) {
    const data = resp.data;
    if (data.records) {
      for (let record of data.records) {
        if (record.imageUrl) {
          imageList.value.add(record.imageUrl);
        }
      }
    }
    console.log(imageList.value)

    if (imageList.value.size >= data.total) {
      isImageLod = false;
    }
  }
}
const imageList = ref(new Set())

const notices = async () => {
  const response = await myAxios.get('/api/userNotice/getNotice', {
    params: {
      region: 1,
    }
  });
  if (response.code === 200) {
    notice.value = response.data;
  }
}
const getLabel = async () => {
  const res = await myAxios.get('/api/userLabel/getLabel');
  if (res.code === 200) {
    tagList.value = res.data;
  }
}

const loadData = async () => {
  const resp = await userRequest.getUserList(page, 10);
  if (resp.code === 200 && resp.data.items) {
    const list = resp.data.items;
    total.value = resp.data.total;
    if (list.length <= 0) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const user = list[i]
      if (user.tags) {
        try {
          user.tags = JSON.parse(user.tags);
        } catch (e) {

        }
      }
      userList.value.push(user);
    }
    if (userList.value.length >= total.value) {
      finished.value = true;
    }
  }
  isMatchModeLoading.value = false;
}

watch(active, async (value) => {
  if (active.value === '贴吧') {
  } else if (active.value === '队伍') {
    if (teamList.value <= 0) {
      getTeamList()
    }
  } else if (active.value === '用户') {
    await onUserLoad();
  }
})


const onUserLoad = async () => {
  if (active.value !== '用户') {
    return;
  }
  if (!isMatchMode.value) {
    if (userList.value.length >= total.value) {
      finished.value = true;
    } else {
      page++;
      const resp = await userRequest.getUserList(page, 10);
      if (resp.code === 200 && resp.data.items) {
        const list = resp.data.items;
        total.value = resp.data.total;
        if (list.length <= 0) {
          return;
        }
        for (let i = 0; i < list.length; i++) {
          const user = list[i]
          if (user.tags) {
            try {
              user.tags = JSON.parse(user.tags);
            } catch (e) {

            }
          }
          userList.value.push(user);
        }
        if (userList.value.length >= total.value) {
          finished.value = true;
        }
      }

    }
  }
  isMatchModeLoading.value = false;

}
// 发送添加好友
const sendFriendRequest = () => {
  if (userId.value === '') {
    return;
  }
  myAxios.post("/partner/friend/userFriend/friend", {
    toUserId: userId.value,
    message: message.value,
  }).then(resp => {
    // @ts-ignore
    if (resp.code === 200) {
      showToast({message: '发送成功!', position: 'top'});

    } else {
      if (resp.description) {
        showFailToast(resp.description);
      }
    }
  }).catch(resp => {
    showToast({message: '发送失败!', position: 'top'});

  });
}
const close = () => {
  message.value = '';
  userId.value = '';
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
const getTeamList = (searchTxt) => {
  if (teamList.value.length > 0 && searchTxt === '') {
    return;
  }
  myAxios.get("/partner/team/search", {
    params: {
      searchTxt: searchTxt,
    }
  }).then(res => {
    if (res.code === 200) {
      teamList.value = res.data;
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
  });

}

// 打开
const showUser = (user) => {
  showPostUserVo.value = true;
  postUserVo.value = user;
}
const showAddUserOn = (id) => {
  showAddUser.value = true;
  userId.value = id;
}
const onSearch = () => {
  if (searchTxt.value === '') {
    showFailToast("请输入内容")
    return;
  }
  getTeamList(searchTxt.value);
}
const onClickButton = async () => {
  if (searchTxt.value === '') {
    showFailToast("请输入内容")
    return;
  }
  await getTeamList(searchTxt.value);
}
const onClear = () => {
  showSuccessToast("关闭")
}


const onTabChange = (value) => {
  router.push({
    query: {
      tab: value
    }
  })
}
const toAddPost = () => {
  router.push({
    path: '/addPost'
  })
}


const JoinTeam = async () => {
  if (teamPassword.value === '' || !teamPassword.value || teamID.value === '') {
    showFailToast("请输入密码")
    return;
  }
  const res = await myAxios.post("/partner/team/join", {
    teamId: teamID.value,
    password: teamPassword.value,
  });
  if (res?.code === 200) {
    showSuccessToast("加入成功");
  } else {
    showFailToast(res.description);
  }
  teamID.value = '';
  teamPassword.value = '';
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

// 按钮切换
const onMatch = async (value) => {
  if (value) {
    isMatchModeLoading.value = true;
    const response = await myAxios.get("/api/user/match", {
      params: {
        num: 3
      }
    })

    if (response.code === 200 && response.data) {
      isMatchModeLoading.value = false;
      userList.value = response.data;
      if (userList.value.length <= 0) {
        return;
      }
      userList.value.forEach(user => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      });
    } else {
      isMatchModeLoading.value = false;
      isMatchMode.value = false;
    }
  } else {
    page = 1;
    userList.value = [];
    await loadData()
  }
}
const backTop = () => {
  if (active.value === '首页') {
    const indexTags = document.getElementById('indexTags');
    topDH(indexTags)
  } else {
    const card = document.querySelector(".card");
    if (card) {
      topDH(card);
    }
  }
}
const topDH = (html) => {
  let x = 30;
  let top = html.scrollTop//获取点击时页面的滚动条纵坐标位置
  const timeTop = setInterval(() => {
    html.scrollTop = (top -= (x += 1.5))//一次减30往上滑动
    if (top <= 0) {
      clearInterval(timeTop)
    }
  }, 5)

}
const toPoints = () => {
  router.push({path: '/points'})
}
const toUser = () => {
  router.push({path: '/user'})
}
const toSearch = () => {
  router.push({path: '/search'})
}
</script>

<style scoped>

/* Standard syntax */
@keyframes shake {
  10%, 90% {
    transform: translate3d(-3px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(4px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-6px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(6px, 0, 0);
  }
}

.apply-shake {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.addPostTop {
  display: flex;
  position: fixed;
  z-index: 200;
  right: 6%;
  top: 77%;
  flex-direction: column;
  height: 80px;
  align-items: center;
  justify-content: space-between;
}

.backTop {

}

.addBut {

}


.fixed-button a {
  color: white;
  font-size: 40px;
  text-decoration: none;
}


.postUserImage {

  position: absolute;
  top: -27px;
}

.head2 {
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
}


.fans {
  width: 30%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.van-hairline--right {
  width: 30%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.num {
  font-size: 98%;
  color: #212121;
  line-height: 4.26667vmin;
}

.type {
  font-size: 80%;
  color: #999;
}


.postUserVoHead {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30%;
  margin-bottom: 24px
}


/*加载动画*/
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

.ac {
  border-radius: 1px;
  height: 37vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;

}

.banner1 {
  background-image: url('src/assets/ac.jpeg');
}

.banner2 {
  background-image: url(https://bing-edu.oss-cn-hangzhou.aliyuncs.com/banner1.jpg);
}

.ls {
  position: relative;
  overflow: hidden;
  margin: 6px 0 3px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(99, 99, 99, 0.1) 0 2px 8px 0;
}

.lll {

  margin-right: 6px;
  flex: 1;
  position: relative;
  padding: 0 2vw;
  background: #fff;
  height: 17vw;
  border-radius: 10px;
  box-shadow: 0 0.5vw 1vw rgb(96 125 139 / 0.2);
}

.llTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 8vw;
  position: relative;
  z-index: 1;
  color: #fff;
  padding: 10px;
  font-size: 10px;
  text-shadow: 0 0 5px rgb(0 0 0 / 0.5);
}

.one {
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
}

.two {
  background-color: #FBAB7E;
  background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);
}

.three {
  background-color: #FF9A8B;
  background-image: linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%);
  margin-right: 0;
}

em {
  position: absolute;
  right: 1vw;
  bottom: -3vw;
  width: 15vw;
  height: 13vw;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .7;
}
</style>
