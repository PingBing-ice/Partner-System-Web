import {createApp} from 'vue'
import App from './App.vue'
import Vant, {Toast} from 'vant';
import * as VueRouter from 'vue-router';
import route from "./config/routeConfig";
import 'vant/lib/index.css';
import {getCurrentUser} from "./services/users";


const app = createApp(App)
app.use(Vant);

//整个应用支持路由。
app.use(route.router)
app.mount('#app')

