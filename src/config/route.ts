import Index from "../pages/Index.vue";
import Team from "../pages/team/Team.vue";
import UserTeam from "../pages/team/UserTeam.vue";
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


// 2. 定义一些路由
const routes = [
    {path: '/index', component: Index},
    {path: '/team', component: Team},
    {path: '/userTeam', component: UserTeam},
    {path: '/team/add', component: TeamAndPage},
    {path: '/user', component: User},
    {path: '/search', component: SearchPage},
    {path: '/user/list', component: SearchResultPage},
    {path: '/user/edit', component: UserEditPage},
    {path: '/', component: userLogin},
    {path: '/register', component: Register},
    {path: '/find', component: Find},
    {path: '/find/show', component: Show},
    {path: '/findFriend', component: FindFriend},
    {path: '/toChat', component: toChat},
    {path: '/chatTeam', component: toChatTeam},
]

export default routes;
