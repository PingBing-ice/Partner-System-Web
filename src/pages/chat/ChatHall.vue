<template>
  <van-nav-bar :title="route.name">
    <template #right>
      <van-icon name="search" size="18" @click="toSearch"/>
    </template>
    <template #left v-if="store.getters.getIsLogin">
      <img @click="toUser" :src="user?.avatarUrl" alt="" class="avatar">
    </template>
  </van-nav-bar>
  {{mess}}



  <MsgInput @input="setValue" @but="click"/>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import store from "../../store";

const router = useRouter();
const route = useRoute();
const user = ref(store.getters.getUser);
const mess = ref("");
import {showToast} from "vant";
import MsgInput from "../../components/MsgInput.vue";

const height = ref(24);

onMounted(() => {
  if (!store.getters.getIsLogin) {
    showToast({message: '未登录', position: 'top'});
    router.push({
      path: '/index',
    });

  }

})
const setValue = (value) => {
  mess.value=value
}

const click = () => {
  alert("sadasd")
}
const toSearch = () => {
  router.push({path: '/search'})
}
const toUser = () => {
  router.push({path: '/user'})
}

</script>

<style scoped>


</style>