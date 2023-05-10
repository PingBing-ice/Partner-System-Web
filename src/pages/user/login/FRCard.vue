<template>
  <div id="Login">
    <div class="loginIcon">
      <van-icon name="arrow-left" @click="toPath"/>
    </div>
    <div class="lg" style="top: 6%">
      <div class="loginContent">
        <h2>{{ route.path==='/forget'?'忘记密码': '注册账号' }}</h2>
        <InputCard v-model="userAccount" @value="getAccount" :class="{'apply-shake':userAccountClass}"/>
        <InputCard v-model="password" @value="getPassword" :type="'password'" :class="{'apply-shake':passwordClass}"/>
        <InputCard v-model="checkPassword" @value="getCheck" :placeholder="'确认密码'" :type="'password'" :class="{'apply-shake':checkPasswordClass}"/>
        <InputCard v-model="email" @value="getEmail" :placeholder="'请输入邮箱'" :class="{'apply-shake':emailClass}"/>
        <div class="code" style="margin-top: 20px" :class="{'apply-shake':codeClass}">
          <input class="loginCode" v-model="code" placeholder="请输入验证码" type="text" >
          <van-button size="small" v-if="isTime===false" @click="sendEmail" :loading="subValue"
                      loading-text="发送中..." color="rgb(123 201 249 / 77%)">发送验证码
          </van-button>
          <div style="width: 76px;display: flex;justify-content: center;align-items: center" v-if="isTime===true">
            <van-count-down v-if="isTime===true" :time="time" format="ss" @finish="isTime = false"/>
          </div>
        </div>
        <div class="login_but">
          <button class="login_but_an" @click="onSubmit">{{  route.path==='/forget'?'修改': '注册' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../../../config/myAxios";
import {showSuccessToast, showFailToast, showToast} from 'vant';
import InputCard from "../../../components/InputCard.vue";


const userAccountClass = ref(false);
const passwordClass = ref(false);
const checkPasswordClass = ref(false);
const emailClass = ref(false);
const codeClass = ref(false);
const buttonLoading = ref(false);
const subValue = ref(false);
// 倒计时
const time = ref(60 * 1000);
const isTime = ref(false);


const router = useRouter();
const route = useRoute();
const userAccount = ref('');
const code = ref('');
const password = ref('');
const email = ref('');
const checkPassword = ref('');


const onSubmit = async () => {
  tx();
  if (!email.value || email.value === '') {
    emailClass.value = true;
    setTimeout(() => {
      emailClass.value = false;
    }, 820)
  }
  if (!code.value || code.value === '') {
    codeClass.value = true;
    setTimeout(() => {
      codeClass.value = false;
    }, 820)
  }
  if (!userAccount.value || userAccount.value === '' || !password.value || password.value === '' || !checkPassword.value
      || checkPassword.value === ''
      || !email.value || email.value === '' || !code.value || code.value === '') {
    return;
  }
  buttonLoading.value = true;
  if (route.path === '/forget') {
    await forget()
  }else {
    await register();
  }

}
const forget = async () => {
  const res = await myAxios.post('/api/user/forget', {
    userAccount: userAccount.value,
    password: password.value,
    checkPassword: checkPassword.value,
    email: email.value,
    code: code.value
  });
  if (res.code === 200) {
    buttonLoading.value = false;
    showToast({
      message: '修改成功',
      position: 'top',
    });
    await router.push({path: '/login'})
  } else {
    buttonLoading.value = false;
    if (res.description) {
      showFailToast(res.description)
    }
  }
}
const register =async () => {
  const res = await myAxios.post('/api/user/Register', {
    userAccount: userAccount.value,
    password: password.value,
    checkPassword: checkPassword.value,
    email: email.value,
    code: code.value
  });
  if (res.code === 200) {
    buttonLoading.value = false;
    showToast({
      message: '注册成功',
      position: 'top',
    });
    await router.push({path: '/'})
  } else {
    buttonLoading.value = false;
    if (res.description) {
      showFailToast(res.description)
    }
  }
}
const tx = () => {
  if (!userAccount.value || userAccount.value === '') {
    userAccountClass.value = true;
    setTimeout(() => {
      userAccountClass.value = false;
    }, 820)
  }
  if (!password.value || password.value === '') {
    passwordClass.value = true;
    setTimeout(() => {
      passwordClass.value = false;
    }, 820)
  }
  if (!checkPassword.value || checkPassword.value === '') {
    checkPasswordClass.value = true;
    setTimeout(() => {
      checkPasswordClass.value = false;
    }, 820)
  }


}
const sendEmail = async () => {

  tx();
  if (!email.value || email.value === '') {
    emailClass.value = true;
    setTimeout(() => {
      emailClass.value = false;
    }, 820)
  } else {
    const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, str = email.value;
    if (!pattern.test(str)) {
      showToast({
        message: '邮箱格式错误',
        position: 'top',
      });
      return;
    }
  }
  if (!userAccount.value || userAccount.value === '' || !password.value || password.value === '' || !checkPassword.value
      || checkPassword.value === ''
      || !email.value || email.value === '') {
    return;
  }
  subValue.value = true;
  const response = await myAxios.post('/oss/send', {
    email: email.value
  });
  if (response.code === 200) {
    subValue.value = false;
    isTime.value = true;
    showSuccessToast("发送成功，请注意查收");
  }
  subValue.value = false;
}
const getAccount = (e) => {
  userAccount.value = e;
}
const getPassword = (e) => {
  password.value = e;
}
const getCheck = (e) => {
  checkPassword.value = e
}
const getEmail = (e) => {
  email.value = e;
}
const toPath = () => {
  router.push({
    path: '/login'
  })
}
</script>

<style scoped>
.content {
  margin-top: 10%;
}

.submit {
  margin: 16px;
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

.parent {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -270px;
  margin-left: -188px;
}

</style>
