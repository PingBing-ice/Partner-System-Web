import Index from "../pages/Index.vue";

import Team from "../pages/team/Team.vue";
import UserTeam from "../pages/team/UserTeam.vue";
import userTeamEditPage from "../pages/team/userTeamEditPage.vue";
import TeamAndPage from "../pages/team/TeamAndPage.vue";
import User from "../pages/user/User.vue";
import Space from "../pages/user/Space.vue";
import SearchPage from "../pages/search/SearchPage.vue";
import UserEditPage from "../pages/user/UserEditPage.vue";
import SearchResultPage from "../pages/search/SearchResultPage.vue";
import userLogin from "../pages/user/UserLogin.vue";
import UserForget from "../pages/user/UserForget.vue";
import Register from "../pages/user/UserRegister.vue";
import Find from "../pages/friend/Find.vue";
import Show from "../pages/friend/Show.vue";
import FindFriend from "../pages/friend/FindFriend.vue";
import toChat from "../pages/chat/toChat.vue";
import toChatTeam from "../pages/chat/toChatTeam.vue";
import post from "../pages/post/addPost.vue";
import Details from "../pages/post/PostDetails.vue";
import Collect from "../pages/post/postCollect.vue";
import * as VueRouter from "vue-router";

import store from "../store";
import {getCurrentUser} from "../services/users";
import webSocketConfig from "./webSocketConfig";


// 2. 定义一些路由
const routes = [
    {path: '/index', title: '主页', component: Index},
    {path: '/index:switchTab', component: Index},
    {path: '/team', title: '队伍管理', component: Team},
    {path: '/userTeam', component: UserTeam},
    {path: '/userTeam/add', title: '修改队伍', component: userTeamEditPage},
    {path: '/team/add', title: '添加队伍', component: TeamAndPage},
    {path: '/user', title: '个人信息', component: User},
    {path: '/space', title: '个人中心', component: Space},
    {path: '/collect', title: '我的收藏', component: Collect},
    {path: '/space/details', title: '详情', component: Details},
    {path: '/search', title: '搜索', component: SearchPage},
    {path: '/user/list', title: '搜索', component: SearchResultPage},
    {path: '/user/edit', title: '修改信息', component: UserEditPage},
    {path: '/', component: userLogin},
    {path: '/forget', component: UserForget},
    {path: '/register', component: Register},
    {path: '/find', title: '伙伴管理', component: Find},
    {path: '/find/show', title: '伙伴管理', component: Show},
    {path: '/findFriend', title: '搜索好友', component: FindFriend},
    {path: '/toChat', component: toChat},
    {path: '/chatTeam', component: toChatTeam},
    {path: '/addPost', component: post},
]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory('/'),
    routes, // `routes: routes` 的缩写
})
router.beforeEach(async (to, from, next) => {
    webSocketConfig.initSocket();
    if (to.path !== '/' && to.path !== '/register' && to.path !== '/forget') {
        if (!store.getters.getIsLogin) {
            let user = null;
            try {
                 user = await getCurrentUser();
            } catch (e){
                store.commit("loginOut")
                next('/');
            }
            if (user != null) {
                await store.commit("setUser", user);
            }else {
                next('/');
            }
        }
        // 检查用户是否已登录
        // ❗️ 避免无限重定向
        if (!store.getters.getIsLogin && to.path !== '/' && to.path !== '/register' && to.path !== '/forget') {
            // 将用户重定向到登录页面
            next('/');
        } else {
            next()
        }

    } else if (to.path === '/' || to.path === '/register' || to.path !== '/forget') {
        if (store.getters.getIsLogin) {
            next('/index')
        }else {
            next();
        }
    } else {
        next();
    }

})

export default {
    routes,
    router
};
