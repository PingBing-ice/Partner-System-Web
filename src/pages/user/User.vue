<template>
  <div id="user" v-if="user">
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
    <div class="cell">
      <van-cell :title="userName.username" is-link :value="user?.username"
                @click="toEdit('username',userName.username,user?.username)"/>
    </div>
    <div class="cell" style="padding: 0">
      <van-cell :title="userName.userAccount" :value="user?.userAccount"/>
    </div>
    <div class="cell">
      <van-cell :title="userName.gender" is-link :value="user?.gender"
                @click="toEdit('gender',userName.gender,user?.gender)"/>
    </div>
    <div class="cell" style="padding: 0">
      <van-cell title="标签" @click="toTag" is-link :value="!user.tags?'请设置标签':''">
        <template #right-icon v-if="user.tags">
          <van-tag plain v-for="tag in user?.tags" type="primary" size="large">{{ tag }}</van-tag>
        </template>
      </van-cell>
    </div>


    <div class="cell">
      <van-cell :title="userName.tel" is-link :value="user?.tel" @click="toEdit('tel',userName.tel,user?.tel)"
      />
    </div>
    <div class="cell" style="padding: 0">
      <van-cell :title="userName.email" is-link :value="user?.email" @click="toEdit('email',userName.email,user?.email)"
      />
    </div>
    <div class="cell" style="padding: 0">
      <van-cell :title="userName.description" is-link :value="user?.profile"
                @click="toEdit('profile',userName.description,user?.profile)"/>
    </div>
    <div class="cell">
      <van-cell :title="userName.status" is-link :value="user?.status"
                @click="toEdit('status',userName.status,user?.status)"/>
    </div>
    <div class="cell">
      <van-cell :title="userName.planetCode" :value="user?.planetCode"/>
    </div>
    <div class="cell" style="padding: 0">
      <van-cell :title="userName.createTime" :value="user?.createTime"/>
    </div>
    <div class="cell" style="padding-bottom: 20px;box-shadow: none;">
      <van-button type="primary" style="background: #fff;color: #ee0a24;border: 1px solid #ee0a24" round @click="edit"
                  :loading="editState" loading-text="注销中..." size="large">退出登录
      </van-button>
    </div>

  </div>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showConfirmDialog, showToast} from 'vant';
import store from "../../store";
import userRequest from "@/plugins/request/userRequest";
import {upload} from "@/plugins/request/ossRequest";


const editState = ref(false);
const show = ref(false);
const tagShow = ref(true);
// '王者荣耀','吃鸡','火影','英雄联盟','大一','大二'
const tagIdList = ref<any[]>([])
const tagList = ref<any[]>([])
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
  // const response = await tagRequest.getUserTag();
  // if (response.code === 200 && response.data) {
  //   tagMap.value = new Map(Object.entries(response.data))
  //   for (let valueKey of tagMap.value.keys()) {
  //     tagIdList.value.push(valueKey)
  //   }
  // }
  const res = await userRequest.getCurrentUser()
  if (res.code === 200 && res.data) {
    const users = res.data
    await store.dispatch("setUser", users);

    if (users.tags) {
      users.tags = JSON.parse(users.tags)
      tagList.value = users.tags
    }
    if (users.createTime) {
      users.createTime = users.createTime.split('T')[0]
    }
    user.value = users;
    avatar.value = user.value.avatarUrl
  } else if (res.code === 201) {
    await router.back();
  } else {
    store.commit("loginOut");
  }
})
// 注销
const edit = async () => {
  editState.value = true;
  const logout = await userRequest.Logout();
  if (logout) {
    editState.value = false;
    await router.push({path: '/'});
  }

}
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/edit',
    query: {
      editKey,
      currentValue,
      editName,
    }
  })
}
const toTag = () => {
  router.push({
    path: '/label'
  })

}
const isTagListHasID = (tag:any, list:any[]) => {
  for (let i = 0; i < list.length; i++) {
    if (tag === list[i]) {
      return true;
    }
  }
  return false;

}
const close = (tag:any) => {
  if (tagList.value && tagList.value.length > 0) {
    tagList.value = tagList.value.filter(item => {
      return tag !== item;
    })
  }

}
const addTag = (tag:any) => {
  for (let i = 0; i < tagList.value.length; i++) {
    if (tagList.value[i] === tag) {
      return;
    }
  }
  tagList.value.push(tag)
}
const afterRead = (file:Blob) => {
  showConfirmDialog({
    title: '每天只能修改一次',
    message: '是否上传?',
  }).then(async () => {
    let param = new FormData();
    param.append("file", file)
   const res=await upload(param)
    if (res.code === 200) {
      avatar.value = res.data;
      window.location.reload();
      showToast({message: '修改成功', position: 'top'});
    }
  }).catch(() => {

  });
}


</script>

<style>
#user {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  background-color: #eff2f5;
}

.cell {
  padding-top: 10px;
  box-shadow: rgba(99, 99, 99, 0.1) 0 2px 8px 0;
}
</style>
