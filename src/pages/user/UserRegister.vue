<template>
  <div class="title">
    <h1 class="one">
      用户注册
    </h1>
  </div>
<div class="content">

  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="checkPassword"
          label="确认密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写确认密码' }]"
      />
    </van-cell-group>
    <div  class="submit">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
    </div>
    <div class="submit">
      <van-button plain round block type="primary" @click="toLogin">
        登录
      </van-button>
    </div>

  </van-form>
</div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {Toast} from "vant";

const router = useRouter();
const userAccount = ref('');
const password = ref('');
const checkPassword = ref('');
const onSubmit =async () => {
    const res = await myAxios.post('/api/user/Register',{
      userAccount: userAccount.value,
      password: password.value,
      checkPassword: checkPassword.value,
    })
  if (res.code === 200) {
    Toast.success("注册成功");
     await router.push({path: '/'})
  }
}
const toLogin = () => {
  router.push({path:'/'})
}
</script>

<style scoped>
.content{
  margin-top: 10%;
}
.submit{
  margin: 16px;
}
.title{
  margin-top: 40%;
}
.one{
  letter-spacing: 5px;
  color: #496e7f;
}
</style>
