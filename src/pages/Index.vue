<template>
  <van-notice-bar v-if="notice"
                  left-icon="volume-o"
                  scrollable
                  :text="notice"
                  color="#1989fa" background="#ecf9ff"
  />
  <van-tabs v-model:active="active" @click-tab="onClickTab" @change="onTabChange">
    <van-tab title="贴吧" name="贴吧">
      <van-pull-refresh v-model="postLoading" @refresh="onRefresh">
        <div id="postList">
          <van-list v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad" v-if="postList.length>0" style="background-color: #f0f2f5;padding-top: 5px">
            <div v-for="post in postList" style="width: auto;height: auto;padding-bottom: 10px">
              <div style="padding: 16px; background-color: #ffffff">
                <div style="display:flex;max-width: 100%;height: auto">
                  <div style="margin-right: 10px">
                    <van-image
                        round
                        width="1.7rem"
                        height="1.7rem"
                        :src="post.userAvatarVo.avatarUrl"
                    />
                  </div>
                  <div style="flex: 1.0;width: 0 ;color:rgb(0 0 0 / 85%)">
                    <p style="margin-bottom: 12px;color: #567895;font-size: 15px;line-height: 24px;margin-top: 3px">
                      {{ post.userAvatarVo.username }}</p>
                  </div>
                  <p>
                  </p>
                </div>
                <div style="margin-top: -13px">
                  <h6></h6>
                </div>
                <div id="contentTxt" style="width: auto;height: auto;font-size:15px">
                  <van-text-ellipsis
                      rows="5"
                      :content="post.content"
                      expand-text="展开"
                      collapse-text="收起"
                  />
                </div>
                <div class="tagTxt">
                  <van-tag plain v-if="post.tag&&post.tag.length>0" v-for="tag in post.tag" type="primary"
                           style="margin-right: 3px">{{ tag }}
                  </van-tag>

                </div>
                <van-row gutter="20" style="margin-top: 10px">
                  <van-col span="4">
                    <div style="display: flex">
                      <van-icon style="display: flex" class="icon" name="good-job-o"
                                :color="hasThumb(post.id)?'#00aeec':''"

                                @click="isThumb(post.id);">
                        <div class="footer">
                          {{ thumbMap.get(post.id) === 0 ? '' : thumbMap.get(post.id) }}
                        </div>
                      </van-icon>

                    </div>

                  </van-col>
                  <van-col span="4">
                    <van-icon class="icon" name="comment-o" @click="doIsComment(post.id)"/>
                  </van-col>
                  <van-col span="4">
                    <div style="display: flex">
                      <van-icon class="icon" style="display: flex" name="star-o"
                                :color="hasCollect(post.id)?'#00aeec':''"
                                @click="isCollect(post.id)">
                        <div class="footer">
                          {{ collectMap.get(post.id) === 0 ? '' : collectMap.get(post.id) }}
                        </div>
                      </van-icon>

                    </div>

                  </van-col>
                </van-row>
                <div style="margin-top:12px" v-if="isComment.get(post.id)">
                  <div class="comment-f">
                    <div class="comment-containers">
                      <div class="comment-container">
                        <div class="text-area-wrapper">
                          <input class="ql-container" v-model="commentTxt"/>
                        </div>
                      </div>
                      <div class="submit-btn" @click="sendPost(post.id)">回复</div>
                    </div>
                  </div>
                </div>
                <div v-if="commentMap.get(post.id)" style="background-color:  #f0f2f5;margin-top: 10px">
                  <div style="padding: 1px 1px 1px 9px">
                    <div v-for="content in commentMap.get(post.id)">
                      <p style="font-size: 14px;">{{ content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
          <van-empty v-if="postList.length<=0" description="无数据"/>
        </div>
      </van-pull-refresh>

      <van-button icon="plus" class="addBut" @click="toAddPost" type="primary" round/>
    </van-tab>
    <van-tab title="用户" name="用户">

      <div id="userList">
        <van-cell center :title="isMatchMode? '推荐模式':'普通模式'">
          <template #right-icon>
            <van-switch v-model="isMatchMode" size="24" :loading="isMatchModeLoading"/>
          </template>
        </van-cell>
        <van-tabs v-if="userList||userList.length>0 && tagUserList|| tagUserList.length>0" v-model:active="activeName"
                  @click-tab="onClickTag">
          <van-tab title="全部" name="a">

            <user-card-list :user-list="userList"/>
          </van-tab>

          <van-tab v-for="tag in tagList" :title="tag" :name="tag">
            <user-card-list v-if=" tagUserList || tagUserList.length>0" :user-list="tagUserList"/>
          </van-tab>
        </van-tabs>
      </div>

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

      <team-card-list v-if="teamList && teamList.length>0" :teamList="teamList"/>
      <van-empty v-if="!teamList || teamList.length<1" description="空空如也"/>
    </van-tab>
  </van-tabs>
  <van-overlay :show="isMatchModeLoading">
    <div class="wrapper" @click.stop>
      <van-loading color="#0094ff" text-color="#0094ff" vertical>加载中...</van-loading>
    </div>
  </van-overlay>
</template>

<script setup>
import {onMounted, ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios";
import { showSuccessToast, showFailToast,showToast } from 'vant';
import UserCardList from "../components/UserCardList.vue";
import TeamCardList from "../components/TeamCardList.vue";

import store from "../store";
import {useRoute, useRouter} from "vue-router";


const userList = ref([]);

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
const active = ref(route.query.tab)
const postList = ref([]);
const commentTxt = ref("");
const thumbHasPostId = ref(new Set());
const collectHasPostId = ref(new Set());
const thumbMap = ref(new Map());
const collectMap = ref(new Map());
const isComment = ref(new Map());
const commentMap = ref(new Map());
const postLoading = ref(false);

const loading = ref(false);
const finished = ref(false);
let pageNum = 1;
let total = 40;
onMounted(async () => {
  getPostList(pageNum);
  await getTeamList();
  await getNotice();
  await getLabel();

})

const getNotice = async () => {
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
  if (isMatchMode.value) {
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
    }
  } else {
    const userListData = await myAxios.get('/api/user/recommend', {
      params: {
        current: 1,
        size: 500
      }
    });
    if (userListData.code === 200 && userListData.data) {
      userList.value = userListData.data.items;
      isMatchModeLoading.value = false;
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
    }
  }

  if (userList.value.length === 0 || !userList.value) {
    description.value = "空空如也";
  }

}
watchEffect(() => {
  loadData();
})

// 切换 tab
const onClickTab = async () => {
  if (active.value === "队伍") {
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
  if (teamList.value.length > 0) {
    return;
  }
  const res = await myAxios.get("/partner/team/list", {
    params: {
      searchTxt: searchTxt,
    }
  });
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
}
const onLoad = () => {
  ++pageNum;
  getPostList(pageNum)
  loading.value = false;
  if (postList.value.length >= total) {
    finished.value = true;
  }
}
const getPostList = (pageNum) => {
  myAxios.post("/post/getPost", {
    content: "",
    pageNum: pageNum,
    pageSize: 10,
    sorted: 0,
    tagId: "",
    userId: ""
  }).then(resp => {
    if (resp.code === 200 && resp.data) {
      total = resp.data.total
      const list = resp.data.records;
      for (let i = 0; i < list.length; i++) {
        const postVo = list[i];
        try {
          postVo.tag = JSON.parse(postVo.tag);
        } catch (e) {
          postVo.tag = [];
        }
        postList.value.push(postVo)
      }

      for (let i = 0; i < list.length; i++) {
        const post = list[i];
        if (post.hasThumb === true) {
          thumbHasPostId.value.add(post.id)
        }
        if (post.hasCollect === true) {
          collectHasPostId.value.add(post.id)
        }
        thumbMap.value.set(post.id, post.thumb);
        collectMap.value.set(post.id, post.collect);
        commentMap.value.set(post.id, post.commentList)
        isComment.value.set(post.id, false);
      }
    }
  })
}
const isThumb = async (id) => {
  const resp = await myAxios.post("/post/doThumb", {
    postId: id
  });
  if (resp.code === 200) {
    if (hasThumb(id)) {
      thumbHasPostId.value.delete(id);
      if (thumbMap.value.has(id)) {
        let num = thumbMap.value.get(id);
        if (num >= 1) {
          thumbMap.value.set(id, --num)
          return;
        }
        thumbMap.value.delete(id)
      }
    } else {
      thumbHasPostId.value.add(id);
      if (thumbMap.value.has(id)) {
        let num = thumbMap.value.get(id);
        thumbMap.value.set(id, ++num)
      } else {
        thumbMap.value.set(id, 1);
      }
    }
  } else {
    showFailToast("点赞失败");
  }
}
const isCollect = (postId) => {
  myAxios.post("/post/doCollect", {
    postId: postId,
  }).then(resp => {
    if (resp.code === 200) {
      if (hasCollect(postId)) {
        collectHasPostId.value.delete(postId);
        if (collectMap.value.has(postId)) {
          let num = collectMap.value.get(postId);
          if (num >= 1) {
            collectMap.value.set(postId, --num)
            return;
          }
          collectMap.value.delete(postId)
        }
      } else {
        collectHasPostId.value.add(postId);
        if (collectMap.value.has(postId)) {
          let num = collectMap.value.get(postId);
          collectMap.value.set(postId, ++num)
        } else {
          collectMap.value.set(postId, 1);
        }
      }
    } else {
      showFailToast("收藏失败");
    }
  })
}
// 刷新
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    postLoading.value = false;
    getPostList();
  }, 1000);
};
const sendPost = async (postId) => {
  if (postId == null || commentTxt.value === "") {
    return;
  }
  if (!store.getters.getIsLogin) {
    showFailToast("请先登录")

  }
  const user = store.getters.getUser
  if (!user) {
    return;
  }

  const resp = await myAxios.post("/post/doComment", {
    "content": commentTxt.value,
    "postId": postId,
    "replyId": "",
    "userId": user.id,
  })
  if (resp.code === 200) {
    const commList = commentMap.value.get(postId);
    let comment = user.userAccount + ": " + commentTxt.value
    commList.push(comment)
  }
  commentTxt.value = '';

}
const onSearch = () => {
  if (searchTxt.value === '') {
    showFailToast("请输入内容")
    return;
  }
  getTeamList(searchTxt.value);
}
const onClickButton = () => {
  if (searchTxt.value === '') {
    showFailToast("请输入内容")
    return;
  }
  getTeamList(searchTxt.value);
}
const onClear = () => {
  showSuccessToast("关闭")
}
const hasThumb = (id) => {
  return thumbHasPostId.value.has(id);
}
const hasCollect = (id) => {
  return collectHasPostId.value.has(id);
}
const doIsComment = (postId) => {
  if (isComment.value.get(postId)) {
    isComment.value.set(postId, false);
  } else {
    isComment.value.set(postId, true);
  }
};
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
</script>

