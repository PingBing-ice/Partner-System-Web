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

  <div v-if="activeIds&&activeIds.length ===0 " style="color: #42b983; text-align: center">请选择标签</div>
  <van-row gutter="20" justify="center">
    <van-col v-for="tag in activeIds">
      <van-tag :show="show" closeable size="medium" type="primary" @close="doClose(tag)" plain>
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
      @click-item="add"
  />
  <div style="padding: 12px">
    <van-button block type="primary" plain @click="updateResult">修改</van-button>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import store from "../../store";
import {showFailToast, showSuccessToast, showToast,showConfirmDialog} from "vant";


const router = useRouter();

// 标签列表
const InitTagList = ref([])
const InitTag = ref([])
const tagList = ref([])
// 已选择的标签
const activeIds = ref([]);
const activeIndex = ref(0);
const searchTest = ref('');

onMounted(() => {
  const user = store.getters.getUser;
  if (user != null) {
    let tag
    try {
      if (user.tags) {
        tag = JSON.parse(user.tags);
      }
    } catch (e) {
      try {
        if (user.tags) {
          tag = JSON.parse(JSON.stringify(user.tags));
        }
      } catch (e) {
        showFailToast("系统错误");
        router.back();
      }
    }
    if (tag) {

      activeIds.value = tag;
    }
  } else {
    showFailToast("未登录");
    router.back();
  }

  getLabel();
  tagList.value = InitTagList.value;
})
const getLabel = () => {

  myAxios.get('/api/userLabel/getUserLabel').then(res => {
    if (res.code === 200) {
      const b = res.data
      for (let i = 0; i < b.length; i++) {

        const tagData = b[i]
        const labelList = []
        for (let label of tagData.label) {
          let k = {text: label, id: label.toString()}
          labelList.push(k)
        }
        let a = {
          text: tagData.labelType,
          children: labelList
        }
        InitTagList.value.push(a)
        InitTag.value.push(a)

      }
    }
  });

}
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
  tagList.value = InitTag.value;
}
const add = () => {
  console.log(activeIds.value)
}
const show = ref(true);
// 移出标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return tag !== item;
  })
};
const updateResult = () => {
  if (activeIds.value.length <= 0) {
    showToast({message:"请选择标签",position: 'top',})
    return;
  }
  showConfirmDialog({
    title: '确认提交吗?',
    message:
        '每天只能提交五次',
  }).then(() => {
    const user = store.getters.getUser;
    let tag;
    try {
      tag = JSON.stringify(activeIds.value);
    } catch (e) {
      showToast({message:'请求错误请重试',position: 'top'});

      return;
    }
    myAxios.post("/api/user/update", {
      id: user.id,
      tags: tag
    }).then(resp => {
      if (resp.code === 200 && resp.data) {
        store.commit("setUser", resp.data)
        router.replace({
          path: '/user'
        })
        showSuccessToast("修改成功");
      } else {
        showFailToast(resp.description);
      }
    }).catch(() => {
      showFailToast("修改失败")
    });
  });
}

</script>

<style scoped>

</style>
