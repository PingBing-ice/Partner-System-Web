<template>
  <div id="addPost">
    <div v-if="route.path==='/addPost'">
      <div id="aaa">
        <ckeditor :editor="editor" v-model="message" :config="editorConfig"></ckeditor>
      </div>
    </div>

    <div class="addTag">
      标签 :
      <van-popover v-model:show="showPopover" placement="top" style="top: 103px;height: 28vh" :actions="actions" @select="addTag">
        <template #reference>
          <van-button type="primary">浅色风格</van-button>
        </template>
      </van-popover>
    </div>
    <div class="adduserF">
      <button class="addUser" @click="onSubmit">提交</button>

    </div>
  </div>

</template>
<script setup>
import {ref, watch} from "vue";
import {onMounted} from "vue";
import myAxios from "../../config/myAxios";
import {showSuccessToast, showFailToast} from 'vant';
import {useRouter} from "vue-router";
import {useRoute} from "vue-router";
import {showToast} from 'vant';

const quillRef = ref();
const message = ref('')
const filePost = ref();
const actions = ref([]);
const addTagSet = ref(new Set());
const router = useRouter()
const route = useRoute()
const tagMap = ref(new Map());
const isIcon = ref(false);
const showPopover = ref(false);
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


onMounted(async () => {
  // 获取标签
  const resp =await myAxios.get("/api/userLabel/getLabel")
  console.log(resp)
  if (resp.code === 200 && resp.data) {

    tagMap.value = new Map(Object.entries(resp.data))
    for (let key of tagMap.value.keys()) {
      let a={
        text: tagMap.value.get(key)
      }
      actions.value.push(a)
    }
  }


})


// 提交
const onSubmit = () => {

  // return;
  if (message.value.length <= 0) {
    showToast({message: '请输入内容', position: 'top'});
    return;
  }
  let tagIdList = [];
  addTagSet.value.forEach(id => {
    tagIdList.push(id);
  });
  if (tagIdList.length <= 0) {
    tagIdList = "";
  }else {
    tagIdList= JSON.stringify(tagIdList)
  }

  // 此时可以自行将文件上传至服务器
  let param = new FormData();
  param.append("file", filePost.value);
  myAxios.post("/post/addPost", {
    file: param,
    content: message.value,
    tagId: tagIdList,
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


import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ClassicEditor

const editorConfig = {}

</script>
<style scoped>
.van-popover__wrapper {
  width: 100%;
}

.van-field__control {
  width: 0;
}

.van-field__control:read-only {
  width: 0;
}

.addTag {
  font-size: 13px;
  height: 30px;
  padding: 10px;
}
:root .van-popover[data-popper-placement=top]{
  top: 103px;
}
</style>
