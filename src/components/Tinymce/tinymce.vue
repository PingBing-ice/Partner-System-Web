<template>
  <editor v-model="myValue" :init="init" :disabled="disabled" :id="tinymceId" placeholder="点击此处说点什么..."></editor>
</template>

<script setup lang="ts">
//JS部分
//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/skins/content/default/content.css';

import 'tinymce/themes/silver';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom'; // 这里是个坑 一定要引入
//在TinyMce.vue中接着引入相关插件
import 'tinymce/icons/default/icons';

import 'tinymce/plugins/link';
import 'tinymce/plugins/image'; // 插入上传图片插件
// import "tinymce/plugins/media" // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/advlist'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/code'; // 源码
import "tinymce/plugins/fullscreen" //全屏
import "tinymce/plugins/insertdatetime" //全屏
import "tinymce/plugins/codesample" //全屏
import "tinymce/plugins/searchreplace" //全屏
import 'tinymce/plugins/emoticons'
//接下来定义编辑器所需要的插件数据
import {reactive, ref, onMounted, defineEmits, watch} from 'vue';
import myAxios from "../../config/myAxios";
// import { updateImg } from '@/api/order/order'
const emits = defineEmits(['getContent']);
onMounted(()=>{
  console.log();
})
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  value: {
    type: String,
    default: () => {
      return '';
    },
  },
  baseUrl: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 600
  },
  // 这里配置的的是插件，这里写了下面可以直接引用
  plugins: {
    type: [String, Array],
    default: "lists  table image",
  },//必填
  toolbar: {
    type: [String, Array],
    default:
        "fontselect  fontsizeselect link  alignleft aligncenter alignright alignjustify  lineheight italic underline strikethrough  forecolor backcolor bold  image quicklink h2 h3 blockquote table numlist bullist preview fullscreen"
  },//必填
});
//用于接收外部传递进来的富文本
const myValue = ref(props.value);
const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''));
//定义一个对象 init初始化
const init = reactive({
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  mobile: true,
  table_grid: true,
  language_url: new URL('../../assets/tinymce/langs/zh-Hans.js', import.meta.url).href, // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: 'zh-Hans', //语言
  skin_url: new URL('../../assets/tinymce/skins/ui/oxide',import.meta.url).href, // skin路径，具体路径看自己的项目
  height: "75%", //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  promotion: false,//去点头部Upgrade按钮（注意）
  emoticons_database_url: new URL('../../assets/tinymce/emojis/emojis.min.js',import.meta.url).href,
  image_dimensions: false, //去除宽高属性
  plugins: 'emoticons link  codesample searchreplace  lists advlist image code table wordcount insertdatetime', // 富文本插件
  toolbar:
      'emoticons bold   searchreplace  codesample italic underline   fontsizeselect  forecolor backcolor  alignleft aligncenter  alignright alignjustify strikethrough  bullist numlist  outdent indent blockquote  undo redo  link unlink image code  removeformat insertdatetime',
  font_formats:
      'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: 'all',
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  paste_data_images: true, //图片是否可粘贴
  file_picker_types: 'file',

  content_css: new URL('../../assets/tinymce/skins/content/default/content.css',import.meta.url).href, //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  //图片上传
  images_upload_handler: (blobInfo: any) =>
      new Promise((resolve, reject) => {
        console.log("图片上传");
        // 上传图片需要，FormData 格式的文件；
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        const formDataUp = new FormData();
        // img  是接口需要的上传的属性名，一般属性名是 file
        formDataUp.append('file', blobInfo.blob());
        myAxios
            .post('URL', formDataUp, config)
            .then((res) => {
              resolve(res.data.url);//这里填的是服务器返回的图片地址，这个要填，不填显示不了图片
            });

      }),
  // 文件上传   这个我还没用，暂时不知道能不能用
  file_picker_callback: (callback: any, value: any, meta: any) => {
    // Provide file and text for the link dialog
    if (meta.filetype == 'file') {
      callback('mypage.html', {text: 'My text'});
    }

    // Provide image and alt text for the image dialog
    if (meta.filetype == 'image') {
      callback('myimage.jpg', {alt: 'My alt text'});
    }

    // Provide alternative source and posted for the media dialog
    if (meta.filetype == 'media') {
      callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    }
  },
});

//监听外部传递进来的的数据变化
watch(
    () => props.value,
    () => {
      myValue.value = props.value;
      emits('getContent', myValue.value);
    }
);
//监听富文本中的数据变化
watch(
    () => myValue.value,
    () => {
      emits('getContent', myValue.value); //调用父组件的方法，获取文本内容
    }
);
//在onMounted中初始化编辑器
onMounted(() => {
  tinymce.init({
  });
});
</script>