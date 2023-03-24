<template>
  <BasicLayout v-if="isRouterActive"/>
</template>
<script lang="ts" setup>
import BasicLayout from "./layouts/BasicLayout.vue";
import {ref, provide, nextTick} from 'vue'

const isRouterActive = ref(true)
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

ol {
  padding-left: 5px;
}

ul {
  padding-left: 5px;

}

ul li {
  list-style-type: disc;
  list-style-position: inside;
}

ol li {
  list-style-type: decimal;
  list-style-position: inside;
}
</style>
