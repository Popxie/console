/**
 * Created by chengfei on 2017/2/17.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import app from './modules/app';
import home from './modules/home';
import user from './modules/user';
import createAds from './modules/createAds';
import adsList from './modules/adsList';
import couponList from './modules/coupon';
import createLogger from 'vuex/dist/logger';
import griding from './modules/griding'
import priceRule from './modules/priceRule'
import vipCard from './modules/vipCard'
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        app,
        user,
        home,
        createAds,
        adsList,
        couponList,
        griding,
        priceRule,
        vipCard
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
