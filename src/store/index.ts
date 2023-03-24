import Vuex from 'vuex'

import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    key:'myName',
    storage: window.sessionStorage
})
const store = new Vuex.Store({
    state: {
        user: null,
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getIsLogin(state) {
            return state.user != null;
        },
    }
    ,
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        loginOut(state)  {
            state.user = null;
        }
    }
    ,
    actions: {
        setUser(context, user) {
            context.commit('setUser',user)
        },
        LoginOut(context) {
            context.commit('loginOut')
        },
    },
    plugins: [vuexLocal.plugin]

})

export default store