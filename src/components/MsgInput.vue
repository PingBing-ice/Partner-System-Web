<template>
  <div class="chatButt">
    <div class="chatbuts">
      <div class="chatBut">
        <div class="sendBut">
          <textarea :placeholder="prop.placeholder" class="chatInput" rows="1" @input="inPut"
                    v-model="message"></textarea>
        </div>
      </div>
      <van-button class="msg_but" size="small" type="primary" @click="getSend">发送</van-button>
    </div>

  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";

const message = ref('');
const prop = defineProps({
  placeholder: {
    type: String,
    default: "请输入内容",
    required: true,
  }
})
onMounted(() => {
  const chatInput = document.querySelector(".chatInput");
  if (chatInput) {
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = chatInput.scrollHeight + 'px';
    });
  }
})
const emits = defineEmits(['input', 'but']);

const inPut = () => {
  emits('input', message.value)
}
const getSend = () => {
  emits('but')
  message.value = '';
  nextTick(() => {
    const chatInput = document.querySelector(".chatInput");

    if (chatInput) {
      chatInput.focus()
    }
  })
}
</script>

<style scoped>
.msg_but {
  border-radius: 15px;
  width: 60px
}

.chat-msg-send {
  padding: 10px 20px 20px;
  font-size: 0;
}

.chat-msg-send .msg-input-box {
  display: flex;
  align-items: center;
}

.chat-msg-send .msg-input-wrapper {
  position: relative;
  flex: 1;
  margin: 0 20px 0 0;
}

.chat-msg-send .emoji-button {
  margin-right: 10px;
}

.chat-msg-send .emoji-button, .chat-msg-send .send-button {
  background-color: #1d90f5;
  border: 0;
  padding: 4px 0 0;
  transition: .3s;
  box-shadow: 0 0 5px #08f;
  color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 12px;
  font-size: 24px;
  cursor: pointer;
}

.chat-msg-send .msg-input-wrapper {
  position: relative;
  flex: 1;
  margin: 0 20px 0 0;
}

.el-textarea {
  position: relative;
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  font-size: 14px;
}

.chat-msg-send .msg-input .el-textarea__inner {
  width: 100%;
  background-color: #424656;
  border-radius: 16px;
  border: none;
  padding: 10px;
  resize: none;
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
  transition: .2s;
  box-shadow: none;
}
</style>