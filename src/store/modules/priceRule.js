/**
 * Created by chenyike on 2017/7/4.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';

const state = {
    priceModelList: [], //计费模型
    priceList: [],//计费规则列表
    curPriceModel: {}
};

const getters = {
    
    priceModelList: state => state.priceModelList,
    priceList: state => state.priceList,
    curPriceModel: state => state.curPriceModel
};

const actions = {
    // 获取 电子围栏id
    getERailsList({commit}, data) {
        let url = '/riding_price/electric_list';
        let formData = new FormData();
        for (let key in data) {
            if(key === 'billingModule') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key,data[key]);
            }
        }
        return _post({url}, formData, commit)
            .then((res) => {
                if (res.status == 1) {
                    return Promise.resolve(res);
                }
                // return Promise.reject(error);  // 这里的error 是个空{} 要想拿到后台返回的msg  还的用res
                return Promise.reject(res);  // 只要一走reject 就会被catch捕获到
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //创建阶梯计费模型
    setNewRuleModel({commit}, data) {
        let url = '/riding_price/create_model';
        let formData = new FormData();
        formData.append('name', data.name);
        formData.append('value', JSON.stringify(data.value));
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(error);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取计费规则列表
    getPriceList({commit},data) {
        let url = '/riding_price/price_list';
        let formData = new FormData();
        for (let key in data) {
            if(key === 'province') {
                return;
            }
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url},formData,commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //创建阶梯计费 参数缺
    setNewRule({commit}, data) {
        let url = '/riding_price/create_riding_price';
        let formData = new FormData();
        for (let key in data) {
            if(key === 'billingModule') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key,data[key]);
            }
        }
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data.msg);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //修改计费规则 参数缺
    editRule({commit}, data) {
        let url = '/riding_price/edit_riding_price';
        let formData = new FormData();
        for (let key in data) {
            if(key === 'provinces') {
                break;
            }
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data.msg);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取阶梯模型 详情
    getRuleModelDetail({commit}, data) {
        let url = '/riding_price/model_detail';
        let formData = new FormData();
        formData.append('id', data);
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //下线计费规则
    offlineRule({commit}, data) {
        let url = '/riding_price/offline_price';
        let formData = new FormData();
        formData.append('id', data);
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取阶梯模型
    getModelList({commit}) {
        let url = '/riding_price/model_list';
        return _post({url}, commit)
            .then((data) => {
                if (data.status == 1) {
                    return commit(types.SET_PRICE_MODEL_LIST, data.data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }

};
const mutations = {
    [types.SET_PRICE_MODEL_LIST] (state, data) {
        state.priceModelList = data;
    },
    [types.SET_PRICE_LIST] (state, data) {
        state.priceList = data;
    },
    [types.SET_CUR_PRICE_MODEL] (state, data) {
        state.curPriceModel = data;
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
