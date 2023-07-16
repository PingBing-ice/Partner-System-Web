import axios from "axios";
import {showFailToast, showToast} from 'vant';
import store from "../store";

import router from './routeConfig'

const myAxios = axios.create({
    baseURL: import.meta.env.VITE_AX_BASE_URL,
    withCredentials: true,
});
/**
 * 全局响应拦截器
 */
// 添加请求拦截器
myAxios.interceptors.request.use(config => {

    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(async response => {
    if (response?.data?.code !== 200) {
        if (response?.data?.code === 40100) {
            showToast({message: '未登录', position: 'top'});
            store.commit("loginOut");
            const path = router.router.currentRoute.value.fullPath;
            if (path !== '/') {
                await router.router.push({
                    path: '/login',
                    query: {redirect: path}
                });
            }
        } else {
            if (response.data.description) {
                showToast({message: response.data.description, position: 'top'});
            } else {
                showToast({message: response.data.message, position: 'top'});
            }
        }

    }
    // 对响应数据做点什么
    return response.data;
}, error => {
    // 对响应错误做点什么
    if (error.code === "ERR_NETWORK") {
        showFailToast("网络异常,请重试")
    }
    return Promise.reject(error);
});

export default myAxios;
