<template>
  <van-nav-bar
      :title="route.name"
      left-text="返回"
      left-arrow
      right-text="发表"
      @click-left="onClickLeft"
      @click-right="onSubmit"

  >

  </van-nav-bar>
  <div id="addPost">
    <div class="post_message">
      <tinymce :value="message" :height="height" @get-content="changeContent"></tinymce>
      <div class="post_add_tag">
        <div class="post_add_tag_content">
          <van-space wrap>
            <div v-for="(tag, index) in tagList" :key="index">
              <van-tag :show="show" class="ipbut" closeable size="large" type="primary" @close="removeTag(tag)">
                {{ tag }}
              </van-tag>
            </div>
            <div class="group">
              <button @click="onBut" :style="isBut?'display: none':''" class="ip ipbut"><span
                  class="ipWtTxt">添加标签</span>
              </button>
            </div>
            <van-popover v-model:show="isBut" :actions="actions" placement="top" @select="onSelect">
              <template #reference>
                <input :style="isBut?'':'display: none'" v-model="inputTag" @blur="isBlur" id="inputTag"
                       class="inputTag ipWt" @keyup.enter="addTag()">
              </template>
            </van-popover>
          </van-space>
        </div>

      </div>

    </div>

  </div>


</template>

<script setup lang="ts">
import {nextTick, ref} from "vue";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useRoute} from "vue-router";
import {showToast} from 'vant';
import bq from '../../../assets/bq.svg'
import Tinymce from "@/components/Tinymce/tinymce.vue";
import tagRequest from "@/plugins/request/tagRequest";
import postRequest from "@/plugins/request/postRequest";

const message = ref('')
const filePost = ref<Blob>();
const router = useRouter()
const route = useRoute()
const height = ref(600) //富文本高度
const tid = ref<number>(Number(route.query.tid ?? 0))
const tagList = ref<Set<string>>(new Set());
const actions = ref<any[]>([]);
const inputTag = ref('');
const isBut = ref(false);

const changeContent = (event: string) => {
//event就是富文本内容
  message.value = event
}
const isBlur = () => {
  pushTagList(inputTag.value);
  inputTag.value = '';
  isBut.value = false;
}
const onBut = () => {
  isBut.value = !isBut.value;
  nextTick(() => {
    const searchCard = document.getElementById("inputTag");
    if (searchCard) {
      searchCard.focus();
    }
  })
}
const onSelect = (action: any) => {
  pushTagList(action.text);
}
const addTag = () => {
  pushTagList(inputTag.value);
  inputTag.value = '';
}
const pushTagList = (tag: string) => {
  if (tag === '') {
    showToast({message: '请输入标签', position: 'top'});
    return;
  }
  if (tag.length > 5) {
    showToast({message: '标签过多', position: 'top'});
    return;
  }
  if (inputTag.value.length > 8) {
    showToast({message: '标签内容过长', position: 'top'});
    return;
  }
  if (tagList.value.has(tag)) {
    showToast({message: '标签重复', position: 'top'});
    return;
  }
  tagList.value.add(tag);
}
const removeTag = (tag: string) => {
  tagList.value.delete(tag)
}
const show = ref(true);
const id = route.query.group + ""

const doUpload = async (formData: any) => {

}
const onClickLeft = () => {
  router.back();
}
const uploadFun = (file: Blob) => {
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


onMounted(async () => {
  let response;
  if (tid.value === 0) {
    response = await tagRequest.getTag(0, null);
  } else {
    response = await tagRequest.getTag(2, tid.value);
  }
  if (response && response.code === 200 && response.data) {
    for (let tag of response.data) {
      const data = {
        text: tag,
      }
      actions.value.push(data)
    }
  }
})


// 提交
const onSubmit = async () => {
  if (message.value.length <= 0) {
    showToast({message: '请输入内容', position: 'top'});
    return;
  }
  let tags = '';
  if (tagList.value.size > 0) {
    const tagL = tagList.value;
    tags = JSON.stringify([...tagL]);
  }
  // 此时可以自行将文件上传至服务器
  let param = new FormData();
  if (filePost.value) {
    param.append("file", filePost.value);
  }
  const response = await postRequest.addPost(param, message.value, tags, tid.value);
  if (response.code === 200) {
    showToast({message: '发布成功', position: 'top'});
    await router.push({
      path: '/index'
    })
  }
}


const editorConfig = {
  placeholder: '点击此处说点什么....'
}

</script>
<style scoped src="./styles.css">

</style>
