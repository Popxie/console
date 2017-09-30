/**
 * Created by chengfei on 2017/3/27.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';

const state = {
    couponList:[],
    areaList:[],
    couponMap: {},
    recordsTotal: 0,
    couponInfo: [],
    infoRecordsTotal: 0,
    merchantList: [],       // 商家券列表
    total: 0,               // 数据总条数
};

const getters = {
    getCouList: state => state.couponList,
    getAreaList:state => state.areaList,
    getCouInfo: state => state.couponInfo,
    getConRecordsTotal: state => state.recordsTotal,
    getConInfoRecordsTotal: state => state.infoRecordsTotal,
    getCouponMap: state => state.couponMap,
    merchantList: state => state.merchantList,
    total: state => state.total,
};

const actions = {
    // 创建优惠券
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
    // 创建商家券
    createMerchant({commit}, params){
        const url = '/import_third_coupon';
        return _post({url}, params, commit)
            .then((json) => {
                if (json.statusCode === '200') {
                    return Promise.resolve(json.data);
                }
                return Promise.reject(json.message || '保存失败');
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    // 获取商家券列表
    getMerchantList({commit}, params) {
        const url = '/query_third_coupon_batch';
        return _post({url},params,commit)
            .then((json) => {
                if (json.statusCode === '200') {
                    return commit(types.GET_MERCHANT_LIST, json);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error);
            });
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
    getConponInfo({commit, state}, query) {
        const url = '/selectCouponsByBatchId';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return commit(types.CHECKOUT_CONPONINFO_SUCCESS, json.data);
                }
                return Promise.reject(json.message);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取地区信息
    getArea({commit, state}, query) {
        const url = '/selectAllArea';
        return _get({url, query}, commit)
            .then((json) => {
                if (json.statusCode == 200) {
                    return commit(types.CHECKOUT_AREAS_SUCCESS, json.data);
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
    [types.CHECKOUT_CONPONINFO_SUCCESS] (state, data) {
        state.couponInfo = data.content;
        state.infoRecordsTotal = data.recordsTotal;
        state.couponMap = data.couponMap;
    },
    [types.UPDATE_CONPON_SUCCESS] (state, id) {
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

    },
    [types.CHECKOUT_AREAS_SUCCESS] (state, data) {
        state.areaList = data;
    },
    [types.GET_MERCHANT_LIST] (state, payload) {
        state.merchantList = payload.data.content;
        state.total = payload.data.total;
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
