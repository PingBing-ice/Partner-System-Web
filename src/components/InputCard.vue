<template>
  <div class="username input_con">
    <input class="loginInput" :placeholder="types==='password'
    &&props.placeholder==='请输入账号'?'请输入密码':props.placeholder" v-model="childValue" :type="types">
    <div class="icon_input" @click="pass" v-if="type==='password'">
      <div :class="isPassword_icon?'icon_noeyes':'icon_eyes'"></div>
    </div>
    <div class="icon_input" @click="del" v-else>
      <div class="icon_close" :style="childValue===''?'display: none':''"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, defineEmits} from "vue";
const isPassword_icon = ref(true)
const props=defineProps({
  value: {
    type:String,
    default: '',
  },
  type:{
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '请输入账号'
  }
})
const types=ref(props.type!=='text'&&props.type!=='password'?'text': props.type)
const childValue = ref(props.value);

const emits = defineEmits(['update:value','value'])

watch(childValue,()=>{
  emits('value',childValue.value)
})
const del = () => {
  childValue.value = '';
}
const pass = () => {
  isPassword_icon.value=!isPassword_icon.value
  if (isPassword_icon.value) {
    types.value='password'
  }else {
    types.value='text'
  }
}
</script>

<style scoped>


.username {
  margin: 20px 0 0 0;
}

.icon_eyes {
  width: 16px;
  height: 16px;
  background: url("./public/eyes.png") no-repeat 50%/cover;
}

.icon_noeyes {
  width: 16px;
  height: 16px;
  background: url("./public/noeyes.png") no-repeat 50%/cover;
}
.input_con {
  box-shadow: rgba(99, 99, 99, 0.1) 0 2px 8px 0;
  width: 85%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 61px;
  background-color: #ffffff;
}

.loginInput {
  height: 55px;
  width: 85%;
  text-align: center;
  border: none;
  font-size: 21px;
}



::placeholder {
  color: #cbcbcb;
  font-size: 15px;
}

.icon_input {
  width: 16px;
  height: 16px;
}

.icon_close {
  width: 16px;
  height: 16px;
  background: url("./public/close.png") no-repeat 50%/cover;
}


</style>