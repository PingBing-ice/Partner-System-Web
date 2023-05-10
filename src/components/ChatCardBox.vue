<template>
  <div id="chat">
    <div class="chatBox">
      <div class="chatInfo" id="chatInfo" ref="main">
        <div style="padding: 0 5px 0 5px">
          <div class="chatUser-box"  v-for="(item,index) in props.chatList" :key="index"
               :class="props.userId===item.id?'chatUser-box1':'chatUser-box'">
            <div class="chatUser-box-img">
              <van-image round width="2.5rem" height="2.5rem"
                         :src="item.images"/>
            </div>
            <div class="chatUser-info" ref="chatRoom">
              <div class="chatUser-info-name" :class="props.userId===item.id?'chatUser-info-name1':'chatUser-info-name'">
                <span>{{ item.name }}</span><span class="nowDate">{{ item.time }}</span>
              </div>
              <div class="chatUser-info-text" :class="props.userId===item.id?'chatUser-info-text1':'chatUser-info-text'">
                <span>{{ item.message }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

</template>

<script setup>


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
</script>

<style scoped>
body {
  background-color: #E8E8E8;
}


</style>