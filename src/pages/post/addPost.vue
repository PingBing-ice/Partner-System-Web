<template>

  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="message"
          rows="8"
          autosize
          type="textarea"
          maxlength="1000"
          placeholder="点击此处说点什么"
          show-word-limit
      >
        <template #button v-if="addTagSet.size>0">
          <div style="display: flex;flex-direction: column">
            <div v-for="tagId in addTagSet">
              <van-tag plain type="primary" closeable @close="closeTag(tagId)" style="margin-bottom: 10px"
                       size="medium">
                {{ tagMap.get(tagId) }}
              </van-tag>
            </div>
          </div>
        </template>
      </van-field>
      <div class="icon">
        <van-uploader :after-read="afterRead">
          <van-icon name="photo-o" class="icon-is"/>
        </van-uploader>
        <van-icon name="bookmark-o" @click="iconButton" class="icon-is"/>
      </div>
      <div class="van-hairline--top" v-if="isIcon">
        <van-row justify="space-around">
          <van-col span="6" v-for="tag in tagIdList">
            <van-tag plain type="primary" @click="addTag(tag);" size="medium">{{ tagMap.get(tag) }}</van-tag>
          </van-col>
        </van-row>
      </div>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script setup>
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import {showSuccessToast, showFailToast} from 'vant';
import {useRouter} from "vue-router";
import { showToast } from 'vant';



const message = ref('')
const filePost = ref();
const tagIdList = ref([]);
const addTagSet = ref(new Set());
const router = useRouter()
const tagMap = ref();
const isIcon = ref(false);
onMounted(() => {
  // 获取标签
  myAxios.get("/api/userLabel/getLabel").then(resp => {
    if (resp.code === 200 && resp.data) {
      tagMap.value = new Map(Object.entries(resp.data))
      for (let valueKey of tagMap.value.keys()) {
        tagIdList.value.push(valueKey)
      }
    }
  })
})

const afterRead = (file) => {
  filePost.value = file.file;
};
// 提交
const onSubmit = () => {
  if (message.value.length <= 0) {
    showToast("请输入内容");
    return;
  }
  const tagIdList = [];
  addTagSet.value.forEach(id => {
    tagIdList.push(id);
  });
  const tag = JSON.stringify(tagIdList);
  // 此时可以自行将文件上传至服务器
  let param = new FormData();
  param.append("file", filePost.value);

  myAxios.post("/post/addPost", {
    file: filePost.value,
    content: message.value,
    tagId: tag,
  }).then(resp => {
    if (resp.code === 200) {
      router.push({
        path: '/index'
      })
      showSuccessToast("修改成功");
    } else {
      if (resp.description) {
        showFailToast(resp.description)
      } else {
        showFailToast(resp.message)
      }
    }

  })
}
const addTag = (tagId) => {
  if (tagIdList.value.length > 0) {
    tagIdList.value = tagIdList.value.filter(tag => tag !== tagId)
    addTagSet.value.add(tagId);
  }

}
const closeTag = (tagId) => {
  const set = new Set();
  addTagSet.value.forEach(tag => {
    if (tag !== tagId) {
      set.add(tagId);
    }
  })
  addTagSet.value = set;
  tagIdList.value.push(tagId);
}
const iconButton = () => {
  isIcon.value = !isIcon.value;
}
</script>

<style scoped>
.icon {
  margin: 13px
}

.icon-is {
  font-size: 23px;
  margin-right: 14px
}
</style>