/* eslint-disable */
/**
 * axios 配置
 */
import axios from 'axios';
const http = axios.create({
    baseURL: process.env.VUE_APP_URL,
    timeout: 100000,
    headers: {},
});

http.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';

// 升级Auth SDK 后添加
http.defaults.headers.common['x-gw-accesskey'] = process.env.VUE_APP_ACCESSKEY
// 设置全局的请求次数，请求的间隙
http.defaults.retry = 1;
http.defaults.retryDelay = 500;
// http request 拦截器
http.interceptors.request.use(
    (config) => {
        if(config.url === "/upload/single") {
            console.log('form')
            config.headers['Content-Type'] = "multipart/form-data"
        }
        const token = sessionStorage.getItem('token')
        const unified = sessionStorage.getItem('unified')
        if (token) {
            config.headers = Object.assign(config.headers, {
                'ennUnifiedAuthorization': token,
                'ennUnifiedCsrfToken': unified
            });
        };
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)

// http response 拦截器
http.interceptors.response.use(
    (response) => {
        // 根据项目所需接口返回的成功状态码自定义修改拦截
        if (response.data.code != 200 && response.data.code != 0) {
            console.error(response.data.message);
        }

        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default http;