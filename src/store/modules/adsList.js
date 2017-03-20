/**
 * Created by chengfei on 2017/3/8.
 */
import * as types from '../mutation-types';
import {_get} from '../../utils/fetch';

const state = {
    adsList: [],
    recordsTotal: 0,
    page: {
        currentPage: 0,
        pageSize: 0,
        topic: ''
    }
};

const getters = {
    getAdsListInfo: state => state.adsList,
    getRecordsTotal: state => state.recordsTotal,
    getPageInfo: state=> state.page
};

const actions = {
    // 获取广告列表
    getAdsList({commit, state}, query) {
        const url = '/queryAdvert.html';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.CHECKOUT_ADS_SUCCESS, json.data)
                    return Promise.resolve(json.message);
                }
                return Promise.reject(json.message);
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    // 执行上下线
    updateAdvertStatusById({commit, state}, query) {
        const url = '/updateAdvertStatusById.html';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.UPDATE_ADVER_SUCCESS, query.id);
                    return Promise.resolve(json.message);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error)
            })
    },
    // 删除广告
    deleteAdvertById({commit, state}, query) {
        const url = '/deleteAdvertById.html';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.DELETE_ADVER_SUCCESS, query.id)
                    return Promise.resolve(json.message);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error)
            })
    },
    // 暂存页面信息
    savePageInfo({commit, state}, query) {
        commit()
    }
}

const mutations = {
    [types.CHECKOUT_ADS_SUCCESS] (state, data) {
        state.adsList = data.content;
        state.recordsTotal = data.recordsTotal;

    },
    [types.UPDATE_ADVER_SUCCESS] (state, id) {
        console.log(id);
        let a = state.adsList.find(a => a.id === id);
        switch (Number(a.status)) {
            case 1:
                a.status = 3;
                break;
            case 3:
                a.status = 1;
                break;
            case 2:
                a.status = 1;
                break;
        }
    },
    [types.DELETE_ADVER_SUCCESS] (state, id) {
        state.adsList = state.adsList.filter(a => a.id != id);

    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
