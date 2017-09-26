/**
 * Created by chenyike on 2017/7/10.
 */
import * as types from '../mutation-types';
import {_get, _post, _post_copy} from '../../utils/fetch';
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
    getVipCardList({commit},params) {
        let url = '/riding_card/riding_card_list';
        
        return _post({url},params,commit)
            .then((data) => {
                if (data.status == 1) {
                    // return Promise.resolve(data);
                    for(let i = 0; i < data.data.length; i++) {
                        if(data.data[i].status === '2') {
                            data.data[i].status = '3'
                        }
                    }
                    return commit(types.SET_VIP_CARD_LIST, data.data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    // 获取会员卡信息
    getVipCardInfo({commit},params) {
        let url = '/riding_card/get_riding_card_info';
    
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
    // 保存修改后的会员卡信息
    modifyActivityVipCard({commit}, params) {
        let url = '/riding_card/motify_riding_card_info';
    
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
    //下线会员卡
    offlineVipCard({commit}, params) {
        let url = '/riding_card/offline_riding_card';
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
