<template>
  <div id="Login">
    <div class="loginIcon">
      <van-icon name="arrow-left" @click="toPath"/>
    </div>
    <div class="lg">
      <div class="loginTitle">
        <div class="title">
          <van-image
              round
              width="4rem"
              height="4rem"
              :src="image"
          />
          <h2 style="color: #7dc5eb">汇星园</h2>
        </div>
      </div>
      <div class="loginContent">
        <div class="username input_con" :class="{'apply-shake':userNameClass}">
          <input class="loginInput" id="loginusername" placeholder="请输入账号" type="text" v-model="userAccount">
          <div class="icon_input" @click="del">
            <div class="icon_close" :style="userAccount===''||!isUsername_icon?'display: none':''"></div>
          </div>
        </div>
        <div class="password input_con" :class="{'apply-shake':userPasswordClass}">
          <input class="loginInput" placeholder="请输入密码" v-model="password" :type="isPassword_icon?'password':'text'">
          <div class="icon_input" @click="isPassword_icon=!isPassword_icon">
            <div :class="isPassword_icon?'icon_noeyes':'icon_eyes'"></div>
          </div>
        </div>
        <div class="code" :class="{'apply-shake':codeClass}">
          <input class="loginCode" v-model="codeImage" placeholder="请输入验证码" type="text">
          <div class="codeImage" @click="getCode">
            <img :src="codeUrl" alt="验证码">
          </div>
        </div>
        <div style="width: 100%">
          <label class="remember">
            <input checked="checked" type="checkbox" v-model="remember">
            <div class="checkmark"></div>
            <div class="box_txt">
              记住密码
            </div>
          </label>

        </div>

        <div class="login_but">

          <button class="login_but_an" @click="onSubmit">登录</button>
        </div>
      </div>
    </div>
    <div class="lower">
      <div class="xb">
        <div class="icon_is" @click="RegisterUser">
          <div class="zc qt">
            <div class="zc_icon"></div>
          </div>
          <div class="icon_txt">
            注册
          </div>
        </div>
        <div class="icon_is" @click="qqLogin">
          <div class="qq qt">
            <div class="qq_icon">
            </div>
          </div>
          <div class="icon_txt">
            QQ登录
          </div>
        </div>
        <div class="icon_is" @click="ForgetUser">
          <div class="wj qt">
            <div class="wj_icon">

            </div>
          </div>
          <div class="icon_txt">
            忘记密码
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref,} from 'vue';
import {useRoute, useRouter} from "vue-router";
import store from "../../../store";
import imageRequest from "../../../plugins/request/imageRequest";
import image from "../../../../src/assets/xq.png"
import {Base64} from 'js-base64'
import {setToken} from "@/util/cookie";
import userRequest from "../../../plugins/request/userRequest";
import wsIns from '../../../util/socket/websocket'
const router = useRouter()
const route = useRoute()
const userNameClass = ref(false);
const userPasswordClass = ref(false);
const codeClass = ref(false);
const buttonLoading = ref(true);
const userAccount = ref('');
const password = ref('');
const codeUrl = ref('');
const uuid = ref('');
const remember = ref(true);
// 验证码
const codeImage = ref('')
onMounted(async () => {
  const loginusername = document.getElementById('loginusername');
  if (loginusername) {
    loginusername.addEventListener('focus', nameFocus);
    loginusername.addEventListener('blur', nameBlur);
  }
  const name = localStorage.getItem("username");
  const pass = localStorage.getItem("password");

  if (name && pass) {
    try {
      userAccount.value = Base64.decode(name);
      password.value = Base64.decode(pass);
    } catch (e) {

    }

  }
  await getCode();
})

const nameFocus = () => {
  isUsername_icon.value = true
}
const nameBlur = () => {
  isUsername_icon.value = false
}

const isPassword_icon = ref(true)
const isUsername_icon = ref(false)
const del = () => {
  userAccount.value = '';
}
// 刷新验证码操作
const getCode = async () => {
  const resp = await imageRequest.getImageCode();
  if (resp.code === 200 && resp.data) {
    const codeData = resp.data
    uuid.value = codeData.uuid
    codeUrl.value = codeData.img
    if (codeData.code) {
      codeImage.value = codeData.code;
    }
  }
}


// 登录按钮
const onSubmit = async () => {
  if (buttonLoading.value) {
    buttonLoading.value = false;
    await login()
    buttonLoading.value = true;
  }

}
const login = async () => {
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
  if (codeImage.value === '') {
    codeClass.value = true;
    setTimeout(() => {
      codeClass.value = false;
    }, 820)
  }
  if (userAccount.value === '' || password.value === '' || codeImage.value === '') {
    return;
  }

  const res = await userRequest.Login(userAccount.value, password.value, uuid.value, codeImage.value)
  if (res.code === 200 && res.data) {
    setToken(res.data)
    wsIns.auth(res.data);
    const resp = await userRequest.getCurrentUser();
    if (resp.code === 200 && resp.data) {
      await store.dispatch('setUser', resp.data);
      if (remember.value) {
        const name = Base64.encode(userAccount.value);
        const pass = Base64.encode(password.value);
        localStorage.setItem("username", name);
        localStorage.setItem("password", pass);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
      const redirect = route.query?.redirect ?? '/index';
      await router.replace({path: redirect as string})
    }
  } else {
    await getCode();
    codeImage.value = '';
    codeClass.value = true;
    setTimeout(() => {
      codeClass.value = false;
    }, 820);
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

const toPath = () => {
  router.push({
    path: '/index',
  })

}

const qqLogin = async () => {
   const resp = await userRequest.qqLogin();
  if (resp.code === 200) {
    window.location.href = resp.data;
  }
}
</script>

<style scoped>


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

/* Hide the default checkbox */
.remember input {
  display: none;
}

.remember {
  align-items: center;
  display: flex;
  float: right;
  margin-right: 29px;
  margin-top: 10px;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Create a custom checkbox */
.checkmark {
  position: relative;
  top: 0;
  left: 0;
  height: 1.3em;
  width: 1.3em;
  background-color: #2196F300;
  border-radius: 0.25em;
  transition: all 0.25s;
}

/* When the checkbox is checked, add a blue background */
.remember input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  transform: rotate(0deg);
  border: 0.1em solid black;
  left: 0;
  top: 0;
  width: 1.05em;
  height: 1.05em;
  border-radius: 0.25em;
  transition: all 0.25s, border-width 0.1s;
}

/* Show the checkmark when checked */
.remember input:checked ~ .checkmark:after {
  left: 0.45em;
  top: 0.25em;
  width: 0.25em;
  height: 0.5em;
  border-color: #fff0 white white #fff0;
  border-width: 0 0.15em 0.15em 0;
  border-radius: 0;
  transform: rotate(45deg);
}


</style>
