<template>

    <span v-if="postList.length>0"  v-for="post in postList">
      <div class="fo">
              <div class="txt"
                   v-html="post.content" @click="toDetails(post.id)"/>
      </div>
      <div class="van-hairline--bottom"></div>
    </span>
  <van-empty v-if="postList.length<=0" description="数据为空请先收藏" />
</template>

<script setup>

import {onMounted, ref} from "vue";
import postRequest from "../../plugins/request/postRequest";
import {useRouter} from "vue-router";

const router = useRouter()
const postList = ref([]);
onMounted(async () => {
  const response = await postRequest.getPostCollect();
  if (response.code === 200 && response.data) {
    postList.value = response.data
  }
})
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
</style>