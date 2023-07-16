import * as VueRouter from "vue-router";
import BasicLayout from "../layouts/BasicLayout.vue"
import store from "../store";
import {showToast} from "vant";


// 2. 定义一些路由
const routes = [
    {
        path: '/',
        name: '主页',
        component: BasicLayout,
        redirect: '/index',
        meta: {
            isHeardAv: true,
            isLogin: false
        },
        children: [
            {
                path: '/index',
                name: '主页',
                component: () => import('../pages/Index.vue')
            },

        ]

    },

    {
        path: '/team',
        name: '队伍',
        component: BasicLayout,
        meta: {
            isHeardAv: true,
            isLogin: true
        },
        children: [
            {
                path: '/team',
                name: '队伍',
                component: () => import('../pages/team/team/index.vue')
            },
            {
                path: '/team/post',
                name: '队伍文章',
                meta: {
                    isHeardAv: true,
                    isLogin: true
                },
                component: () => import('../pages/team/post/index.vue')
            }
        ]

    },
    {
        path: '/user/team',
        name: '队伍管理',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isLogin: true
        },
        children: [
            {
                path: '/user/team',
                name: '队伍管理',
                meta:{
                    isHeardAv: true,
                },
                component: () => import('../pages/team/user/index.vue')
            },
            {
                path: '/user/team/add',
                name: '修改队伍',
                component: () => import('../pages/team/userTeamEditPage.vue')
            },
            {
                path: '/team/add',
                name: '添加队伍',
                component: () => import('../pages/team/TeamAndPage.vue')
            }
        ]
    },
    {
        path: '/user',
        name: '个人信息',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isLogin: true
        },
        children: [
            {
                path: '/user',
                name: '个人信息',
                component: () => import('../pages/user/User.vue')
            },
            {
                path: '/label',
                name: '个人标签',
                component: () => import('../pages/user/UserLabel.vue')
            },

            {
                path: '/collect',
                name: '我的收藏',
                component: () => import('../pages/post/collect/index.vue')
            },
            {
                path: '/edit',
                name: '修改信息',
                component: () => import('../pages/user/UserEditPage.vue')
            },
            {
                path: '/show',
                name: '用户',
                component: () => import ('../pages/friend/Show.vue')
            },

        ]
    },
    {
        path: '/user',
        name: '个人中心',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isNotHeard: true,
            isLogin: true
        },
        children: [
            {
                path: '/space',
                name: '个人中心',
                component: () => import('../pages/user/space/index.vue')
            },
        ]
    },
    {
        path: '/score',
        name: '积分',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isLogin: false
        },
        children: [
            {
                path: '/score',
                name: '积分管理',
                component: () => import('../pages/score/score.vue')
            },
            {
                path: '/rec',
                name: '积分充值',
                component: () => import('../pages/score/recharge.vue')
            },
        ]
    },
    {
        path: '/post',
        name: '文章',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isLogin: true
        },
        children: [
            {
                path: '/post/details',
                name: '详情',
                component: () => import('../pages/post/details/index.vue')

            },
            {
                path: '/post/add',
                name: '添加文章',
                meta: {
                    isHeardAv: true,
                    isLogin: true
                },
                component: () => import('../pages/post/add/index.vue')
            },
            {
                path: '/record',
                name: '历史记录',
                component: () => import('../pages/post/record/index.vue')
            },
            {
                path: '/points',
                name: '签到中心',
                meta: {
                    isHeardAv: false,
                    isLogin: true
                },
                component: () => import('../pages/point/points.vue')
            },

        ]

    },
    {
        path: '/search',
        name: '搜索',
        component: BasicLayout,
        meta: {
            isHeardAv: false,
            isLogin: true
        },
        children: [
            {path: '/search', name: '搜索', component: () => import('../pages/search/SearchPage.vue')},
            {path: '/search/list', name: '搜索aa', component: () => import('../pages/search/SearchResultPage.vue')},
            {path: '/search/friend', name: '好友搜索', component: () => import('../pages/friend/FindFriend.vue')},
        ]

    },
    {
        path: '/find',
        name: '通讯录',
        component: BasicLayout,
        meta: {
            isHeardAv: true,
            isLogin: true
        },
        children: [
            {path: '/find', name: '通讯录', component: () => import('../pages/friend/Find.vue')},
        ]
    },
    {
        path: '/toChat',
        component: BasicLayout,
        meta: {
            isChat: true,
            isHeardAv: true,
            isLogin: true
        },
        children: [
            {path: '/chat', component: () => import('../pages/chat/toChat.vue')},
            {path: '/chat/team', component: () => import('../pages/chat/toChatTeam.vue')},
            {path: '/hall', name:'大厅', component: () => import('../pages/chat/ChatHall.vue')},
        ]
    },
    {path: '/login', component: () => import('../pages/user/login/UserLogin.vue')},
    {path: '/forget', component: () => import('../pages/user/login/UserForget.vue')},
    {path: '/register', component: () => import('../pages/user/login/UserRegister.vue')},
]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes: routes, // `routes: routes` 的缩写
})

router.beforeEach(async (to, from) => {
    if (store.getters.getIsLogin) {
        if (to.path === '/login' || to.path === '/register' || to.path === '/forget') {
            const redirect = to.query?.redirect ?? '/index';
            return {
                path: redirect,
            };
        }
    }
    if (to.meta.isLogin) {
        if (store.getters.getIsLogin) {
            if (to.path === '/login' || to.path === '/register' || to.path === '/forget') {
                return {
                    path: '/index'
                };
            }
        } else {
            showToast({
                message: '请先登录',
                position: 'top',
            });
            if (from.path === '/index'&&to.path==='/post/details') {
                return false;
            }
            return {
                path: '/login',
                query: {redirect: to.fullPath}
            };

        }

    }


})

export default {
    routes,
    router
};
