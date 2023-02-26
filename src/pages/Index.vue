<template>
  <van-notice-bar v-if="notice"
                  left-icon="volume-o"
                  scrollable
                  :text="notice"
                  color="#1989fa" background="#ecf9ff"
  />
  <van-tabs v-model:active="active" @click-tab="onClickTab">
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" @click=""/>
      <van-action-bar-icon icon="cart-o" text="购物车" @click=""/>
      <van-action-bar-icon icon="shop-o" text="店铺" @click=""/>
      <van-action-bar-button type="danger" text="立即购买" @click="onClickButton"/>
    </van-action-bar>
    <van-tab title="贴吧">
      <van-list style="background-color: #f0f2f5;padding-top: 5px">
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
            <p style="width: auto;height: auto;font-size:15px">
              {{ post.content }}
            </p>
            <div style="display: flex">
              <a>
                <van-icon class="icon" style="display: flex" :color="hasThumb(post.id)?'#d32':''" name="like-o"
                          @click="isThumb(post.id);">
                  <div style="font-size:12px;margin-top: 5px">
                    {{ map.get(post.id) === 0 ? '' : map.get(post.id) }}
                  </div>
                </van-icon>
              </a>
              <van-icon class="icon" name="comment-o" @click="isComment=!isComment"/>
              <van-icon class="icon" name="star-o" @click=""/>

            </div>
            <div style="margin-top:12px" v-if="isComment">
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
            <div style="background-color:  #f0f2f5;margin-top: 10px">
              <div style="padding: 1px 1px 1px 9px">
                <div v-for="content in commentMap.get(post.id)">
                  <p style="font-size: 14px;">{{ content }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </van-list>

    </van-tab>


    <van-tab title="用户">
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

    </van-tab>
    <van-tab title="队伍">
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
import {inject, onMounted, ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios";
import {Notify, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import TeamCardList from "../components/TeamCardList.vue";

import store from "../store";


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

const postList = ref([]);
const commentValue = ref("");
const commentTxt = ref("");
const isComment = ref(false);
const setPostId = ref(new Set());
const map = ref(new Map());
const commentMap = ref(new Map());
onMounted(async () => {
  await getPostList();
  const response = await myAxios.get('/api/userNotice/getNotice', {
    params: {
      region: 1,
    }
  });
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
const getPostList = async () => {
  const resp = await myAxios.post("/post/getPost", {
    content: "",
    pageNum: 1,
    pageSize: 10,
    sorted: 0,
    tagId: "",
    userId: ""
  })
  if (resp.code === 200) {
    postList.value = resp.data.records;
    for (let i = 0; i < postList.value.length; i++) {
      const post = postList.value[i];
      if (post.hasThumb === true) {
        setPostId.value.add(post.id)
      }
      map.value.set(post.id, post.thumb)
      commentMap.value.set(post.id, post.commentList)
    }
  }
}
const isThumb = async (id) => {
  const resp = await myAxios.post("/post/doThumb", {
    postId: id
  });
  if (resp.code === 200) {
    if (hasThumb(id)) {
      setPostId.value.delete(id);
      if (map.value.has(id)) {
        let num = map.value.get(id);
        if (num >= 1) {
          map.value.set(id, --num)
          return;
        }
        map.value.delete(id)
      }
    } else {
      setPostId.value.add(id);
      if (map.value.has(id)) {
        let num = map.value.get(id);
        map.value.set(id, ++num)
      } else {
        map.value.set(id, 1);

      }
    }
  } else {
    Toast.fail("点赞失败");
  }


}
const sendPost = async (postId) => {
  if (postId == null || commentTxt.value === "") {
    return;
  }
  if (!store.getters.getIsLogin) {
    Toast.fail("请先登录")

  }
  const user =store.getters.getUser
  if (!user) {
    return;
  }

  const resp =await myAxios.post("/postComment/doComment",{
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
const hasThumb = (id) => {
  return setPostId.value.has(id);
}
</script>

<style scoped>
.icon {
  margin-right: 15px;
}

.comment {
  height: 30px;
}

*

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
</style>
