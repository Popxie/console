/**
 * Created by chengfei on 2017/3/6.
 */
import * as types from '../mutation-types'
import {_get, _post} from '../../utils/fetch';

// initial state
const state = {
    ads: {}
}

const getters = {
    getAdsInfo: state => state.ads
}

const actions = {
    // 创建广告
    createNewAds({commit}, params) {
        const url = '/saveadvert';
        return _post({url}, params,commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return Promise.resolve(json);
                }
                return Promise.reject(json.message || '保存失败');
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    getAdsByid({commit, state}, query) {
        const url = '/queryAdvertById';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.CHECKOUT_ADSBYID_FAILURE, json.data)
                    return json.data;
                }
                return Promise.reject(json.message);
            })
            .catch((error) => {
                return Promise.reject(error)
            });
    },
    updateAdsById({commit, state}, params) {
        const url = '/updateAdvertById'
        return _post({url}, params, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return Promise.resolve(json.data);
                }
                return Promise.reject(json.message);
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    checkAdsByType({commit, state}, query) {
        const url = '/queryAdvertByTime';
        return _get({url, query})
            .then((json) => {
                if (json.statusCode == 200) {
                    return Promise.resolve(json.data);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error)
            })

    }
}

const mutations = {
    [types.CHECKOUT_ADSBYID_FAILURE] (state, data) {
        state.ads = data
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}
