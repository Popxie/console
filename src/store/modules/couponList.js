/**
 * Created by chengfei on 2017/3/27.
 */
import * as types from '../mutation-types';
import {_get} from '../../utils/fetch';

const state = {
    couponList: [],
    recordsTotal: 0
};

const getters = {
    getCouponInfo: state => state.couponList,
    getConRecordsTotal: state => state.recordsTotal
};

const actions = {
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
    /**
     *   删除广告
     */
    deleteConponById({commit, state}, query) {
        const url = '/deleteAdvertById';
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
    [types.DELETE_CONPON_SUCCESS] (state, id) {
        state.adsList = state.adsList.filter(a => a.id != id);

    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
