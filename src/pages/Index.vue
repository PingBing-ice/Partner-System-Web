<template>
    <div class="addPostTop" style="top: 81%;right: 8%">
      <van-button v-if="isTop&&active!=='队伍'" class="backTop" icon="arrow-up" @click="backTop" type="primary"
                  size="small"
                  round></van-button>
      <van-button v-if="isPostTop&&active==='首页'" class="backTop" icon="arrow-up" @click="backTop" type="primary"
                  size="small"
                  round></van-button>
    </div>
<!--    <div class="addPostTop">-->
<!--      <van-button icon="plus" round @click="toAddPost" type="primary"/>-->
<!--    </div>-->

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
      <user-card-list :userList="userListVo" @userId="showAddUserOn"/>
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
        :style="{ height: '30%' }"
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
      <van-tabs v-model:active="active" @change="onTabChange" animated>
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
                <div class="checkbox-wrapper-5">
                  <div class="check">
                    <input type="checkbox" id="check-5" v-model="isMatchMode">
                    <label for="check-5"></label>
                  </div>
                </div>
              </template>
            </van-cell>
            <van-tabs v-if="userList||userList.length>0 && tagUserList|| tagUserList.length>0"
                      v-model:active="activeName"
                      @click-tab="onClickTag">
              <van-tab title="全部" name="a">

                <div class="indexUserListCard card">
                  <user-card-list :user-list="userList" @userId="showAddUserOn"/>
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
          <div class="sy" @scroll="postScroll">
            <van-swipe :autoplay="3000" lazy-render class="post-banner">
              <van-swipe-item>
                <div class="banner1 ac">
                </div>
              </van-swipe-item>
              <van-swipe-item>
                <div class="banner2 ac">
                </div>
              </van-swipe-item>
            </van-swipe>
            <van-notice-bar @click="notices" left-icon="volume-o" :scrollable="false" color="rgb(56 121 186)"
                            ref="noticeBarRef" background="#f0f9fe">
              <van-swipe
                  vertical
                  class="notice-swipe"
                  :autoplay="3000"
                  :touchable="false"
                  :show-indicators="false"
              >
                <div v-if="notice.length>0">
                  <van-swipe-item :key="key" v-for="(n,key) in notice">{{ n }}</van-swipe-item>

                </div>
                <div v-else>
                  <van-swipe-item :key="key" v-for="(n,key) in 2">{{ '暂无公告' }}</van-swipe-item>

                </div>
              </van-swipe>
            </van-notice-bar>
            <div class="ca">
              <div class="ls">
                <div class="lll one" @click="toPoints">
                  <div class="llTitle">每日签到</div>
                  <div class="llTitleMS">点击签到增加星币</div>

                </div>
                <div class="lll two" @click="hd">
                  <div class="llTitle">每日活动</div>
                  <div class="llTitleMS">参加活动获取奖励</div>
                </div>

                <div class="lll three" @click="zl">
                  <div class="llTitle">优质专栏</div>
                  <div class="llTitleMS">优质专栏</div>
                </div>
                <div class="lll three">
                  <div class="llTitle">点击设置标签</div>
                  <div class="llTitleMS">设置标签</div>
                </div>
              </div>
            </div>
            <Tabs :tag-list="tgs" @tag="onTag"/>
            <PostCardList @showPostUser="showUser" :group-id="0" :scope="tag" :is-own="false"/>
          </div>

        </van-tab>
        <van-tab title="队伍" name="队伍">
          <div :class="{'apply-shake':searchTeamName.value}">

            <SearchCard @mess="setTxt" @click="onClickButton" :placeholder="'请输入队伍关键词'"/>
          </div>
          <team-card-list v-if="teamList && teamList.length>0" :teamList="teamList" @addTeam="addTeam"
                          @teamShow="isShow"/>
          <van-empty v-if="!teamList || teamList.length<1" description="空空如也"/>
        </van-tab>
        <template #nav-right>
          <div style="display: flex;justify-content: space-evenly;align-items: center;width: 84px">
            <van-icon name="search" size="18" @click="toSearch" style="color:#4a94af;"/>
            <van-popover v-model:show="showPopover" theme="dark" :actions="actions" @select="onSelect"
                         placement="bottom-end" style="height: 18vh">
              <template #reference>
                <van-icon name="add-o" style="color:#4a94af;"/>
              </template>
            </van-popover>

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
      </div>
    </van-overlay>


</template>

<script setup lang="ts">
import {onActivated, onMounted, ref, watch} from "vue";
import {showSuccessToast, showFailToast, showToast} from 'vant';
import UserCardList from "@/components/UserCardList.vue";
import TeamCardList from "@/components/TeamCardList.vue";


