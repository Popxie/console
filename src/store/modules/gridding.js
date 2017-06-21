/**
 * Created by chenyike on 2017/6/21.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch';

const state = {
    curCity: 'hangzhou',
    coordinates: [],
    isCityDivision: false
};

const getters = {
    curCity: state => state.curCity,
    coordinates: state => state.coordinates,
    isCityDivision: state => state.isCityDivision
};

const actions = {
    //获取当前城市是否 已经划分调度网格
    getCityIsDivision({commit, state}) {
        const url = '/gridding/' + state.curCity;
        return _get({url}, commit)
            .then((data) => {
                if (data.status == 1) {
                    if (data.data === 1) {
                        commit(types.SET_CITY_DIVISION, true);
                    }
                    return Promise.resolve(data.data);
                }
                return Promise.reject(data.msg);
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    },
    //将当前城市 划分调度网格
    setCityDivision({commit, state}, data) {
        let url = '/block/gridding/' + state.curCity;
        return _post({url}, data, commit)
            .then((data) => {
                console.log(data);
                if (data.status == 1) {
                    alert(data.data)
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取区域内的网格划分情况
    getAreaDivisionInfo({commit, state}, query) {
        let url = '/block/gridding/info';
        let data = {
            cityCode: state.curCity,
            coordinates: query
        };
        console.log(data);
        return _post({url}, data, commit)
            .then((data) => {
                console.log(data);
                if (data.status == 1) {
                    return commit(types.SET_COORDINATES, data.data);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取区域内自行车流量情况，以及自行车详情
    getAreaAllBikes({commit}, data) {
        let url = '/block/gridding/bikes';
        return _post({url}, data, commit)
            .then((data) => {
                console.log(data);
                // if (data.status == 1) {
                // }
                // return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取区域内 每辆自行车的骑行状态情况
    getAreaBike({commit}, data) {
        let url = '/bikes/riding';
        return _post({url}, data, commit)
            .then((data) => {
                console.log(data);
                // if (data.status == 1) {
                // }
                // return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
};
const mutations = {
    [types.SET_CURCITY] (state, data) {
        state.curCity = data;
    },
    [types.SET_COORDINATES] (state, data) {
        state.coordinates = data;
    },
    [types.SET_CITY_DIVISION] (state, data) {
        state.isCityDivision = data;
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
