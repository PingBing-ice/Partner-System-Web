import Index from "../pages/Index.vue";

import Team from "../pages/team/Team.vue";
import UserTeam from "../pages/team/UserTeam.vue";
import userTeamEditPage from "../pages/team/userTeamEditPage.vue";
import TeamAndPage from "../pages/team/TeamAndPage.vue";
import User from "../pages/user/User.vue";
import SearchPage from "../pages/search/SearchPage.vue";
import UserEditPage from "../pages/user/UserEditPage.vue";
import SearchResultPage from "../pages/search/SearchResultPage.vue";
import userLogin from "../pages/user/UserLogin.vue";
import Register from "../pages/user/UserRegister.vue";
import Find from "../pages/friend/Find.vue";
import Show from "../pages/friend/Show.vue";
import FindFriend from "../pages/friend/FindFriend.vue";
import toChat from "../pages/chat/toChat.vue";
import toChatTeam from "../pages/chat/toChatTeam.vue";
import * as VueRouter from "vue-router";
import {getCurrentUser} from "../services/users";
import webSocketConfig from "./webSocketConfig";


// 2. 定义一些路由
const routes = [
    {path: '/index',title: '主页', component: Index},
    {path: '/team',title: '队伍管理', component: Team},
    {path: '/userTeam', component: UserTeam},
    {path: '/userTeam/add',title: '修改队伍', component: userTeamEditPage},
    {path: '/team/add',title: '添加队伍', component: TeamAndPage},
    {path: '/user',title: '个人中心', component: User},
    {path: '/search', title: '搜索',component: SearchPage},
    {path: '/user/list',title: '搜索', component: SearchResultPage},
    {path: '/user/edit',title: '修改信息', component: UserEditPage},
    {path: '/', component: userLogin},
    {path: '/register', component: Register},
    {path: '/find',title: '伙伴管理', component: Find},
    {path: '/find/show',title: '伙伴管理', component: Show},
    {path: '/findFriend',title: '搜索好友', component: FindFriend},
    {path: '/toChat', component: toChat},
    {path: '/chatTeam', component: toChatTeam},
]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
router.beforeEach(async (to, from,next) => {
    if (to.path !== '/' && to.path !== '/register') {
        const user = await getCurrentUser();
        // 检查用户是否已登录
        // ❗️ 避免无限重定向
        if (user == null && to.path !== '/' && to.path !== '/register') {
            console.log(to.path)
            // 将用户重定向到登录页面
            next('/');
        }else {
            await webSocketConfig.initSocket();
            next()
        }
        if (user != null) {
            if (to.path === '/' ||to.path === '/register' ) {
                next('/index')
            }
        }
    }else {
        next();
    }

})

export default {
    routes,
    router
};
