<template>
  <div class="banner">

  </div>
  <div class="image_head">
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
            {{ totalCollect }}
          </span>
          <br>
          <span class="type">收藏数</span>
        </span>
        <span class="fans">
          <span class="num">
            {{ totalPost }}
          </span>
          <br>
          <span class="type">文章数</span>
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
      <van-tag plain v-for="tag in tagList" type="primary" style="margin-right: 3px">{{ tag }}</van-tag>
    </div>
    <div>
      <p class="wenzi">{{ user.profile === '' ? '这个人很神秘，什么都没有写' : user.profile }}</p>
    </div>
  </div>


  <van-divider/>
  <div class="cont">
    <van-pull-refresh style="width: 100%;" v-model="postLoading" @refresh="onRefresh">
      <div id="postList">
        <van-list v-if="postList.length>0" style="background-color: #f0f2f5;padding-top: 5px">
          <div v-for="post in postList" style="width: auto;height: auto;padding-bottom: 10px">
            <div style="padding: 16px; background-color: #ffffff">
              <div style="display:flex;max-width: 100%;height: 24px;margin-bottom: 12px;margin-top: 3px">
                <div style="margin-right: 10px">
                  <van-image
                      round
                      width="1.7rem"
                      height="1.7rem"
                      :src="post.userAvatarVo.avatarUrl"
                  />
                </div>
                <div style="flex: 1.0;width: 0 ;color:rgb(0 0 0 / 85%)">
                  <p style="color: #567895;font-size: 15px;line-height: 24px;">
                    {{ post.userAvatarVo.username }}</p>

                </div>
                <van-popover :show="deleteHasPostIdSet.get(post.id)" :actions="actions" @select="onSelect(post.id)"
                             placement="bottom-end">
                  <template #reference>
                    <van-icon name="ellipsis" style="width: 16px;height: 16px"/>
                  </template>
                </van-popover>
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
  </div>

</template>

<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";
import myAxios from "../../plugins/myAxios";
import {showSuccessToast, showFailToast} from 'vant';
import store from "../../store";
import {showToast} from 'vant';

const description = ref("加载中......")

const router = useRouter();
const route = useRoute();
const postList = ref([]);
const tagList = ref([]);
const commentTxt = ref("");
const thumbHasPostId = ref(new Set());
const collectHasPostId = ref(new Set());
const deleteHasPostIdSet = ref(new Map());
const thumbMap = ref(new Map());
const collectMap = ref(new Map());
const isComment = ref(new Map());
const commentMap = ref(new Map());
const postLoading = ref(false);
const user = ref(store.getters.getUser);
const totalCollect = ref(0);
const totalPost = ref(0);
const totalThumb = ref(0);
const actions = [
  {text: '删除'},
];
onMounted(() => {
  const tag = user.value.tags;
  if (tag && tag !== '') {
    tagList.value = JSON.parse(tag);
  }
  getPostList();
})

const onSelect = (id) => {
  myAxios.post("/post/delPost", {
    id: id
  }).then(resp => {
    if (resp.code === 200) {
      deleteHasPostIdSet.value.delete(id);
      postList.value=postList.value.filter(post => post.id!==id)
      thumbHasPostId.value.delete(id)
      collectHasPostId.value.delete(id)
      thumbMap.value.delete(id);
      collectMap.value.delete(id);
      commentMap.value.delete(id)
      isComment.value.delete(id);
      showSuccessToast("删除成功");

    } else {
      showFailToast(resp.description)
    }
  }).catch(resp => {
    showFailToast("删除失败");
  })

}

const getPostList = () => {
  myAxios.post("/post/getPost/user", {
    content: "",
    pageNum: 1,
    pageSize: 10,
    sorted: 1,
    tagId: "",
    userId: ""
  }).then(resp => {
    if (resp.code === 200 && resp.data) {
      const data = resp.data;
      const list = data.postList;
      for (let i = 0; i < list.length; i++) {
        const postVo = list[i];
        try {
          postVo.tag = JSON.parse(postVo.tag);
        } catch (e) {
          postVo.tag = [];
        }
        postList.value.push(postVo)
      }
      totalCollect.value = data.totalCollect;
      totalPost.value = data.totalPost;
      totalThumb.value = data.totalThumb;
      for (let i = 0; i < postList.value.length; i++) {
        const post = postList.value[i];
        deleteHasPostIdSet.value.set(post.id, false);
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
const toUser = () => {
  router.push({
    path: '/user'
  })
}

</script>

<style scoped>
.hed {
  height: auto;
  width: auto;
  margin-bottom: 0px;
  display: flex;
}

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
  height: 27vmin;
  overflow: hidden;
  background: url(/public/banner.jpg) 50%;
}

.image_head {
  padding: 0 3.2vmin;
}

.tagTxt {
  margin-top: 10px;

}

.icon_is {
  background-image: url(https://wx.zsxq.com/dweb2/assets/resources/sprite@1x.fb4b9063d37e9252.png);
  background-position: -226px -236px;
}
</style>