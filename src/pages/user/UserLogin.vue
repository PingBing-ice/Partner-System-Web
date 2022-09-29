<template>
  <div class="parent">
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
              :class="{'apply-shake':userNameClass}"
          />
          <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :class="{'apply-shake':userPasswordClass}"
          />
        </van-cell-group>
        <van-cell-group inset>
          <van-field
              v-model="sms"
              center
              clearable
              label="验证码"
              placeholder="请输入验证码"
              :class="{'apply-shake':codeClass}"
          >
            <template #button>
              <image-code :change="data.change_img_code" @click="changeImageCode" @getCode="backImageCode"></image-code>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round :loading="buttonLoading" :disabled="buttonLoading"  loading-text="登录中..." block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
        <span style="color: #1989fa; font-size: 5px; margin-left: 69%;" @click="RegisterUser">注册账号</span>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {Toast} from "vant";
import webSocketConfig from "../../config/webSocketConfig";
import {setChatUserState} from "../../states/user";

import md5 from "md5";
import ImageCode from "../../components/imageCode.vue";
const router = useRouter()
const userNameClass = ref(false);
const userPasswordClass = ref(false);
const codeClass = ref(false);
const buttonLoading = ref(false);
const userAccount = ref('');
const password = ref('');

// 验证码
const resCode = ref('')
const sms = ref('')
const data = reactive({
  change_img_code: false, // 刷新验证码
  img_code: '',// 加密后的验证码值
})

// 刷新验证码操作
const changeImageCode = () => {
  data.change_img_code = !data.change_img_code
  sms.value = resCode.value
}

// 接收组件返回加密后的验证码值
const backImageCode = (code) => {
  data.img_code = code
  resCode.value = data.img_code
  sms.value = data.img_code;
}
// 登录按钮

const onSubmit = async () => {
  if (userAccount.value === '') {
    userNameClass.value = true;
    setTimeout(()=>{
      userNameClass.value = false;
    },820)

  }
  if (password.value === '') {
    userPasswordClass.value = true;
    setTimeout(()=>{
      userPasswordClass.value = false;
    },820)
  }
  if (sms.value === ''|| resCode.value !== sms.value) {
    codeClass.value = true;
    setTimeout(()=>{
      codeClass.value = false;
    },820)
  }
  if (userAccount.value === '' || password.value === ''|| sms.value === ''|| resCode.value !== sms.value) {
    return;
  }
  buttonLoading.value = true;
  const res = await myAxios.post("/api/user/Login", {
    userAccount: userAccount.value,
    password: password.value,
  });
  if (res.code === 200 && res.data) {
    buttonLoading.value = false;
    setChatUserState(res.data)
    await webSocketConfig.initSocket();
    Toast.success("登录成功");
    await router.push({path: '/index'})
  } else {
    buttonLoading.value = false;
    if (res.description) {
      Toast.fail(res.description)
    } else {
      Toast.fail("登录失败,请重试!");
    }

  }

}
const RegisterUser = () => {
  router.push({
    path: '/register'
  })
}

</script>

<style scoped>
div.parent {
  position: relative;
}

.div-in-center {
  margin-top: 10%;
}

.title {
  margin-top: 40%;
}

.one {
  letter-spacing: 5px;
  color: #496e7f;
}
/* Standard syntax */
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.apply-shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
