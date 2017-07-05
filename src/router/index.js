import Vue from 'vue';
import Router from 'vue-router';
import Home  from 'views/Home';
import Login  from 'views/Login';
import Main  from 'views/Main';
// 异步加载
const CreateAdv = resolve => require(['views/CreateAdv'], resolve);
const AdvList = resolve => require(['views/AdvList'], resolve);
const EditAdv = resolve => require(['views/EditAdv'], resolve);
const CreateCoupon = resolve => require(['views/CreateCoupon'], resolve);
const CouponList = resolve => require(['views/CouponList'], resolve);
const CouponInfo = resolve => require(['views/CouponInfo'], resolve);
const Test = resolve => require(['views/Test'], resolve);
const Gridding = resolve => require(['views/Gridding'],resolve);
const CreatePrice = resolve => require(['views/CreatePrice'],resolve);
const PriceRuleList = resolve => require(['views/PriceRuleList'],resolve);


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/main',
            component: Main,
            children: [
                {
                    path: '',
                    component: Home
                },
                {
                    path: 'home',
                    component: Home
                },
                {
                    path: 'createAdv',
                    component: CreateAdv
                },
                {
                    path: 'editAdv',
                    component: EditAdv
                },
                {
                    path: 'advList',
                    component: AdvList
                },
                {
                    path: 'createCoupon',
                    component: CreateCoupon
                },
                {
                    path: 'couponList',
                    component: CouponList
                },
                {
                    path: 'couponInfo',
                    component: CouponInfo
                },
                {
                    path: 'test',
                    component: Test
                },
                {
                    path: 'createPrice',
                    component: CreatePrice
                },
                {
                    path: 'priceList',
                    component: PriceRuleList
                }
            ]
        }
    ]
})
