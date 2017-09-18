/**
 * Created by chenyike on 2017/7/10.
 */
import * as types from '../mutation-types';
import {_get, _post, _post_copy} from '../../utils/fetch';
const state = {
    activityList: [],        // 活动中心列表
};

const getters = {
    activityList: state => state.activityList,
};

const actions = {
    //获取活动中心列表
    getActivityList({commit},params) {
        let url = '/activity/queryActives';
        
        return _post({url},params,commit)
            .then((data) => {
                if (data.status == 1) {
                    // return Promise.resolve(data);
                    console.debug(data);
                    // for(let i = 0; i < data.data.length; i++) {
                    //     if(data.data[i].status === '2') {
                    //         data.data[i].status = '3'
                    //     }
                    // }
                    return commit(types.GET_ACTIVITY_LIST, data.data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    // 创建活动
    createdActivity({commit}, params) {
        let url = '/activity/add';
        return _post({url}, params, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    
    // 获取活动信息（点击修改进入的页面）
    getActivityInfo({commit},params) {
        let url = '/activity/get';
        
        return _post_copy({url},params, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    // 保存修改后的活动信息
    modifyActivity({commit}, params) {
        let url = '/activity/edit';
        
        return _post({url},params, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //下线 & 上线
    offlineActivity({commit}, params) {
        let url = '/activity/updateActiveStatusById';
        return _post_copy({url},params, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    
};
const mutations = {
    [types.GET_ACTIVITY_LIST] (state, data) {
        state.activityList = data;
    },
};
export default {
    state,
    getters,
    mutations,
    actions
}
