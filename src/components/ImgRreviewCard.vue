<template>
  <div v-if="props.images">
    <viewer :images="props.images" @ready="readys" @shown="shown" @hidden="hidden">
      <div class="imageF">
        <img
            :key="index"
            v-for="(item,index) in props.images"
            :src="item"
            class="indexImage"
            alt=""/>
      </div>

    </viewer>
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
  console.log("asd")
}
const xz = () => {
  const canvas = document.querySelector('.viewer-canvas');
  if (canvas) {
    const images = canvas.querySelector('img');
    if (images) {
      const url = images.src
      const str = Base64.encode(url);
      const name = str.substring(0, 10)+Date.now();
      downloadByBlob(url, name)
    }
  }
}
const hidden = () => {

}
const downloadByBlob = (url, name) => {
  let image = new Image()

  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob)
      download(url, name)
      // 用完释放URL对象
      URL.revokeObjectURL(url)
    })
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
</style>