<template>
  <form action="/">
    <van-search
        v-model="searchTxt"
        show-action
        placeholder="请输入标签"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
        @clear="onCancel"
    />
  </form>
  <van-divider>已选标签</van-divider>

  <div v-if="activeIds&&activeIds.length ===0 " style="color: #42b983; text-align: center">请选择标签</div>
  <van-row gutter="20" justify="center">
    <van-col v-for="id in activeIds">
      <van-tag :show="show" closeable size="medium" type="primary" @close="doClose(id)" plain>
        {{ tagMap.get(id) }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider>选择标签</van-divider>

  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
      style="height: 250px"
      @click-item="add"
  />
  <div style="padding: 12px">
    <van-button block type="primary" plain @click="updateResult">修改</van-button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from "vue-router";
import {showSuccessToast, showToast, showConfirmDialog} from "vant";
import tagRequest from "../../plugins/request/tagRequest";
import {userTag} from "@/plugins/request/dao/tag";
import store from "@/store";
import userRequest from "@/plugins/request/userRequest";
import {setToken} from "@/util/cookie";

const router = useRouter();
// 展示的标签
const tagList = ref<treeSelect[]>([])
const InitTagList = ref<treeSelect[]>([])
// 已选择的标签
const activeIds = ref<number[]>([]);


const activeIndex = ref(0);
const searchTxt = ref('');
// id 对应的tag
const tagMap = ref<Map<number, string>>(new Map<number, string>)

interface children {
  text: string;
  id: number;
}

interface treeSelect {
  text: string;
  children: children[];
}

onMounted(async () => {
  await getLabel();
})
const getLabel = async () => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top',});
    router.back();
  }
  const response = await tagRequest.getUserTag();
  if (response.code === 200 && response.data) {
    const data: userTag[] = response.data
    const transformedData: treeSelect[] = data.map((userTag) => {
      const tree: treeSelect = {
        text: userTag.type,
        children: userTag.tagList.map((userTagList) => {
          tagMap.value.set(userTagList.id, userTagList.tag);
          return {
            text: userTagList.tag,
            id: userTagList.id,
          };
        }),
      };
      return tree;
    });
    tagList.value.push(...transformedData);
    InitTagList.value = tagList.value;
  }
  const user = store.getters.getUser;
  if (user.tags) {
    const tags = JSON.parse(user.tags);
    for (const t of tags) {
      const key = [...tagMap.value.keys()].find(key => tagMap.value.get(key) === t);
      if (key) {
        activeIds.value.push(key);
      }
    }
  }
}
const onSearch = () => {
  if (searchTxt.value === '') {
    return;
  }
  // 将数据扁平化处理 , 过滤搜索栏里面包含选择的标签
  tagList.value = InitTagList.value.map(parentTag => {
    const tempChildren = [...parentTag.children]
    const tempParenTag = {...parentTag}
    tempParenTag.children = tempChildren.filter(item => item.text.includes(searchTxt.value));
    return tempParenTag;
  });
}
const onCancel = () => {
  searchTxt.value = '';
  tagList.value = InitTagList.value
}
const add = () => {

}
const show = ref(true);
// 移出标签
const doClose = (tag: number) => {
  activeIds.value = activeIds.value.filter(item => {
    return tag !== item;
  })
};
const updateResult = async () => {
  if (activeIds.value.length <= 0) {
    showToast({message: "请选择标签", position: 'top',})
    return;
  }
  showConfirmDialog({
    title: '确认提交吗?',
    message:
        '每天只能提交五次',
  }).then(async () => {
    const user = store.getters.getUser;
    let tag;
    try {
      tag = JSON.stringify(activeIds.value);
    } catch (e) {
      showToast({message: '请求错误请重试', position: 'top'});
      return;
    }
    const response = await userRequest.update({id: user.id, tags: tag});
    if (response.code === 200 && response.data) {
      setToken(response.data)
      const  resp=await userRequest.getCurrentUser();
      store.commit("setUser", resp.data)
      await router.replace({
        path: '/user'
      })
      showToast({message: '修改成功', position: 'top'});
    }
  });
}

</script>

<style scoped>

</style>
