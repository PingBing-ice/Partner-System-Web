<template>
  <van-list v-model:loading="loading"
            :finished="finished"
            offset="500"
            finished-text="没有更多了"
            @load="onLoad" id="myDiv" v-if="postList.length>0" style="background-color: #f0f2f5;padding-top: 5px">


    <div v-for="post in postList" class="postHt">
      <div>
        <div style="display:flex;max-width: 100%;height: auto" @click="showUser(post.postUserVo)">
          <div style="margin-right: 10px">
            <van-image
                round
                width="1.7rem"
                height="1.7rem"
                :src="post.postUserVo.avatarUrl"
            />
          </div>
          <div style="flex: 1.0;width: 0 ;color:rgb(0 0 0 / 85%)">
            <p style="margin-bottom: 12px;color: #567895;font-size: 15px;line-height: 24px;margin-top: 3px">
              {{ post.postUserVo.username }}</p>
          </div>
          <van-popover v-if="propData.isOwn" placement="bottom-end" :actions="actions" @select="onSelect(post.id)">
            <template #reference>
              <van-icon style="margin-right: 10px" name="ellipsis"/>
            </template>
          </van-popover>
        </div>

        <div style="width: auto;height: auto;font-size:15px">
          <div v-html="post.content" id="content" @click="toDetails(post.id)"></div>
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
        <div v-if="commentMap.get(post.id)" class="commentMap">
          <div style="padding: 1px 1px 1px 9px">
            <div v-for="content in commentMap.get(post.id)">
              <div class="txt">
                <span class="commentName" @click="showUser(content.owner)">{{ content.owner.username }}</span>
                <span class="commentContent"> : </span>
                <span class="commentContent">{{ content.content }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </van-list>
  <van-empty v-if="postList.length<=0" description="无数据"/>

</template>

<script setup>

import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast} from "vant";
import store from "../store";
import {ref, watchEffect} from "vue";
import postRequest from "../plugins/request/postRequest";

const description = ref("加载中......")

const router = useRouter();
const route = useRoute();
const commentTxt = ref("");
const isComment = ref(new Map)
const loading = ref(false);
const message = ref('');
const userId = ref('');
const postList = ref([]);
const thumbHasPostId = ref(new Set());
const collectHasPostId = ref(new Set());
const commTxt = ref(new Map());
const thumbMap = ref(new Map());
const collectMap = ref(new Map());
const commentMap = ref(new Map());
const finished = ref(false);
let pageNum = 1;
const total = ref(40);
const emits = defineEmits(['showPostUser', 'showDeletePost'])
const propData = defineProps({
  isOwn: {
    type: Boolean,
    required: true,
  },
  sorted: {
    type: Number,
    required: true
  }
});
const showPopover = ref(false);

// 通过 actions 属性来定义菜单选项
const actions = [
  {text: '删 除', color: 'red'},
];
watchEffect(async () => {
  let sort = 1;
  if (propData.sorted) {
    if (sort === propData.sorted) {
      return;
    }
    sort = propData.sorted;
  }
  let own = false;
  if (propData.isOwn) {
    if (own === propData.isOwn) {
      return;
    }
    own = propData.isOwn;
  }
  postList.value = [];
  const resp = await postRequest.getPostList(pageNum, 10, "", sort, "", own);
  if (resp.code === 200 && resp.data.records) {
    total.value = resp.data.total
    const list = resp.data.records;
    for (let i = 0; i < list.length; i++) {
      const post = list[i];
      try {
        post.tag = JSON.parse(post.tag);
      } catch (e) {
        post.tag = [];
      }
      postList.value.push(post)
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
      commTxt.value.set(post.id, "");
    }

  }
})

// 打开
const showUser = (user) => {
  emits("showPostUser", user)
}
// 删除post
const onSelect = (id) => {
  emits("showDeletePost", id)
}
const onLoad = async () => {
  if (postList.value.length >= total.value) {
    finished.value = true;
  } else {
    ++pageNum
    let sort = 1;
    if (propData.sorted) {
      if (sort === propData.sorted) {
        return;
      }
      sort = propData.sorted;
    }
    let own = false;
    if (propData.isOwn) {
      if (own === propData.isOwn) {
        return;
      }
      own = propData.isOwn;
    }
    const resp = await postRequest.getPostList(pageNum, 10, "", sort, "", own);
    if (resp.code === 200 && resp.data) {
      total.value = resp.data.total
      const list = resp.data.records;
      for (let i = 0; i < list.length; i++) {
        const post = list[i];
        try {
          post.tag = JSON.parse(post.tag);
        } catch (e) {
          post.tag = [];
        }
        postList.value.push(post)
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
    loading.value = false;
  }
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
const sendPost = async (postId) => {
  if (postId == null || commentTxt.value === "") {
    return;
  }
  let txt= commentTxt.value;
  commentTxt.value = "";
  if (!store.getters.getIsLogin) {
    showFailToast("请先登录")
  }
  const user = store.getters.getUser
  if (!user) {
    return;
  }

  const resp = await myAxios.post("/post/doComment", {
    "content": txt,
    "postId": postId,
    "replyId": "",
    "userId": user.id,
  })
  const rep = {
    content: txt,
    owner: {
      id: user.id,
      username: user.userAccount,
      avatarUrl: user.avatarUrl
    },
    postId: postId
  }
  let commList = commentMap.value.get(postId);
  if (!commList) {
    commentMap.value.set(postId,[]);
  }
  commList = commentMap.value.get(postId);
  commList.push(rep);

  if (resp.code !== 200) {
    if (commList.length === 1) {
      commentMap.value.set(postId, []);
      return;
    }
   const comList= commList.filter(comm=>{
     return  comm.content !== txt;
    });
    commentMap.value.set(postId, comList);
  }

}

const hasThumb = (id) => {
  return thumbHasPostId.value.has(id);
}
const hasCollect = (id) => {
  return collectHasPostId.value.has(id);
}
const doIsComment = (postId) => {
  for (const key of isComment.value.keys()) {
    isComment.value.set(key, false);
  }
  commentTxt.value = '';
  if (isComment.value.get(postId)) {
    isComment.value.set(postId, false);
  } else {
    isComment.value.set(postId, true);
  }
};

const toDetails = (id) => {
  router.push({
    path: "/space/details",
    query: {
      id: id,
    }
  })
}

</script>

<style scoped>
.icon {
  margin-right: 15px;
}

#content {

  display: -webkit-box; /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 6; /*设置多少行*/
  -webkit-box-orient: vertical; /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
  overflow: hidden; /*文本会被修剪，并且剩余的部分不可见*/
  text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
  font-size: 14px;
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


.footer {
  font-size: 1px;
  color: #757575;
  margin-top: 6px;
  margin-left: 3px
}

.tagTxt {
  margin-top: 10px;

}


.fixed-button a {
  color: white;
  font-size: 40px;
  text-decoration: none;
}

.txt {
  font-size: 14px;
  line-height: 24px;
  color: #5a5c66;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.commentName {
  color: #567895;
  cursor: pointer
}

.commentContent {
  color: #5a5c66;
}


.commentMap {
  background-color: #f7f9fa;
  margin-top: 10px
}

.postHt {
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

</style>