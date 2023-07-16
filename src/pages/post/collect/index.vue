<template>

    <span v-if="postList.length>0" v-for="post in postList">
      <div class="fo">
              <div class="txt"
                   v-html="post.content" @click="toDetails(post.id)"/>
      </div>
      <div class="van-hairline--bottom"></div>
    </span>
  <van-empty v-if="postList.length<=0" description="数据为空请先收藏"/>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import postRequest from "@/plugins/request/postRequest";

const router = useRouter()
const postList = ref([]);
onMounted(async () => {
  const response = await postRequest.getPostCollect();
  if (response.code === 200 && response.data) {
    postList.value = response.data
  }
})
const toDetails = (id:number) => {
  router.push({
    path: "/post/details",
    query: {
      id: id,
    }
  })
}
</script>

<style scoped src="./styles.css">

</style>