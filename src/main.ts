import {createApp} from 'vue'
import App from './App.vue'
import Vant from 'vant';
import route from "./config/routeConfig";
import 'vant/lib/index.css';
import { List } from 'vant';

import { ActionBar, ActionBarIcon, ActionBarButton,Toast } from 'vant';
// @ts-ignore
import VueQuillTextEditor from 'vue-quill-text-editor';
import 'vue-quill-text-editor/dist/vue-quill-text-editor.esm.css';
import store from './store';
import { PullRefresh} from 'vant';
import moment from 'moment'
const app = createApp(App)
app.use(List);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
app.use(Vant);
app.use(Toast);
app.use(store)
app.use(PullRefresh);
// @ts-ignore
app.use(moment);
//整个应用支持路由。
app.use(VueQuillTextEditor)
app.use(route.router)
app.mount('#app')
