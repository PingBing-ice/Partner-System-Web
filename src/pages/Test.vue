<template>
  <div id="Login">
    <InputCard v-model="username" :type="'password'" @value="userName"/>
    <InputCard v-model="password" :type="'text'" @value="pass"/>

<!--    <InputCard v-model="value"/>-->
    <div>
      {{username}}
      {{password}}
    </div>
    <button @click="sss">asdasd</button>
  </div>

</template>
<script  setup>
import {ref} from "vue";
import InputCard from "../components/InputCard.vue";

const username = ref('');
const password = ref('');
const userName = (e) => {
  username.value = e;
}
const pass = (e) => {
  password.value = e;
}
const sss = () => {
  alert(username.value)
  alert(password.value)
}
</script>

<style scoped>
#Login {
  overflow: hidden;
  height: 200vh;
  width: 100%;
  background-image: linear-gradient(to left,#fbf7f8, #f5f9fc);
}


</style>