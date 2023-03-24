<template>
  <div id="chat">
    <div class="chatBox">
      <div class="chatInfo" id="chatInfo" ref="main">
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

#chat {
  height: calc(100vh - 200px);
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

#chat .chatBox {
  /*width: 100%;*/
  /*height: 100%;*/
  background-color: #fff;
  overflow: hidden;
  border-radius: 0.625rem;
}


#chat .chatBox-middle {
  width: 100%;
  height: 80%;
  background-color: #fff;
  /*border-bottom: 0.0625rem solid #2B3D63;*/
}


#chat .chatBox-infoDesk {
  width: 100%;
  height: 10rem;
}

#chat .chatBox-textarea {
  width: 100%;
  height: 6.25rem;
}

#chat .chatBox-sendOut {
  margin-top: 0.625rem;
  width: 100%;
  height: 3.125rem;
  text-align: right;
}

#chat .sendOut {
  padding: 0 1.25rem;
  height: 2.1875rem;
  margin: 0.3125rem 1.25rem 0 0;
}

#chat .chatInfo {
  width: 94%;
  height: 100%;
  margin: auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

#chat .chatUser-box {
  width: 100%;
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
}


#chat .chatUser-box-img {
  display: flex;
}

#chat .chatUser-info {
  margin: 0 0.6rem;
  /*距离底部0*/
  bottom: 0;
}

#chat .chatUser-info-name {
  font-size: 0.875rem;
  color: #888;
  display: flex;
  flex-direction: row;
}

#chat .nowDate {
  margin: 0 0.625rem;
}

#chat .chatUser-info-text {
  margin-top: 0.3125rem;
  max-width: 20rem;
  padding: 0.5rem;
  background-color: #E8E8E8;
  border-radius: 0.5rem;
  float: left;
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
}

#chat .chatUser-info-text span {
  font-size: 0.9375rem;
  line-height: 1.5625rem;
}

#chat .chatUser-box1 {
  flex-direction: row-reverse;
}

#chat .chatUser-info-name1 {
  flex-direction: row-reverse;
}

#chat .chatUser-info-text1 {
  float: right;
}
</style>