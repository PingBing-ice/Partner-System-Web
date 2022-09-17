<template>
  <div class="title">
    <h1 class="one">
      用户登录
    </h1>
  </div>
  <div class="div-in-center">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
      <span style="color: #1989fa; font-size: 5px; margin-left: 69%;" @click="RegisterUser">注册账号</span>
    </van-form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {Toast} from "vant";
import webSocketConfig from "../../config/webSocketConfig";
import {setCurrentUserState} from "../../states/user";

const router = useRouter()

const userAccount = ref('');
const password = ref('');
const onSubmit = async () => {
  const res = await myAxios.post("/api/user/Login", {
    userAccount: userAccount.value,
    password: password.value,
  })
  if (res.code === 200 && res.data) {
    setCurrentUserState(res.data)
   await webSocketConfig.initSocket();
    Toast.success("登录成功");
    await router.push({path : 'index'})
  }else {
    Toast.fail("登录失败,请重试!");
  }

}
const RegisterUser = () => {
    router.push({
      path: '/register'
    })
}

</script>

<style scoped>
.div-in-center {
  margin-top: 10%;
}
.title{
  margin-top: 40%;
}
.one{
  letter-spacing: 5px;
  color: #496e7f;
}
</style>
