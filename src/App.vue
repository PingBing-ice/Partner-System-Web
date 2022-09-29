<template>
  <BasicLayout v-if="isRouterActive"/>
</template>
<script lang="ts" setup>
import BasicLayout from "./layouts/BasicLayout.vue";
import { ref, provide, nextTick } from 'vue'
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
</style>
