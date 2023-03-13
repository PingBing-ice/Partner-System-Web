import {createApp} from 'vue'
import App from './App.vue'
import Vant from 'vant';
import route from "./config/routeConfig";
import 'vant/lib/index.css';
import { ActionBar, ActionBarIcon, ActionBarButton,Toast } from 'vant';
// @ts-ignore
import store from './store';
import { PullRefresh} from 'vant';
const app = createApp(App)
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
app.use(Vant);
app.use(Toast);
app.use(store)
app.use(PullRefresh);
//整个应用支持路由。
app.use(route.router)
app.mount('#app')

