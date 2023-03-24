<template>
  <div v-if="route.path==='/addPost'" >
    <vue-quill-text-editor ref="quillRef" :placeholder="'点击此处说点什么....\n注意: 违规词会被屏蔽'" :uploadFun="uploadFun" />
  </div>
  <van-cell-group inset>
    <van-field  placeholder="请输入填写标签" @focus="iconButton" readonly label="标签"  @blur="iconBlur">
      <template #button>
        <div style="display: flex">
          <div v-for="tagId in addTagSet">
            <van-tag plain type="primary" closeable @close="closeTag(tagId)" style="margin-right: 2px;"
                     size="medium">
              {{ tagMap.get(tagId) }}
            </van-tag>
          </div>
        </div>
      </template>
    </van-field>
    <div class="van-hairline--top" v-if="isIcon">
      <van-row justify="space-around">
        <van-col span="6" v-for="tag in tagIdList">
          <van-tag plain type="primary" @click="addTag(tag);" size="medium">{{ tagMap.get(tag) }}</van-tag>
        </van-col>
      </van-row>
    </div>
  </van-cell-group>

  <van-button type="default" block round @click="onSubmit">提交</van-button>
</template>
<script setup>
import {ref, watch} from "vue";
import {onMounted} from "vue";
import myAxios from "../../plugins/myAxios";
import {showSuccessToast, showFailToast} from 'vant';
import {useRouter} from "vue-router";
import {useRoute} from "vue-router";
import {showToast} from 'vant';
const quillRef = ref();
const message = ref('')
const filePost = ref();
const tagIdList = ref([]);
const addTagSet = ref(new Set());
const router = useRouter()
const route = useRoute()
const tagMap = ref();
const isIcon = ref(false);
watch(quillRef, async (val) => {
  const quillInstance = val.quillInstance;
  quillInstance.on('text-change', () => {
    // get html content
    message.value = quillInstance.container.firstChild.innerHTML;
  });
  // set html content
})


const doUpload = async (formData) => {

}

const uploadFun = (file) => {

  try {
    const oMyForm = new FormData();
    oMyForm.append('file', file);
    return new Promise(async (resolve, reject) => {
      // do some validation
      resolve(await doUpload(oMyForm));
    });
  } catch (e) {
    console.error(e);
  }
};


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
      showSuccessToast("添加成功");
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
  addTagSet.value.delete(tagId);
  tagIdList.value.push(tagId);
}
const iconButton = () => {
  isIcon.value = !isIcon.value;
}
const iconBlur = () =>{

};
</script>
<style scoped>
.van-popover__wrapper{
  width: 100%;
}
</style>
<!--<template>-->
<!--<van-form @submit="onSubmit">-->
<!--<van-cell-group inset>-->
<!--  <van-field-->
<!--      v-model="message"-->
<!--      rows="8"-->
<!--      autosize-->
<!--      type="textarea"-->
<!--      maxlength="1000"-->
<!--      placeholder="点击此处说点什么"-->
<!--      show-word-limit-->
<!--  >-->
<!--    <template #button v-if="addTagSet.size>0">-->

<!--    </template>-->
<!--  </van-field>-->


<!--</van-cell-group>-->
<!--<div style="margin: 16px;">-->
<!--  <van-button round block type="primary" native-type="submit">-->
<!--    提交-->
<!--  </van-button>-->
<!--</div>-->
<!--</van-form>-->


<!--</template>-->

<!--<script setup>-->

<!--</script>-->

<!--<style scoped>-->
<!--.icon {-->
<!--  margin: 13px-->
<!--}-->

<!--.icon-is {-->
<!--  font-size: 23px;-->
<!--  margin-right: 14px-->
<!--}-->
<!--</style>-->