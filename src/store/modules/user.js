/**
 * Created by chengfei on 2017/3/6.
 */
import * as types from '../mutation-types';
import {_get} from '../../utils/fetch';

const state = {
    userInfo: null
};
const getters = {
    getUserInfo: state => JSON.parse(sessionStorage.getItem('userInfo')) || {},
    isLogin: state => !!JSON.parse(sessionStorage.getItem('userInfo'))
};
// actions
const actions = {
    login ({commit, state}, query) {
        if (state.userInfo) return commit(types.LOGIN_SUCCESS, state.userInfo)
        const url = '/login';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.LOGIN_SUCCESS, json.data)
                    return Promise.resolve(json.data)
                }
                return Promise.reject(json.message)
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    loginOut ({commit}) {
        commit(types.LOGIN_OUT)
    }
};

// mutations
const mutations = {
    [types.LOGIN_SUCCESS] (state, data) {
        sessionStorage.setItem('userInfo', JSON.stringify(data));
        state.userInfo = data;
    },
    [types.LOGIN_OUT] (state) {
        state.userInfo = null;
        sessionStorage.removeItem('userInfo');
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
