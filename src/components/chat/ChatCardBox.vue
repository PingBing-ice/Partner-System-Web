<template>
  <div id="chat">
    <div class="chatBox">
      <div class="chatInfo" id="chatInfo" ref="main">
        <div style="padding: 0 5px 0 5px">
          <transition-group name="list">
            <div class="chatUser-box"  v-for="(item,index) in props.chatList" :key="index"
                 :class="props.userId===item.userId?'chatUser-box1':'chatUser-box'">
              <div class="chatUser-box-img">
                <img  class="chat-av" :class="{ is__error: isOnloadError }"
                           :src="item.images" alt=""
                      @error.once="errorEvent"/>
              </div>
              <div class="chatUser-info" ref="chatRoom">
                <div class="chatUser-info-name" :class="props.userId===item.userId?'chatUser-info-name1':'chatUser-info-name'">
                  <span>{{ item.name }}</span><span class="nowDate">{{ item.time }}</span>
                </div>
                <div class="chatUser-info-text" :class="props.userId===item.userId?'chatUser-info-text1':'chatUser-info-text'">
                  <span>{{ item.message }}</span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  chatList: {
    type: [],
    required: true,
  },
  userId:{
    type: String,
    required: true,
  }
});
const isOnloadError =ref<boolean>(false);
const errorEvent = () => {
  isOnloadError.value = true
}
</script>

<style scoped lang="css" src="./styles.css">


</style>