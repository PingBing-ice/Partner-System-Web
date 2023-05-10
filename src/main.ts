import {createApp} from 'vue'
import App from './App.vue'
import Vant from 'vant';
import route from "./config/routeConfig";
import 'vant/lib/index.css';
import "/src/global.css"
// ============================================
import CKEditor from '@ckeditor/ckeditor5-vue';
// @ts-ignore
import shake from './assets/style/shake.js'
// =============================================
import {ActionBar, ActionBarIcon, ActionBarButton, Toast,Notify ,Sticky,Swipe, SwipeItem } from 'vant';
import store from './store';
import {PullRefresh} from 'vant';
import moment from 'moment'
const app = createApp(App)
import VueViewer from "v-viewer";
import 'viewerjs/dist/viewer.css'
shake(app)
app.use(VueViewer, {defaultOptions:{
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
    }});

app.use(Swipe);
app.use(SwipeItem);
app.use(ActionBar);
app.use(CKEditor);
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
