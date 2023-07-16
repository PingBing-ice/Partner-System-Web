<template>

  <div class="post-tabs">
    <div class="post-tab" v-for="(tag,index) in props.tagList">
      <input type="radio" name="tabs" :id="index" @click="is(tag)"  :checked="index === 0">
      <label class="post-tab-txt" :for="index">
        {{ tag }}
      </label>
    </div>
  </div>

</template>

<script setup lang="ts">
const props =defineProps({
  tagList: {
    type: Array,
    required: true,
  }
})
const emits = defineEmits(['tag'])
const is = (value: string) => {
  emits('tag', value)
}


</script>

<style lang="scss" src="./styles.scss" scoped>

</style>