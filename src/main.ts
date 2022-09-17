import {createApp} from 'vue'
import App from './App.vue'
import Vant, {Toast} from 'vant';
import * as VueRouter from 'vue-router';
import routes from "./config/route";
import 'vant/lib/index.css';
import {getCurrentUser} from "./services/users";


const app = createApp(App)
app.use(Vant);

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
router.beforeEach(async (to, from) => {
    const user = await getCurrentUser();
    // 检查用户是否已登录
    // ❗️ 避免无限重定向
    if (user == null && to.path !== '/' && to.path !== '/register') {
        // 将用户重定向到登录页面
        return {path: '/'}
    }
    if (user != null) {
        if (to.path === '/') {
            return {path: '/index'}
        }
    }
})
//整个应用支持路由。
app.use(router)
app.mount('#app')

