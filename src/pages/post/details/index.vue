<template>

  <div v-if="post!=null" id="postDetails">
    <div class="content_detail">
      <div class="auth_info">
        <div class="uName">
          <van-image
              round
              width="1.7rem"
              height="1.7rem"
              :src="post.userVo.avatarUrl"
          />
          <div class="namepost">
            <span class="name">{{ post.userVo.username }}</span>
            <br>
            <span class="ct">{{ post.createTime }}</span>
          </div>
        </div>
      </div>
      <div class="post_details_content">
        <div v-html="post.content" id="content"></div>
      </div>

      <div class="tagTxt">
        <van-tag plain v-if="post.tag&&post.tag.length>0" v-for="tag in post.tag" type="primary"
                 class="postTag" style="margin-right: 3px">{{ tag }}
        </van-tag>
      </div>
      <div class="butt">
        <div style="display: flex">
          <label class="container">
            <input type="checkbox" :checked="post.hasThumb" @click="doThumb">
            <svg t="1685069060656" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="2372" width="18" height="18" fill="#999999">
              <path
                  d="M939.358251 423.424662c-23.01825-37.252439-62.924121-60.779272-107.019409-63.209624-2.755764-0.38681-5.510504-0.579191-8.347109-0.579191l-152.202471-0.121773c6.649444-28.975938 10.015098-58.653865 10.015098-88.657202 0-28.223808-3.213181-57.139372-9.556657-85.952604-0.447185-2.043542-1.098008-4.006244-1.932002-5.866614-15.820314-57.302077-67.37755-96.841605-127.282918-96.841605-72.827679 0-132.081201 59.254545-132.081201 132.081201 0 3.334955 0.132006 6.66991 0.406253 10.015098-2.196015 57.211003-32.108279 109.947088-80.269162 141.363611-14.447037 9.42465-18.524912 28.773324-9.099239 43.220361 9.414417 14.437827 28.752858 18.535145 43.220361 9.099239 65.811892-42.925648 106.429984-115.325585 108.656699-193.684234 0.030699-1.332345-0.010233-2.663666-0.14224-3.996011-0.203638-2.012843-0.304945-4.016477-0.304945-6.019087 0-38.381146 31.233352-69.614497 69.614497-69.614497 32.57593 0 60.474326 22.204721 67.824735 53.997821 0.356111 1.534959 0.823761 3.019777 1.402953 4.453429 4.696975 22.814612 7.076162 45.579081 7.076162 67.743894 0 37.485753-6.222725 74.352405-18.494213 109.592001-3.324722 9.546424-1.819438 20.111037 4.02671 28.345582 5.856381 8.245801 15.332197 13.146415 25.448602 13.156648l193.226816 0.101307c1.423419 0.264013 2.857071 0.426719 4.300956 0.477884 24.116257 0.9967 45.935192 13.614066 58.603723 34.090423 7.838525 12.31242 11.438517 26.800389 10.431583 41.939181-0.080841 0.945535-0.121773 1.911536-0.11154 2.877537 0 0.854461 0.040932 1.697665 0.11154 2.53166 0.010233 0.335644-0.030699 0.661056-0.11154 0.976234-0.101307 0.376577-0.193405 0.772596-0.284479 1.159406l-74.972529 330.391802c-0.914836 1.281179-1.738597 2.6432-2.449795 4.046153-5.937223 11.762905-14.660908 21.48329-25.346271 28.172643-10.746762 6.812149-23.059182 10.614755-35.757388 11.06194-0.854461-0.061398-513.766226-0.224104-513.766226-0.224104-0.467651-0.020466-0.935302-0.030699-1.402953-0.030699 0 0-111.01542 0.172939-112.718201 0.457418-1.932002 0-3.446495-1.50426-3.446495-3.415796l0.299829-416.334173c0-1.901303 1.545192-3.446495 3.01466-3.456728l1.245364 0.121773c1.174756 0.132006 2.653433 0.284479 3.52836 0.193405l83.82822-0.222057 0 339.367221c0 17.253966 13.979386 31.233352 31.233352 31.233352s31.233352-13.979386 31.233352-31.233352L281.009092 435.350273c0-1.778506 0-8.631588 0-10.411117 0-17.253966-13.979386-30.928407-31.233352-30.928407-1.50426 0-117.547183 0.304945-119.402437 0.304945-36.34272 0-65.913199 29.566386-65.913199 65.893756l-0.299829 416.334173c0 36.337603 29.571503 65.902966 65.913199 65.902966 2.541893 0 111.406323-0.457418 111.406323-0.457418 0.457418 0.020466 0.925069 0.030699 1.382487 0.030699 0 0 511.458671 0.274246 512.505513 0.274246 25.469068 0 50.296523-7.197936 71.647807-20.73116 19.612687-12.281721 35.777855-29.881564 46.839795-50.967812 3.660366-5.622044 6.435573-11.875468 8.256034-18.615986 0.11154-0.416486 0.213871-0.823761 0.304945-1.240247l74.881454-330.340637c1.596358-6.212492 2.257413-12.586666 2.00261-18.992563C960.892707 473.366098 953.948551 446.331371 939.358251 423.424662z"
                  p-id="2373"></path>
              <path
                  d="M450.027553 518.650467c-17.253966 0-31.233352 13.979386-31.233352 31.233352l0 30.470989c0 17.253966 13.979386 31.233352 31.233352 31.233352 17.253966 0 31.233352-13.979386 31.233352-31.233352l0-30.470989C481.260905 532.629853 467.281519 518.650467 450.027553 518.650467z"
                  p-id="2374"></path>
              <path
                  d="M693.805696 518.650467c-17.253966 0-31.233352 13.979386-31.233352 31.233352l0 30.470989c0 17.253966 13.979386 31.233352 31.233352 31.233352 17.253966 0 31.233352-13.979386 31.233352-31.233352l0-30.470989C725.039048 532.629853 711.058638 518.650467 693.805696 518.650467z"
                  p-id="2375"></path>
              <path
                  d="M648.940882 660.09492c-14.304797-9.393951-33.592073-5.398964-43.159986 8.763594-0.132006 0.193405-13.614066 19.754926-34.171264 19.754926-19.98824 0-32.423457-18.09717-33.266661-19.368116-9.17087-14.427594-28.254507-18.809391-42.834574-9.770528-14.650675 9.109472-19.155269 28.366048-10.055007 43.016723 11.214413 18.047028 41.96988 48.588625 86.156242 48.588625 43.962258 0 75.104535-30.318516 86.572728-48.222281C667.404396 688.461991 663.216004 669.500127 648.940882 660.09492z"
                  p-id="2376"></path>
            </svg>
            <div class="svg-name" :style="post.hasThumb?'color: #00aeec':''">
              点赞
            </div>

          </label>
        </div>
        <div style="display: flex">
          <label class="container">
            <input type="checkbox" :checked="post.hasCollect" @click="doCollect">
            <svg t="1685070654241" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" p-id="2387" width="18" height="18">
              <path
                  d="M940.704 416.064c-32.192-98.368-227.68-109.92-244.672-110.72l-1.184-3.68c0 0-79.264-198.08-187.424-198.08-99.552 0-172.64 167.744-183.68 194.528L321.12 301.76c-16.896 1.088-212.48 15.936-244.64 114.304-34.176 104.608 125.376 236.064 130.112 239.776-0.608 2.24-53.056 205.984 34.208 268.928 87.264 62.976 265.952-49.792 267.872-50.976 1.888 1.184 180.608 113.952 267.84 50.976 87.744-63.328 34.176-268.96 34.176-268.96l0-0.096C814.976 652.48 976.064 524.224 940.704 416.064zM206.624 655.84c0-0.032 0-0.032-0.032-0.032L206.624 655.84 206.624 655.84zM764.896 639.264l4.8 11.456c0 0 60.736 183.328-18.208 240.352-78.528 56.672-241.056-61.6-242.752-62.72-1.728 1.12-166.048 117.472-244.576 60.768-78.528-56.672-10.112-245.216-9.6-247.264-4.256-3.328-169.536-118.176-138.752-212.32 28.928-88.576 213.536-91.872 228.736-92.864l2.4-3.328c9.92-24.064 72.16-193.952 161.792-193.952 97.376 0 160.544 198.272 160.544 198.272l1.088 3.296c15.264 0.736 206.336 0.032 235.296 88.576C937.472 526.88 768.736 636.32 764.896 639.264z"
                  p-id="2388"></path>
            </svg>
            <div class="svg-name" :style="post.hasCollect?'color: #00aeec':''">
              收藏
            </div>
          </label>

        </div>
      </div>
      <span class="com">评论{{ `(` + le + `)` }}</span>
      <van-list v-if="post.commentList&& post.commentList.length>0" v-for="post in post.commentList">
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
          <div v-if="post.com" class="pl">

            <van-popover placement="bottom-end" :actions="actions" @select="delCom(post.commentId)">
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
                 image-size="6rem" v-if="post.commentList&&post.commentList.length<=0"
                 style="height: 18rem;width: 100%"/>
    </div>

    <MsgInput :placeholder="'围观不如发送...'" @input="setMess" @but="sendCommTxt"/>
  </div>


