<template>
  <div id="record">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
    <span v-if="postList.length>0" v-for="post in postList">
      <div class="fo">
              <div class="txt"
                   v-html="post.content" @click="toDetails(post.id)"/>
      </div>
      <div class="van-hairline--bottom"></div>
    </span>
    </van-list>

    <van-empty v-if="postList.length<=0" description="数据为空"/>
  </div>

</template>

<script setup>

import {onMounted, ref} from "vue";
import postRequest from "../../plugins/request/postRequest";
import {useRouter} from "vue-router";
const loading = ref(false);
const finished = ref(false);
const router = useRouter()
const postList = ref([]);
let total = 0;
let page = 1;
onMounted(async () => {

})
const toDetails = (id) => {
  router.push({
    path: "/space/details",
    query: {
      id: id,
    }
  })
}
const onLoad =async () => {
  const response = await postRequest.getPostByRecord(page,10);
  if (response.code === 200 && response.data) {
    for (let post of response.data.list) {
      postList.value.push(post)
    }
    total=response.data.total
    page++;
  }
  loading.value = false;
  if (postList.value.length >= total) {
    finished.value = true;
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
#record{
  height: 88vh;
  width: 100%;
  overflow-y: auto;
}
</style>