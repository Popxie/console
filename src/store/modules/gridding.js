/**
 * Created by chenyike on 2017/6/21.
 */
import * as types from '../mutation-types';
import {_get, _post} from '../../utils/fetch_noapi';

const state = {
    curCity: 'hangzhou',
    coordinates: [],
    isCityDivision: false,
    areaBikeList: [],
    areaBikeInfoList: []
};

const getters = {
    curCity: state => state.curCity,
    coordinates: state => state.coordinates,
    isCityDivision: state => state.isCityDivision,
    areaBikeList: state => state.areaBikeList,
    areaBikeInfoList: state => state.areaBikeInfoList
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
    getAreaAllBikes({commit, state},data) {
        let url = '/block/gridding/bikes';
        let date = +new Date(); //获取当前日期时间戳
        let before = date - 1000 * 60 * 60 * 24;//当前日期时间戳减去一天时间戳
        let blockNum = data.blockNum;
        let params = {
            cityCode: state.curCity,
            startTime: parseInt(before / 1000).toString(),
            endTime: (Date.parse(new Date()) / 1000).toString(),
            coordinates: data.coordinates
        };
        return _post({url}, params, commit)
            .then((data) => {
                if (data.status == 1) {
                    let info = {
                        riddingInfo: data.data,
                        blockNum: blockNum
                    };
                    return commit(types.SET_AREA_BIKE_LIST,info);
                }
                return Promise.reject(data.msg);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },
    //获取区域内 每辆自行车的骑行状态情况
    getAreaBikeStatus({commit}, data) {
        let url = '/bikes/riding';
        let params = {
            pageIndex: '1',
            totalPage: '20',//一次请求20条数据
            coordinates: data.coordinates
        };
        return _post({url}, params, commit)
            .then((data) => {
                if (data.status == 1) {
                    console.log(data);
                    return commit(types.SET_AREA_BIKE_INFO_LIST, data.data);
                }
                return Promise.reject(data.msg);
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
    },
    [types.SET_AREA_BIKE_LIST] (state, data) {
        state.areaBikeList.push(data);
    },
    [types.CLEAR_AREA_BIKE_LIST] (state) {
        state.areaBikeList = [];
    },
    [types.SET_AREA_BIKE_INFO_LIST] (state, data) {
        state.areaBikeInfoList.push(data);
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
