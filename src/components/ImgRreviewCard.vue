<template>
  <div v-if="props.images">
    <viewer :images="props.images" @ready="readys" @shown="shown" @hidden="hidden">

      <div class="imageF">
        <img
            :key="index"
            v-for="(item,index) in props.images"
            :src="item"
            class="indexImage"
            alt="" v-lazy="item"/>
      </div>
    </viewer>
    <div class="imageL">
      <van-loading v-if="props.isLoad" size="24px">加载中...</van-loading>
      <div v-if="!props.finished">没有更多了...</div>
    </div>
  </div>

</template>
<script setup>
import {onMounted, ref} from "vue";
import {Base64} from "js-base64";

onMounted(() => {
})
const props = defineProps({
  images: {
    type: Object,
    required: true,
    default: Object,
  },
  isLoad: {
    type: Boolean,
    required: true,
    default: false,
  },
  finished: {
    type: Boolean,
    required: true,
    default: true,
  }
})

const readys = () => {
  let toolbar = document.querySelector(".viewer-toolbar");
  let large = document.querySelector(".viewer-large");
  const button = document.createElement("button");
  button.textContent = '下载';
  button.style.float = 'left'
  button.style.width = '58px'
  button.style.height = '24px'
  button.style.margin = '0 8px 0 8px'
  button.style.background = 'rgba(0, 0, 0, 50%)'
  button.style.color = '#fff'
  button.style.fontSize = '13px'
  button.addEventListener('click', xz)
  if (toolbar && large) {
    const ul = toolbar.querySelector('ul');
    if (ul) {
      ul.replaceChild(button, large);
    }
  }
}
const shown = () => {
}
const xz = () => {
  const canvas = document.querySelector('.viewer-canvas');
  if (canvas) {
    const images = canvas.querySelector('img');
    if (images) {
      const url = images.src
      const str = Base64.encode(url);
      const name = str.substring(0, 10) + Date.now();
      downloadByBlob(url,name);
    }
  }
}
const hidden = () => {

}
const downA = (url) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}
const dow = () => {
  const element = document.createElement("canvas");
  const context = element.getContext('2d');
  const image = new Image();
}
const downloadByBlob = (url, name) => {
  let image = new Image()

  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    const ul = canvas.toDataURL('image/png')
    const a = document.createElement('a');
    a.download = name || 'photo' // 设置图片名称
    a.href = ul // 将生成的URL设置为a.href属性
    a.click()
  }
}
const download = (href, name) => {
  let eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.href = href
  eleLink.click()
  eleLink.remove()
}
</script>

<style scoped>
img {
  height: 200px;
}

.imageF {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 4px 20px 0 20px;
}

.imageL {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>