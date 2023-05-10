<template>
  <EmptyLayout v-if="isRouterActive"/>
</template>
<script lang="ts" setup>
import {ref, provide, nextTick} from 'vue'
import EmptyLayout from "./layouts/EmptyLayout.vue";

const isRouterActive = ref(true)
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>
<style>



</style>
