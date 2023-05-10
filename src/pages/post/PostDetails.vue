<template>
  <div v-if="post!=null" class="psi">
    <div class="auth_info">
      <div class="uName">
        <van-image
            round
            width="1.7rem"
            height="1.7rem"
            :src="post.postUserVo.avatarUrl"
        />
        <div class="namepost">
          <span class="name">{{ post.postUserVo.username }}</span>
          <br>
          <span class="ct">{{ post.createTime }}</span>
        </div>
      </div>
    </div>
    <div style="width: 100%;height: auto;font-size:15px;overflow:auto;">
      <div v-html="post.content" id="content" ></div>
    </div>

    <van-divider/>
    <div class="butt">
      <van-button round plain hairline icon="good-job-o" :color="post.hasThumb ?'#00aeec':''" size="small" @click="doThumb">点赞</van-button>
      <van-button round plain hairline icon="star-o"  :color="post.hasCollect ?'#00aeec':''" size="small" @click="doCollect">收藏</van-button>
    </div>
    <span class="com">评论{{ `(` + le + `)` }}</span>
    <van-list v-if="post.commentList&& post.commentList.length>0"  v-for="post in post.commentList">
      <div style="display:flex;">
        <van-divider/>
        <div class="auth_info">
          <div class="uName">
            <van-image
                round
                width="1.7rem"
                height="1.7rem"
                :src="post.owner.avatarUrl"
            />
            <div class="namepost">
              <span class="name">{{ post.owner.username }}</span>
              <br>
              <span class="ct">{{ post.createTime }}</span>
            </div>
          </div>
        </div>
        <div v-if="post._com" class="pl" >

          <van-popover  placement="bottom-end" :actions="actions" @select="delCom(post.commentId)" >
            <template #reference>
              <van-icon style="margin-right: 10px" name="ellipsis"/>
            </template>
          </van-popover>
        </div>

        
      </div>
      <span class="postContent">
          {{ post.content }}
        </span>
    </van-list>
      <van-empty description="暂无评论"
                 image-size="2rem" v-if="post.commentList&&post.commentList.length<=0" style="height: 100px;width: 100%"/>

    <div class="send">
      <van-search
          left-icon="edit"
          v-model="commTxt"
          show-action
          placeholder="围观不如发送..."
          @search="sendCommTxt"
      >
        <template #action>
          <div @click="sendCommTxt">发送</div>
        </template>
      </van-search>
    </div>
  </div>


</template>


<script setup>
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../config/myAxios";
import store from "../../store";
import {showConfirmDialog, showFailToast, showToast,showSuccessToast} from "vant";
import postRequest from "../../plugins/request/postRequest";
import moment from 'moment'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const route = useRoute()
const router = useRouter()
const postId = route.query.id
const post = ref();
const commTxt = ref('');
const le = ref(0);
const actions = [
  {text: '删 除', color: 'red'},
];

onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showToast({message:'未登录',position: 'top'});
    await router.back();
  }
  await getPost();
})
const getPost = async () => {
  const resp = await myAxios.get("/post/get", {
    params: {
      postId: postId,
    }
  })
  if (resp.code === 200 && resp.data) {
    const postData = resp.data;
    if (postData && postData.createTime) {
      postData.createTime = postData.createTime.replace("T", " ")
    }
    if (postData.commentList) {
      le.value = postData.commentList.length
      if (postData.commentList.length > 0) {
        for (let i = 0; i < postData.commentList.length; i++) {
          if (postData.commentList[i].createTime) {
            postData.commentList[i].createTime=postData.commentList[i].createTime.replace("T"," ")
          }
        }
      }
    }
    post.value = postData;
  }
}
const doThumb = () => {
  if (!post.value.id) {
    return;
  }
  post.value.hasThumb = !post.value.hasThumb;

  myAxios.post("/post/doThumb", {
    postId: post.value.id
  }).then(resp => {
    if (resp.code === 200) {

    } else {
      post.value.hasThumb = !post.value.hasThumb;
    }
  }).catch(resp => {
    post.value.hasThumb = !post.value.hasThumb;

  })
}
const delCom =  (id) => {

  showConfirmDialog({
    title: '确认删除吗?',
  }).then(async() => {
    const resp = await postRequest.delComm(id,postId)
    if (resp.code === 200) {
      showSuccessToast("删除成功")
      if (post.value.commentList&&post.value.commentList.length>0) {
        const commentList=post.value.commentList
        post.value.commentList= commentList.filter(comm=>{
         return id!==comm.commentId
        })
      }
    }
    // on confirm
  }).catch(() => {

    // on cancel
  });
}
const doCollect = () => {
  if (!post.value.id) {
    return;
  }
  post.value.hasCollect = !post.value.hasCollect;
  myAxios.post("/post/doCollect", {
    postId: post.value.id,
  }).then(resp => {
    if (resp.code === 200) {

    } else {
      post.value.hasCollect = !post.value.hasCollect;
    }
  }).catch(resp => {
    post.value.hasCollect = !post.value.hasCollect;

  })
}
const sendCommTxt =async () => {
  if (postId == null || commTxt.value === "") {
    return;
  }
  let txt= commTxt.value;
  commTxt.value = "";
  if (!store.getters.getIsLogin) {
    showFailToast("请先登录")
  }
  const user = store.getters.getUser
  if (!user) {
    return;
  }
  const rep = {
    content: txt,
    owner: {
      id: user.id,
      username: user.userAccount,
      avatarUrl: user.avatarUrl
    },
    postId: postId,
    createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    _com: true,
  }
  const resp = await myAxios.post("/post/doComment", {
    "content": txt,
    "postId": postId,
    "replyId": "",
    "userId": user.id,
  })
  const commentList=post.value.commentList
  commentList.push(rep)
  if (resp.code !== 200) {
    post.value.commentList= commentList.filter(comm=>{
      return txt!==comm.txt
    })
  }
}
</script>

<style scoped>
.auth_info {
  margin-top: 30px;
  margin-bottom: 24px;
  height: 24px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center
}

.uName {
  display: flex;
  align-items: center;
}

.namepost {
  color: #4D4D4D;
  margin-left: 12px;
}

.name {
  font-size: 14px;
  color: #567895
}

.ct {
  color: #B3B3B3;
  font-size: 9px;

}

.psi {
  overflow-y: auto;
  overflow-x: auto;
  height: 100%;
  padding: 14px;
}

.butt {
  margin-top: 20px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-evenly;
  align-items: center
}

.com {
  font-size: 12px;
  color: #567895

}

.postContent {
  margin-left: 35px;
  font-size: 14px;
}
.send{
  position: initial;
  width: 100%;
  height: 20%;
}
.pl{
  position: relative;
  left: 46%;
  margin: 12px
}
</style>