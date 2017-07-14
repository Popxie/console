<template>
    <div class="vip-card container">
        <div class="block">
            <span>
                <el-button type="primary" @click="routeToCreate">创建会员卡</el-button>
            </span>
            <span class="ml20">
                <el-radio-group v-model="searchForm.type">
                    <el-radio label="21">月卡</el-radio>
                    <el-radio label="22">半年卡</el-radio>
                </el-radio-group>
            </span>
            <span>
                <el-button @click="searchVipCard">搜索</el-button>
            </span>
        </div>
        <el-table
            :data="vipCardList">
            <el-table-column
                prop="name"
                label="会员卡名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="ruleTitle"
                label="规则名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="ruleContent"
                label="规则内容"
                width="180">
            </el-table-column>
            <el-table-column
                prop="type"
                :formatter="typeFilter"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="status"
                :formatter="statusFilter"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="canUseCounts"
                :formatter="useCountsFilter"
                label="可使用次数">
            </el-table-column>
            <el-table-column
                prop="originalPrice"
                label="原价">
            </el-table-column>
            <el-table-column
                prop="price"
                label="惊爆价">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" v-show="scope.row.status == 1"
                               @click="offline(scope.row.id)">下线
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
    .container {
        background: #fff;
        padding: 20px;
    }

    .block {
        margin-bottom: 20px;
    }

    .status-type-block {
        margin: 20px 0;
    }

    .status-type-block .title {
        font-size: 14px;
    }

    .status-checkbox, .operation-checkbox {
        display: inline-block;
        margin: 0 20px;
    }
    .ml20 {
        margin-left: 20px;
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                searchForm: {
                    type: ''
                },
            }
        },
        created() {
            let self = this;
            self.getVipCardList();
        },
        computed: {
          ...mapGetters([
              'vipCardList'
            ])
        },
        methods: {
            ...mapActions([
                'getVipCardList',
                'offlineVipCard'
            ]),
            //路由跳转到创建优惠券页面
            routeToCreate() {
                let self = this;
                self.$router.push({path: 'createCoupon'})
            },
            //
            getCard() {
                let self = this;
                self.getVipCardList(self.searchForm).then((res) => {
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: '失败',
                        type: 'error'
                    });
                });
            },
            //增加 搜索计费规则条件
            searchVipCard() {
                let self = this;
                self.getCard();
            },
            //下线
            offline(id) {
                let self = this;
                self.offlineVipCard(id).then((res) => {
                    let data = res.data;
                    self.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success'
                    });
                    self.getVipCardList();
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });

            },
            typeFilter(row, column){
                if(row.type === '21') {
                    return '月卡'
                } else {
                    return '半年卡'
                }
            },
            statusFilter(row, column){
                if(row.status === '1') {
                    return '进行中'
                } else {
                    return '已下线'
                }
            },
            useCountsFilter(row, column){
                if(row.canUseCounts === '1000000') {
                    return '无限次'
                } else {
                    return row.canUseCounts + '次'
                }
            }
        }
    }
</script>