<style scoped>


.icon {
  margin-right: 15px;
}

.comment {
  height: 30px;
}


#contentTxt {
  width: 100px;
  display: -webkit-box; /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 8; /*设置多少行*/
  -webkit-box-orient: vertical; /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
  overflow: hidden; /*文本会被修剪，并且剩余的部分不可见*/
  text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
}


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

.comment-containers {
  margin-top: 12px;
  padding-left: 0px;
  padding-right: 25px;
  display: flex;
}

.text-area-wrapper {
  width: 100%;
  box-sizing: border-box
}

.comment-container {
  display: flex;
  position: relative;
  border: 1px solid #16b998;
  padding-top: 1px;
  background-color: #fff;
  width: 100%;
  height: 20px;
}

.ql-container {
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 14px !important;
}

.submit-btn {
  margin-left: 8px;
  line-height: 23px;
  width: 60px;
  background: #16B998;
  box-shadow: 0 1px 2px #0000000d;
  border-radius: 2px;
  text-align: center;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
}

.comment-f {

}

.ql-container {
  height: 90%;
  width: 90%;
}

.addBut {
  position: fixed;
  z-index: 2;
  right: 7%;
  top: 80%;
}

.footer {
  font-size: 1px;
  color: #757575;
  margin-top: 6px;
  margin-left: 3px
}

.tagTxt {
  margin-top: 10px;

}
</style>