</template>


<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import store from "../../../store";
import {showConfirmDialog, showFailToast, showToast, showSuccessToast} from "vant";
import postRequest from "../../../plugins/request/postRequest";
import moment from 'moment'
import MsgInput from "@/components/MsgInput.vue";
import {CommentVo, PostVoType} from "@/plugins/request/dao/post";


const route = useRoute()
const router = useRouter()
const postId = route.query.id
const post = ref<PostVoType>();
const commTxt = ref('');
const le = ref(0);
const actions = [
  {text: '删 除', color: 'red'},
];

onMounted(async () => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
    await router.back();
  }
  await getPost();
})
const getPost = async () => {
  if (!postId) {
    await router.back();
    return;
  }
  const resp = await postRequest.getPostById(Number(postId));
  if (resp.code === 200 && resp.data) {
    const postData: PostVoType = resp.data;
    if (postData && postData.createTime) {
      postData.createTime = postData.createTime.replace("T", " ")
    }
    if (postData.tag) {
      postData.tag = JSON.parse(postData.tag);
    }
    if (postData.commentList) {
      le.value = postData.commentList.length;
      for (let comment of postData.commentList) {
        if (comment.createTime) {
          comment.createTime = comment.createTime.replace("T", " ")
        }
      }
    }
    post.value = postData;
  } else {
    if (resp.data.description) {
      showToast({message: resp.data.description, position: 'top'});
    } else {
      showToast({message: resp.data.message, position: 'top'});
    }
    await router.back();
  }
}
const doThumb = async () => {
  if (!post.value || !post.value.id) {
    return;
  }
  post.value.hasThumb = !post.value.hasThumb;
  const response = await postRequest.doThumb(post.value.id);
  if (response.code !== 200) {
    post.value.hasThumb = !post.value.hasThumb;

  }
}
const delCom = (id: number) => {

  showConfirmDialog({
    title: '确认删除吗?',
  }).then(async () => {
    if (!post.value || !post.value.id) {
      return;
    }
    const resp = await postRequest.delComm(id, post.value.id)
    if (resp.code === 200) {
      showToast({message: '删除成功', position: 'top',});
      if (post.value.commentList && post.value.commentList.length > 0) {
        const commentList = post.value.commentList
        post.value.commentList = commentList.filter(comm => {
          return id !== comm.commentId
        })
      }
    }
    // on confirm
  }).catch(() => {

    // on cancel
  });
}
const doCollect = async () => {
  if (!post.value || !post.value.id) {
    return;
  }
  post.value.hasCollect = !post.value.hasCollect;
  const response = await postRequest.doCollect(post.value.id);
  if (response.code !== 200) {
    post.value.hasCollect = !post.value.hasCollect;
  }

}
const sendCommTxt = async () => {
  if (!post.value || !post.value?.id || commTxt.value === "") {
    return;
  }
  let txt = commTxt.value;
  commTxt.value = "";
  if (!store.getters.getIsLogin) {
    showFailToast("请先登录")
  }
  const user = store.getters.getUser
  if (!user) {
    return;
  }
  const rep: CommentVo = {
    content: txt,
    owner: {
      id: user.id,
      username: user.userAccount,
      avatarUrl: user.avatarUrl
    },
    postId: post.value?.id,
    createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    com: true,
  }
  const commentList = post.value.commentList
  if (commentList) {
    commentList.push(rep);
  }
  const response = await postRequest.doComment(txt, post.value?.id, "", user.id);
  if (response.code !== 200) {
    if (commentList) {
      post.value.commentList = commentList.filter(comm => {
        return txt !== comm.content
      })
    }

  }
}
const setMess = (value:string) => {
  commTxt.value = value;
}
</script>

<style scoped src="./styles.css">

</style>