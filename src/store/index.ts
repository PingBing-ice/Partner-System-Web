import Vuex, {createStore} from 'vuex'

import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    key:'myName',
    storage: window.sessionStorage
})
const store = createStore({
    state: {
        user: null,
        top: 0,
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getTop(state) {
            return state.top
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
        },
        setTop(state, num) {
            state.top = num;
        },

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