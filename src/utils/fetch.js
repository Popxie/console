/**
 * Created by chengfei on 2017/2/21.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import {settings} from '../config/settings';
Vue.use(VueResource);

/*
 *  拦截器
 */
Vue.http.interceptors.push(function (request, next) {

    let user = JSON.parse(sessionStorage.getItem('userInfo'));
    if (user && user.token) {
        // modify headers
        request.headers.set('token', user.token);
    }
    next();
});
// 解析params 参数
export const parseParams = function (obj) {
    let str = '';
    Object.keys(obj).map((key) => {
        if (obj[key]) {
            str += '&' + key + '=' + obj[key];
        }
    });
    return str.substring(1);
};

// 基础URL
const baseUrl = `${settings.URL}/api`;

/**
 *
 * @param url    api参数
 * @param query  query参数
 * @param commit
 * @returns {Promise.<TResult>|*}
 * @private
 */
export const _get = function ({url, query}, commit) {
    if (commit) commit('START_LOADING')
    let _url
    if (query) {
        _url = `${baseUrl}${url}?${parseParams(query)}`
    } else {
        _url = `${baseUrl}${url}`
    }
    return Vue.http.get(_url)
        .then((res) => {
            if (commit) commit('FINISH_LOADING')
            if (res.status == 200) {
                return res.data
            }
            if(res.status == 203) {
                sessionStorage.removeItem('userInfo');
                return null
            }
            return Promise.reject(new Error(res.status))
        }, (res) => {
            if (commit) commit('FINISH_LOADING')
            return Promise.reject(res)
        })
}

/**
 *
 * @param url    api地址
 * @param query  query参数
 * @param Params data数据
 * @param commit
 * @returns {Promise.<TResult>|*}
 * @private
 */
export const _post = function ({url, query}, params, commit) {
    if (commit) commit('START_LOADING')
    let _url;
    if (query) {
        _url = `${baseUrl}${url}?${parseParams(query)}`;
    } else {
        _url = `${baseUrl}${url}`;
    }
    return Vue.http.post(_url, params)
        .then((res) => {
            if (commit) commit('FINISH_LOADING');
            if (res.status == 200) {
                return res.data;
            }
            if(res.status == 203) {
                sessionStorage.removeItem('userInfo');
                return null
            }
            return Promise.reject(new Error(res.status));
        }, (res) => {
            if (commit) commit('FINISH_LOADING');
            return Promise.reject(res);
        })
}

