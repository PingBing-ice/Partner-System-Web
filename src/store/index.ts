import {createStore} from 'vuex'

import VuexPersistence from 'vuex-persist'
import {removeToken} from "@/util/cookie";
import {User} from "@/plugins/request/dao/user";

const vuexLocal = new VuexPersistence({
    key: 'myName',
    storage: window.localStorage
})

interface RootState {
    user: User | null;
    top: number;
    teamTop: number;
}

const store = createStore<RootState>({
    state: {
        user: null,
        top: 0,
        teamTop: 0,
    },
    getters: {
        getUser(state:RootState):User|null {
            return state.user;
        },
        getTop(state:RootState):number {
            return state.top
        },
        getTeamTop(state:RootState):number {
            return state.teamTop
        },
        getIsLogin(state:RootState):boolean {
            return state.user != null;
        },
    }
    ,
    mutations: {
        setUser(state:RootState, user:User) {
            state.user = user;
        },
        loginOut(state:RootState) {
            state.user = null;
            removeToken();
        },
        setTop(state:RootState, num:number) {
            state.top = num;
        },
        setTeamTop(state:RootState, num:number) {
            state.teamTop = num;
        },

    }
    ,
    actions: {
        setUser(context, user:User) {
            context.commit('setUser', user)
        },
        LoginOut(context) {
            context.commit('loginOut')
        },
    },
    plugins: [vuexLocal.plugin]

})

export default store