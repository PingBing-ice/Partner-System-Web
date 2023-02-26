import Vuex from 'vuex'


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
        loginOut:state => {
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
    }

})

export default store