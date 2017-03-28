/**
 * Created by chengfei on 2017/3/27.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';

const state = {
    couponList: [],
    recordsTotal: 0
};

const getters = {
    getCouponInfo: state => state.couponList,
    getConRecordsTotal: state => state.recordsTotal
};

const actions = {
    createConpon({commit}, params) {
        const url = '/savecoupon';
        return _post({url}, params, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return Promise.resolve(json.data);
                }
                return Promise.reject(json.message || '保存失败');
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    getConponList({commit, state}, query) {
        const url = '/selectBatchCoupons';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return commit(types.CHECKOUT_CONPON_SUCCESS, json.data);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    // 执行上下线
    updateConponStatusById({commit, state}, query) {
        const url = '/updateBatchCouponStatusById';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.UPDATE_CONPON_SUCCESS, query.id);
                    return Promise.resolve(json.message);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error)
            })
    },
    /**
     *   删除广告
     */
    deleteConponById({commit, state}, query) {
        const url = '/updateBatchCouponStatusById';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    commit(types.DELETE_CONPON_SUCCESS, query.id);
                    return Promise.resolve(json.message);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error);
            })
    }
};
const mutations = {
    [types.CHECKOUT_CONPON_SUCCESS] (state, data) {
        state.couponList = data.content;
        state.recordsTotal = data.recordsTotal;
    },
    [types.UPDATE_CONPON_SUCCESS] (state, id) {
        console.log(id);
        let a = state.couponList.find(a => a.id === id);
        switch (Number(a.status)) {
            case 1:
                a.status = 2;
                break;
            case 2:
                a.status = 1;
                break;
        }
    },
    [types.DELETE_CONPON_SUCCESS] (state, id) {
        state.couponList = state.couponList.filter(a => a.id != id);

    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
