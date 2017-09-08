/**
 * Created by chenyike on 2017/7/10.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';
const state = {
    vipCardList: [],        // 会员卡列表
    thirdPartnerList: [],   // 合作方列表
};

const getters = {
    vipCardList: state => state.vipCardList,
    thirdPartnerList: state => state.thirdPartnerList,
};

const actions = {
    //创建会员卡（自营）
    setVipCard({commit}, data) {
        let url = '/riding_card/create_riding_card';
        let formData = new FormData();
        for (let key in data) {
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url}, formData, commit)
            .then((data) => {
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.reject(data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    // 创建活动会员卡
    setActivityVipCard({commit}, params) {
        let url = '/riding_card/create_riding_card_v2';
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
    // 获取第三方合作伙伴
    getThirdPartnerList({commit}){
        let url = '/riding_card/get_third_part_type';
        return _post({url}, commit)
            .then((data) => {
                if(data.status == 1) {
                    return commit (types.GET_THIRD_PARTNER_LIST, data.data);
                    // return Promise.resolve(data);
                }
                return Promise.reject(data);
            }).catch((error) => {
                return Promise.reject(error);
            })
    },
    
    //获取会员卡列表
    getVipCardList({commit},data) {
        let url = '/riding_card/riding_card_list';
        let formData = new FormData();
        for (let key in data) {
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url},formData,commit)
            .then((data) => {
                if (data.status == 1) {
                    // return Promise.resolve(data);
                    return commit(types.SET_VIP_CARD_LIST, data.data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //下线会员卡
    offlineVipCard({commit}, data) {
        let url = '/riding_card/offline_riding_card';
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

};
const mutations = {
    [types.SET_VIP_CARD_LIST] (state, data) {
        state.vipCardList = data;
    },
    [types.GET_THIRD_PARTNER_LIST] (state, data) {
        state.thirdPartnerList = data;
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
