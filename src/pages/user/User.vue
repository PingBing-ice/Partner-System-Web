<template>
  <template v-if="user">

    <van-cell :title="userName.avatarUrl">
      <van-uploader :after-read="afterRead">
        <van-image
            round
            width="1.8rem"
            height="1.8rem"
            :src="avatar"
        />
      </van-uploader>
    </van-cell>

    <van-cell :title="userName.username" is-link :value="user?.username"
              @click="toEdit('username',userName.username,user?.username)"/>
    <van-cell :title="userName.userAccount" :value="user?.userAccount"/>
    <van-cell :title="userName.gender" is-link :value="user?.gender"
              @click="toEdit('gender',userName.gender,user?.gender)"/>

    <van-cell title="标签" @click="toTag" is-link :value="!user.tags?'请设置标签':''">
      <template #right-icon v-if="user.tags">
        <van-tag plain v-for="tag in user?.tags" type="primary" size="large">{{ tag }}</van-tag>
      </template>
    </van-cell>
    <van-cell :title="userName.tel" is-link :value="user?.tel" @click="toEdit('tel',userName.tel,user?.tel)"/>
    <van-cell :title="userName.email" is-link :value="user?.email" @click="toEdit('email',userName.email,user?.email)"/>
    <van-cell :title="userName.description" is-link :value="user?.profile"
              @click="toEdit('profile',userName.description,user?.profile)"/>
    <van-cell :title="userName.status" is-link :value="user?.status"
              @click="toEdit('status',userName.status,user?.status)"/>
    <van-cell :title="userName.planetCode" :value="user?.planetCode"/>
    <van-cell :title="userName.createTime" :value="user?.createTime"/>
    <van-button type="primary" round @click="edit" :loading="editState" loading-text="注销中..." size="large">退出登录
    </van-button>
  </template>


</template>

<script setup>
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "../../config/myAxios";
import {removeChatUser} from "../../states/user";
import { showConfirmDialog } from 'vant';
import { showSuccessToast, showFailToast } from 'vant';
import store from "../../store";
import webSocketConfig from "../../config/webSocketConfig";
import {removeToken} from "../../util/cookie";

const reload = inject('reload')

const editState = ref(false);
const show = ref(false);
const tagShow = ref(true);
// '王者荣耀','吃鸡','火影','英雄联盟','大一','大二'
const tagIdList = ref([])
const tagList = ref([])
const tagMap = ref(new Map())
const avatar = ref("");
const router = useRouter()
const userName = {
  username: '昵称',
  userAccount: '账号',
  avatarUrl: '头像',
  gender: '性别',
  tel: '电话号码',
  email: '邮箱',
  description: '描述',
  status: '状态',
  planetCode: '编号',
  createTime: '创建时间'
}

const user = ref()
onMounted(async () => {
  const response = await myAxios.get("/api/userLabel/getLabel");
  if (response.code === 200 && response.data) {
    tagMap.value = new Map(Object.entries(response.data))
    for (let valueKey of tagMap.value.keys()) {
      tagIdList.value.push(valueKey)
    }
  }

  const res = await myAxios.get("/api/user/current");
  // @ts-ignore
  if (res.code === 200&&res.data) {
    const users = res.data
    store.commit("setUser", users);
    if (users.tags) {
      users.tags = JSON.parse(users.tags)
      tagList.value = users.tags
    }
    if (users.createTime) {
      users.createTime = users.createTime.split('T')[0]
    }
    user.value = users;
    avatar.value = user.value.avatarUrl

  }else if (res.code === 201) {
     await router.back();
  }else {
    store.commit("loginOut");

  }
})
// 注销
const edit = async () => {
  editState.value = true;
  const res = await myAxios.post("/api/user/Logout");
  // @ts-ignore
  if (res.code === 200) {
    editState.value = false;
    await store.dispatch("LoginOut")
    removeChatUser()
    removeToken()
    webSocketConfig.clearSocket();
    await router.push({path: '/'})
  }
}
const toEdit = (editKey, editName, currentValue) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      currentValue,
      editName,
    }
  })
}
const toTag = () => {
  router.push({
    path:'/label'
  })

}
const isTagListHasID = (tag, list) => {
  for (let i = 0; i < list.length; i++) {
    if (tag === list[i]) {
      return true;
    }
  }
  return false;

}
const close = (tag) => {
  if (tagList.value && tagList.value.length > 0) {
    tagList.value = tagList.value.filter(item => {
      return tag !== item;
    })
  }

}
const addTag = (tag) => {
  for (let i = 0; i < tagList.value.length; i++) {
    if (tagList.value[i] === tag) {
      return;
    }
  }
  tagList.value.push(tag)
}
const afterRead = (file) => {
  showConfirmDialog({
    title: '每天只能修改一次',
    message: '是否上传?',
  }).then(async () => {
    const File = file.file
    let param = new FormData();
    param.append("file", File)
    const res = await myAxios.post("/oss/file/upload", param);
    if (res.code === 200) {
      avatar.value = res.data;
      reload()
      showSuccessToast('修改成功...');
    } else {
      showFailToast(res.description);
    }
  }).catch(() => {

  });
}


</script>

<style>


</style>