import {useRoute, useRouter} from "vue-router";
import userRequest from "@/plugins/request/userRequest";
import postRequest from "@/plugins/request/postRequest";
import tagRequest from "@/plugins/request/tagRequest";
import SearchCard from "@/components/SearchCard.vue";
import teamRequest from "@/plugins/request/teamRequest";
import store from "@/store";
import {User} from "@/plugins/request/dao/user";
import Tabs from "@/components/tab/Tabs.vue";
import PostCardList from "@/components/post/PostCardList.vue";
import {PostSortedEnum} from "@/plugins/request/dao/postEnum";
import {teamQuery} from "@/plugins/request/dao/TeamQuery";

const tgs: string[] = ["推荐", "最新", "最热", "寻金之路"]
const tag = ref<string>('rec')
const show = ref(false)
const addPasswordTeam = ref(false)
const max = ref(0)
const userListVo = ref([])
const teamID = ref<number>(0)
const teamStatus = ref(0);
const teamPassword = ref('');
const showTeam = ref(false);
const userList = ref<any>([]);
const finished = ref(false);
const description = ref("加载中......")
const teamList = ref<any>([]);
const tagList = ref([]);
const tagUserList = ref([]);
const activeName = ref('a')
const notice = ref<string[]>([])
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
const userId = ref<number>(0);
let page = 0;
const total = ref(100);
const top = ref(0);
const isTop = ref(false);
const isPostTop = ref<boolean>(false);

const IndexActive = ref(0);
const user = ref<User>(store.getters.getUser)
let isUserLod = true;
let imagePage = 0;
const imageLock = ref(true);
let isImageLod = ref(true);
const noticeBarRef = ref(null);
const query: teamQuery = {
  page: {
    size: 0,
    current: 0
  },
  id: 0,
  userId: 0,
  maxNum: 0,
  status: 0,
  searchTxt: "",
  name: "",
  description: ""
}

