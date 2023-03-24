<template>
  <div class="parent" id="demo">
    <div class="title">
      <van-image
          round
          width="5rem"
          height="5em"
          :src="image"
      />
      <h2 class="one">
        用户登录
      </h2>
    </div>
    <div class="div-in-center">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
              v-model="userAccount"
              name="userAccount"
              label="账号"
              placeholder="账号: jane "
              :class="{'apply-shake':userNameClass}"
              @focus="validatorMessage"
              @blur="exit"
              :error-message="messageError"
          />
          <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="密码: 123456"
              :class="{'apply-shake':userPasswordClass}"
          />
        </van-cell-group>
        <van-cell-group inset style="height: 66px">
          <van-field
              style="height: 66px"
              v-model="code"
              center
              label="验证码"
              placeholder="请输入验证码"
              :class="{'apply-shake':codeClass}"
          >
            <template #button>
              <img :src="codeUrl" @click="getCode" class="login-code-img" alt="验证码"/>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round :loading="buttonLoading" :disabled="buttonLoading" loading-text="登录中..." block
                      type="primary" native-type="submit">
            登录
          </van-button>
        </div>
        <span style="color: #1989fa; font-size: 5px; " @click="ForgetUser">忘记密码</span>
        <span style="color: #1989fa; font-size: 5px;margin-left: 69%;" @click="RegisterUser">注册账号</span>
      </van-form>
    </div>
  </div>
  <span class="s">
    <span>
      <svg style="margin-bottom: -1px"   t="1679372811744" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="8372" width="12" height="12"><path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="8373"></path><path
          d="M517.6 351.3c53 0 89 33.8 93 83.4 0.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c0.1-87 37-135.5 102.2-135.5z"
          p-id="8374"></path></svg>
      2023 |
    </span>
      <a href="http://beian.miit.gov.cn/" style="color: #1890ff"> 湘ICP备2022021863号</a>

  </span>
</template>

<script setup>
import {inject, onMounted, ref,} from 'vue';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../../plugins/myAxios";
import {showSuccessToast} from 'vant';
import webSocketConfig from "../../config/webSocketConfig";
import store from "../../store";
import imageRequest from "../../plugins/request/imageRequest";
import image from "../../../public/lb.png"

const router = useRouter()
const route = useRoute()
const userNameClass = ref(false);
const userPasswordClass = ref(false);
const codeClass = ref(false);
const buttonLoading = ref(false);
const userAccount = ref('');
const password = ref('');
const messageError = ref('');
const indexUser = inject('indexUser')
const codeUrl = ref('');

const uuid = ref('');
// 验证码
const code = ref('')
onMounted(() => {
  getCode();
})

// 刷新验证码操作
const getCode = async () => {

  if (store.getters.getIsLogin) {
    return;
  }
  const resp = await imageRequest.getImageCode();
  if (resp.code === 200 && resp.data) {
    const codeData = resp.data
    uuid.value = codeData.uuid
    codeUrl.value = codeData.img
  }
}


// 登录按钮
const onSubmit = async () => {
  if (userAccount.value === '') {
    userNameClass.value = true;
    setTimeout(() => {
      userNameClass.value = false;
    }, 820)

  }
  if (password.value === '') {
    userPasswordClass.value = true;
    setTimeout(() => {
      userPasswordClass.value = false;
    }, 820)
  }
  if (code.value === '') {
    codeClass.value = true;
    setTimeout(() => {
      codeClass.value = false;
    }, 820)
  }
  if (userAccount.value === '' || password.value === '' || code.value === '') {
    return;
  }
  buttonLoading.value = true;
  try {
    const res = await myAxios.post("/api/user/Login", {
      userAccount: userAccount.value,
      password: password.value,
      uuid: uuid.value,
      code: code.value,

    });
    if (res.code === 200 && res.data) {
      buttonLoading.value = false;
      await store.dispatch('setUser', res.data)
      await webSocketConfig.initSocket();
      indexUser();
      const redirect = route.query?.redirect ?? '/index'
      await router.replace({path: redirect})
    } else if (res.description) {
      if (res.description === '验证码错误') {

        await getCode()
        code.value = '';
        codeClass.value = true;
        setTimeout(() => {
          codeClass.value = false;
        }, 820)
      } else {
        userNameClass.value = true;
        userPasswordClass.value = true;
        setTimeout(() => {
          userPasswordClass.value = false;
          userNameClass.value = false;
        }, 820)
      }
    }
    buttonLoading.value = false;

  } catch (e) {
    buttonLoading.value = false;
  }


}
const RegisterUser = () => {
  router.push({
    path: '/register'
  })
}
const ForgetUser = () => {
  router.push({
    path: '/forget'
  })
}
const validatorMessage = () => {
  if (userAccount.value === '') {
    messageError.value = '一个账号只能登录一个设备'
  }
}
const exit = () => {
  messageError.value = ''
}
</script>

<style scoped>
div.parent {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -270px;
  margin-left: -188px;
}

.div-in-center {
  margin-top: 10%;
}

.title {
}

.one {
  letter-spacing: 5px;
  color: #496e7f;
}

/* Standard syntax */
@keyframes shake {
  10%, 90% {
    transform: translate3d(-3px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(4px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-6px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(6px, 0, 0);
  }
}

.apply-shake {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
}

.szie {
  text-align: left;
  margin-left: 28px;
  font-size: 1px;
  color: red;
}

.s {
  position: fixed;
  bottom: 0;
  float: left;
  left: 29%;
  font-size: 1px
}
</style>
