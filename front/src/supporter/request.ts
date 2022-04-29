import axios from 'axios';
import Qs from 'qs'
import type { AxiosRequestConfig } from 'axios'
import Config from '../config';
//请求封装拦截

const instance = axios.create({
    baseURL: Config.api,
    timeout: 10000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
});

instance.interceptors.request.use((config: AxiosRequestConfig<any>) => {
    let token = localStorage.getItem('token')
    if (token) config.headers!['Authorization'] = `Bearer ${token}`;

    let tempParam = config.data || {};
    config.data = Qs.stringify(tempParam);
    return config;
}, function (error) {
    return Promise.reject(error.Error);
});
// 请求拦截

instance.interceptors.response.use(
    response => {
        return response.data;
    }, error => {
        return Promise.reject(error);
    },
);

const httpR = {
    async post(url: string, param: Object = {}) : Promise<any> {
        return instance({
            method: 'POST',
            url: url,
            data: param
        })
    }
}

export default httpR;