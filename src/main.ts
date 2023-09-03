import {createApp} from 'vue'
import App from './App.vue'
import Vant from 'vant';
import route from "./config/routeConfig";
import 'vant/lib/index.css';
import "/src/style/global.css"
import "/src/style/var.css"
// =============================
import './assets/tinymce/skins/content/dark/content.css'
import './assets/tinymce/skins/content/dark/content.css'
import './assets/tinymce/skins/content/default/content.css'
import './assets/tinymce/skins/content/document/content.css'
import './assets/tinymce/skins/content/tinymce-5/content.css'
import './assets/tinymce/skins/content/tinymce-5-dark/content.css'
import './assets/tinymce/skins/content/writer/content.css'

import './assets/tinymce/skins/ui/oxide/content.css'
import './assets/tinymce/skins/ui/oxide/content.inline.css'
import './assets/tinymce/skins/ui/oxide/skin.css'
import './assets/tinymce/skins/ui/oxide/skin.shadowdom.css'
//
import './assets/tinymce/skins/ui/oxide-dark/content.css'
import './assets/tinymce/skins/ui/oxide-dark/content.inline.css'
// import './assets/tinymce/skins/ui/oxide-dark/skin.css'
import './assets/tinymce/skins/ui/oxide-dark/skin.shadowdom.css'
//
import './assets/tinymce/skins/ui/tinymce-5/content.css'
import './assets/tinymce/skins/ui/tinymce-5/content.inline.css'
import './assets/tinymce/skins/ui/tinymce-5/skin.css'
import './assets/tinymce/skins/ui/tinymce-5/skin.shadowdom.css'
//
import './assets/tinymce/skins/ui/tinymce-5-dark/content.css'
import './assets/tinymce/skins/ui/tinymce-5-dark/content.inline.css'
// import './assets/tinymce/skins/ui/tinymce-5-dark/skin.css'
import './assets/tinymce/skins/ui/tinymce-5-dark/skin.shadowdom.css'

import '../src/assets/style/prism.css'
// ============================================
// @ts-ignore
import shake from './assets/style/shake.js'
import './util/socket/websocket'
// =============================================
import {ActionBar, ActionBarIcon, ActionBarButton, Toast, Notify, Sticky, Swipe, SwipeItem, Lazyload} from 'vant';
import store from './store';
import {PullRefresh} from 'vant';
import moment from 'moment'
const app = createApp(App)

import VueViewer from "v-viewer";
import 'viewerjs/dist/viewer.css'


shake(app)
// app.use(ColorThief)
app.use(Lazyload);
// main.ts

app.use(VueViewer, {
    defaultOptions: {
        'inline': false,
        'button': true, //右上角按钮
        "navbar": true, //底部缩略图
        "title": false, //当前图片标题
        "toolbar": true, //底部工具栏
        "tooltip": true, //显示缩放百分比
        "movable": true, //是否可以移动
        "zoomable": true, //是否可以缩放
        "rotatable": true, //是否可旋转
        "scalable": true, //是否可翻转
        "transition": true, //使用 CSS3 过度
        "fullscreen": true, //播放时是否全屏
        "keyboard": true, //是否支持键盘
    }
});

app.use(Swipe);
app.use(SwipeItem);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
app.use(Vant);
app.use(Notify);
app.use(Toast);
app.use(Sticky);
app.use(store)
app.use(PullRefresh);
app.use(moment as any);
//整个应用支持路由。
app.use(route.router)

app.mount('#app')