onMounted(async () => {

  const type = route.query.type;
  const code = route.query.code;
  if (type && code) {
    await userRequest.getQQInfo(type.toString(), code.toString());
  }
  await notices();
  // await getLabel();
  if (active.value === '队伍') {
    await getTeamList(undefined);
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
  if (!indexTags) {
    return;
  }
  if (indexTags.scrollTop >= 200 && isTop.value === false) {
    isTop.value = true;
  }
  if (indexTags.scrollTop < 200 && isTop.value === true) {
    isTop.value = false
  }
  // 滚动加载图片
  if (IndexActive.value === 1 && isImageLod.value) {
    const to = indexTags.scrollHeight - indexTags.scrollTop;
    if (to <= 900) {
      if (imageLock.value) {
        imageLock.value = false;
        await loadImage(++imagePage, 10);
      }
    }
  }
}
const postScroll = (event: Event) => {
  const target = event.target as EventTarget & { scrollTop: number };
  if (target.scrollTop >= 200 && isPostTop.value === false) {
    isPostTop.value = true;
  }
  if (target.scrollTop < 200 && isPostTop.value === true) {
    isPostTop.value = false
  }
}
const isTops = async () => {
  const card = document.querySelector(".card");
  if (card) {
    console.log(card.scrollTop)
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

  const sy = document.querySelector(".sy");
  if (sy) {
    sy.scrollTop = store.getters.getTop;
  }
})
watch(IndexActive, async () => {
  if (IndexActive.value === 1 && imageList.value.size <= 0) {
    await loadImage(++imagePage, 10)
  }
})

// 加载image】
const loadImage = async (num: number, size: number) => {
  if (num === 1) {
    await imageLists(num, size)
  } else {
    setTimeout(async () => {
      await imageLists(num, size)
    }, 8000)
  }
}
const imageLists = async (num: number, size: number) => {
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

    if (imageList.value.size >= data.total) {
      isImageLod.value = false;
    }
  }
  imageLock.value = true;
}
const imageList = ref(new Set())

const notices = async () => {
  const response = await tagRequest.getNotice();
  if (response.code === 200) {
    notice.value = response.data;
  }
}

const getLabel = async () => {
  const response = await tagRequest.getUserTag();
  if (response.code === 200) {
    tagList.value = response.data;
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
      await getTeamList(undefined)
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
const sendFriendRequest = async () => {
  if (userId.value === 0) {
    return;
  }
  const resp = await userRequest.addFriend(userId.value, message.value);
  if (resp.code === 200) {
    showToast({message: '发送成功!', position: 'top'});
  } else {
    if (resp.description) {
      showFailToast(resp.description);
    }
  }

}
const close = () => {
  message.value = '';
  userId.value = 0;
}
const onClickTag = async () => {
  const res = await userRequest.searchTag(activeName.value);

  if (res.code === 200 && res.data) {
    const userList = res.data
    for (let user of userList) {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    }
    tagUserList.value = userList;
  }
}
const getTeamList = async (searchTxt: string | undefined) => {
  if (teamList.value.length > 0 && searchTxt === '') {
    return;
  }
  query.searchTxt = searchTxt;
  const res = await teamRequest.searchTeam(query)
  if (res.code !== 200 || !res.data) {
    return;
  }
  teamList.value = res.data;
  if (teamList.value.length <= 0) {
    return;
  }
  for (let team of teamList.value) {
    team.expireTime = team.expireTime.split("T")[0];
    if (team.userVo && team.userVo.length > 0)
      for (let user of team.userVo) {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      }
  }


}

// 打开
const showUser = (user: any) => {
  showPostUserVo.value = true;
  postUserVo.value = user;
}
const showAddUserOn = (id: number) => {
  if (!store.getters.getIsLogin) {
    showToast({message: '请先登录', position: 'top'});
    return;
  }
  showAddUser.value = true;
  userId.value = id;
}
const onSearch = () => {
  if (searchTxt.value === '') {
    showToast({message: '请输入内容', position: 'top'});

    return;
  }
  getTeamList(searchTxt.value);
}
const onClickButton = async () => {
  if (searchTxt.value === '') {
    showToast({message: '请输入内容', position: 'top'});
    return;
  }
  await getTeamList(searchTxt.value);
}
const onClear = () => {
  showToast({message: '关闭', position: 'top'});
}


const onTabChange = (value: string) => {
  router.push({
    query: {
      tab: value
    }
  })
}


const JoinTeam = async () => {
  if (teamPassword.value === '' || !teamPassword.value || teamID.value === 0) {
    showToast({message: '请输入密码', position: 'top'});
    return;
  }
  const res = await teamRequest.join(teamID.value, null)
  if (res?.code === 200) {
    showToast({message: '加入成功', position: 'top'});
  }
  teamID.value = 0;
  teamPassword.value = '';
}

/**
 * 加入队伍
 */
const addTeam = async (id: number, status: number) => {
  if (status === 2) {
    teamPassword.value = '';
    addPasswordTeam.value = true;
    teamID.value = id
  } else {
    const res = await teamRequest.join(id, null)
    if (res?.code === 200) {
      showToast({message: '加入成功', position: 'top'});
    }
  }

}

const isShow = (id: number, status: number) => {
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
watch(isMatchMode, () => {
  onMatch(isMatchMode.value)
})
const onMatch = async (value: boolean) => {
  if (value) {
    isMatchModeLoading.value = true;
    const response = await userRequest.match(3);
    if (response.code === 200 && response.data) {
      isMatchModeLoading.value = false;
      userList.value = response.data;
      if (userList.value.length <= 0) {
        return;
      }
      for (let user of userList.value) {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      }
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
    const indexTags = document.querySelector('.sy');
    if (indexTags) {
      topDH(indexTags);
    }
  } else {
    const card = document.querySelector(".card");
    if (card) {
      topDH(card);
    }
  }
}
const topDH = (html: Element) => {
  let x = 30;
  let top = html.scrollTop//获取点击时页面的滚动条纵坐标位置
  const timeTop = setInterval(() => {
    html.scrollTop = (top -= (x += 1.5))//一次减30往上滑动
    if (top <= 0) {
      clearInterval(timeTop)
    }
  }, 5)

}
const showPopover = ref(false);
const setTxt = (value: string) => {
  searchTxt.value = value;
}
// 通过 actions 属性来定义菜单选项
const actions = [
  {text: '添加好友'},
  {text: '添加队伍'},
  {text: '添加文章'},
];
const onSelect = (action: { text: string; }) => {
  if (action.text === '添加好友') {
    router.push({
      path: '/search/friend'
    })
  } else if (action.text === '添加文章') {
    toAddPost();
  } else if (action.text === '添加队伍') {
    doJoinTeam()
  }
}
const doJoinTeam = () => {
  router.push({
    path: "/team/add",
  })
}
const toAddPost = () => {
  router.push({
    path: '/post/add',
  })
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
const hd = () => {
  showToast({message: '暂未开放', position: 'top'});
}
const zl = () => {
  showToast({message: '暂未开放', position: 'top'});
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
      break;
    case "寻金之路":
      tag.value = "xj";
  }
}
</script>

<style scoped src="./styles.css">


</style>
