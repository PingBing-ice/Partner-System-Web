<template>
  <van-list>
    <van-cell v-for="item in list" :key="item" :title="item" />
  </van-list>
  <button @click="test">asd</button>
</template>

<script setup >
defineProps({
  list: {
    type: [],
    required: true,
  },
});
const emits = defineEmits(['update:value'])

const test = () => {
  emits("update:value","你好")
}

</script>

<style scoped>

</style>