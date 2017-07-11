<template>
    <div class="vip-card container">
        <div class="block">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-button type="primary" @click="routeToCreate">创建会员卡</el-button>
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="请输入内容" v-model="searchForm.nameContent">
                        <el-button icon="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="searchPriceRule">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
            :data="priceList">
            <el-table-column
                prop="id"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="会员卡名称"
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
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" v-show="scope.row.status == 1"
                               @click="offlineRule(scope.row.id)">下线
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
</style>
<script>
    import {mapGetters, mapActions,mapMutations} from 'vuex'
    export default{
        data(){
            return {
                dialogVisible: false,
                totalPages: 1,//总页数
                value: '',
                timePeriod: '',
                priceList: [],
                statusName: ['已上线', '未上线', '已过期'],
                searchForm: {
                    nameContent: '',
                    status: ''
                },
                currentPriceDetail: {
                    name: '',
                    valueArray: []
                }
            }
        },
        created() {
            let self = this;
//            self.getVipCardList();
        },
        methods: {
            ...mapActions([
                'getVipCardList',
                'offlineRule'
            ]),
            //路由跳转到创建优惠券页面
            routeToCreate() {
                let self = this;
                self.$router.push({path: 'createCoupon'})
            },
            //
            getCard() {
                let self = this;
                return;
                self.getVipCardList(self.searchForm).then((res) => {
                    self.priceList = [];
                    self.priceList = self.priceList.concat(res.data.priceListData);
                    self.totalPages = Math.ceil(res.data.totalCount/self.searchForm.count);
//                    self.totalPages = parseInt(res.data.totalCount);
                    self.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success'
                    });
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });
            },
            //增加 搜索计费规则条件
            searchPriceRule() {
                let self = this;
                if(self.timePeriod) {
                    self.searchForm.startTime = new Date(self.timePeriod[0]).getTime()/1000;
                    self.searchForm.endTime = new Date(self.timePeriod[1]).getTime()/1000;
                }
                self.searchForm.page = 0;
                self.getCard();
            },
            //状态
            statusFilter(row, column) {
                let status = ['未上线', '已上线', '已过期'];
                if (!row.status) return '';
                return status[row.status];
            },
            //运营方式
            operateFilter(row, column) {
                let status = ['加盟商', '自营'];
                if (!row.operateWay) return '';
                return status[row.operateWay];
            },
            //计费type
            typeFilter(row, column) {
                let status = ['统一计价', '周惠', '优惠日'];
                if (!row.type) return '';
                return status[row.type - 1];
            },
            //下线
            offlinePrice(id) {
                let self = this;
                self.offlineRule(id).then((res) => {
                    let data = res.data;
                    self.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success'
                    });
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });

            },
            //获取详情
            getModelDetail(id) {
                let self = this;
                self.getRuleModelDetail(id).then((res) => {
                    self.dialogVisible = true;
                    let data = res.data;
                    let modelValueArray = data.value.split(',');
                    let valueArray = [];
                    modelValueArray.forEach((item) => {
                        console.log(item);
                        let valueMinute = item.split('-');
                        valueArray.push({
                            value: valueMinute[1],
                            minute: valueMinute[0] / 60
                        })
                    });

                    self.currentPriceDetail = {
                        name: data.name,
                        valueArray: valueArray
                    };
                    self.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success'
                    });
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });
            }
        }
    }
</script>
