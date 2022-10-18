// Set config defaults when creating the instance
import axios from "axios";
import {Toast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {getMessages} from "../services/MeesageUtils";


const myAxios = axios.create({
    // baseURL: 'http://47.92.124.72/py',
    baseURL: 'http://localhost/py',
    withCredentials: true,
});
// myAxios.defaults.withCredentials = true;

/**
 * 全局响应拦截器
 */
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
     if (response?.data?.code != 200) {
        if (response.data.description) {
            Toast.fail(response.data.description)
        }else {
            Toast.fail(response.data.message)
        }
    }
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default myAxios;
