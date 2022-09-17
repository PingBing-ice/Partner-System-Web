<template>
  <form action="/">
    <van-search
        v-model="searchTest"
        show-action
        placeholder="请输入标签"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider>已选标签</van-divider>
  <div v-if="activeIds.length ===0 " style="color: #42b983; text-align: center">请选择标签</div>
  <van-row gutter="20" justify="center">
    <van-col v-for="tag in activeIds">
      <van-tag :show="show" closeable size="medium" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider>选择标签</van-divider>

  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
      style="height: 250px"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";


const router = useRouter();

// 标签列表
const InitTagList = ref([])
const tagList = ref(InitTagList)

const searchTest = ref('');

onMounted(async () =>{
  const res =await myAxios.get('/api/userLabel/getUserLabel')
  if (res.code === 200) {
    const b = res.data
    b.forEach(c=>{
      const labelList =[]
      c.label.forEach(m=>{
        let k ={text : m,id:m}
        labelList.push(k)
      })
      let a = {
        text: c.labelType,
        children: labelList
      }
      InitTagList.value.push(a)
    })


  }
})

const onSearch = () => {
  // 将数据扁平化处理 , 过滤搜索栏里面包含选择的标签
  tagList.value = InitTagList.value.map(parentTag => {
    const tempChildren = [...parentTag.children]
    const tempParenTag = {...parentTag}
    tempParenTag.children = tempChildren.filter(item => item.text.includes(searchTest.value));
    return tempParenTag;
  })
}
const onCancel = () => {
  searchTest.value = '';
  tagList.value = InitTagList.value;
}

const show = ref(true);
// 移出标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return tag !== item;
  })
};
const doSearchResult = () => {
  router.push({
    path: "/user/list",
    query: {
      tags: activeIds.value,
    }
  })
}

// 已选择的标签
const activeIds = ref([]);
const activeIndex = ref(0);


</script>

<style scoped>

</style>
