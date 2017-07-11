/**
 * Created by chenyike on 2017/7/10.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';
const state = {
    // priceModelList: [], //计费模型
};

const getters = {
    // priceModelList: state => state.priceModelList,
};

const actions = {
    //创建会员卡
    setVipCard({commit}, data) {
        let url = '/vip_card/create_vip_card';
        let formData = new FormData();
        for (let key in data) {
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url}, formData, commit)
            .then((data) => {
                console.log(data);
                if (data.status == 1) {
                    return Promise.resolve(data);
                }
                return Promise.resolve(data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取会员卡列表
    getVipCardList({commit},data) {
        let url = '/vip_card/vip_card_list';
        let formData = new FormData();
        for (let key in data) {
            if(data[key]) {
                formData.append(key,data[key]);
            }
        }
        return _post({url},formData,commit)
            .then((data) => {
                console.log(data);
                // console.log(data.data.totalCount);
                if (data.status == 1) {
                    return Promise.resolve(data);
                    // return commit(types.SET_PRICE_LIST, data.data.priceListData);
                }
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //下线会员卡
    offlineVipCard({commit}, data) {
        let url = '/vip_card/offline_vip_card';
        let formData = new FormData();
        formData.append('id', data);
        return _post({url}, formData, commit)
            .then((data) => {
                console.log(data.status);
                if (data.status == 1) {
                    alert('成功');
                    return Promise.resolve(data);
                }
            }).catch((error) => {
                return Promise.reject(error);
            });
    },

};
const mutations = {
};
export default {
    state,
    getters,
    mutations,
    actions
}
