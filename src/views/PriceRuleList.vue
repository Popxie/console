<template>
    <div class="pricing-rule container">
        <div class="block">
            <el-button type="primary" @click="routeToCreatePrice">创建计费规则</el-button>
            <span class="ib">
                <el-input placeholder="请输入内容" v-model="searchForm.nameContent">
                        <el-button icon="search"></el-button>
                    </el-input>
            </span>
            <span class="ib">
                <el-date-picker
                    v-model="timePeriod"
                    type="daterange"
                    placeholder="选择日期范围">
            </el-date-picker>
            </span>
            <span class="ib">
                <el-cascader
                    placeholder="请选择城市"
                    :options="options"
                    :show-all-levels="false"
                    v-model="selectedCity"
                ></el-cascader>
            </span>
            <el-button @click="searchPriceRule">搜索</el-button>
        </div>
        <div class="status-type-block">
            <span class="title">状态:</span>
            <div class="status-checkbox">
                <el-radio class="radio" v-model="searchForm.status" label="0">未上线</el-radio>
                <el-radio class="radio" v-model="searchForm.status" label="1">已上线</el-radio>
                <el-radio class="radio" v-model="searchForm.status" label="2">已过期</el-radio>
            </div>
            <span class="title">运营方式:</span>
            <div class="operation-checkbox">
                <el-radio class="radio" v-model="searchForm.operateWay" label="1">自营</el-radio>
                <el-radio class="radio" v-model="searchForm.operateWay" label="0">加盟商</el-radio>
            </div>
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
                label="规则名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="startTime"
                width="320"
                :formatter="timeFilter"
                label="活动时间">
            </el-table-column>
            <el-table-column
                prop="cityName"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="operateWay"
                :formatter="operateFilter"
                label="运营方式">
            </el-table-column>
            <el-table-column
                prop="type"
                :formatter="typeFilter"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="weekDays"
                :formatter="weekdayFilter"
                label="周惠日">
            </el-table-column>
            <el-table-column
                prop="status"
                :formatter="statusFilter"
                label="状态">
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="getModelDetail(scope.row.id)">详情</el-button>
                    <el-button type="text" size="small" @click="routeToEditPriceRule(scope.row)"
                               v-show="scope.row.status != 1">编辑
                    </el-button>
                    <el-button type="text" size="small" v-show="scope.row.status == 1"
                               @click="offlinePrice(scope.row.id)">停止
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="searchForm.page"
                :page-size="1"
                layout="total, prev, pager, next, jumper"
                :total="totalPages">
            </el-pagination>
        </el-row>
        <el-dialog
            title="当前规则模板详情"
            :visible.sync="dialogVisible"
            size="tiny">
            <div class="name">{{currentPriceDetail.name}}</div>
            <div class="intro" v-for="item in currentPriceDetail.valueArray">第{{item.minute}}分钟，需要{{item.value}}元</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>
    .container {
        background: #fff;
        padding: 20px;
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

    .el-pagination {
        margin-top: 10px;
    }

    .el-dialog .name {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
    }

    span.ib {
        display: inline-block;
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {Areas} from '../config/Areas'
    export default{
        data(){
            return {
                areas: Areas,
                selectedCity: [],
                dialogVisible: false,
                totalPages: 1,//总页数
                value: '',
                timePeriod: '',
                priceList: [],
                statusName: ['已上线', '未上线', '已过期'],
                searchForm: {
                    nameContent: '',
                    cityName: '',
                    startTime: '',
                    endTime: '',
                    status: '',
                    count: '10',
                    operateWay: '',
                    page: 1
                },
                currentPriceDetail: {
                    name: '',
                    valueArray: []
                }
            }
        },
        created() {
            let self = this;
            self.getPriceRuleList();
        },
        methods: {
            ...mapMutations({
                setCurPriceModel: 'SET_CUR_PRICE_MODEL'
            }),
            ...mapActions([
                'getPriceList',
                'offlineRule',
                'getRuleModelDetail'
            ]),
            handleCurrentChange(val) {
                let self = this;
                self.searchForm.page = val;
                self.getPriceRuleList();
            },
            //路由跳转到创建规则页面
            routeToCreatePrice() {
                let self = this;
                self.$router.push({path: 'createPrice'})
            },
            //路由跳转到编辑规则页面
            routeToEditPriceRule(item) {
                let self = this;
                self.setCurPriceModel(item);
                self.$router.push({path: 'editPriceRule'})
            },
            //
            getPriceRuleList() {
                let self = this;
                self.getPriceList(self.searchForm).then((res) => {
                    self.priceList = [];
                    self.priceList = self.priceList.concat(res.data.priceListData);
                    self.totalPages = Math.ceil(res.data.totalCount / self.searchForm.count);
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
                if (self.timePeriod) {
                    self.searchForm.startTime = new Date(self.timePeriod[0]).getTime() / 1000;
                    self.searchForm.endTime = new Date(self.timePeriod[1]).getTime() / 1000;
                }
                //如果选择了城市
                if (self.selectedCity) {
                    self.searchForm.cityName = self.selectedCity[1];
                }
                self.searchForm.page = 0;
                self.getPriceRuleList();
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
            //时间格式化
            timeFilter(row, column) {
                if (row.type === '3') {
                    return row.startDate + ' -- ' + row.endDate;
                }
                let start = row.startDate.split(' ')[0];
                return row.startDate.split(' ')[0] + ' -- ' + row.endDate.split(' ')[0]
            },
            //下线
            offlinePrice(id) {
                let self = this;
                self.offlineRule(id).then((res) => {
                    self.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success'
                    });
                    self.getPriceRuleList();
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });

            },
            //周惠日format
            weekdayFilter(row, column) {
                let weekday = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                if (row.type == '2') {
                    return weekday[row.weekDays - 1];
                }
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
        },
        computed: {
            options() {
                let self = this;
                let options = [];
                self.areas.forEach((item) => {
                    let children = [];
                    item.city.forEach((child) => {
                        children.push({
                            value: child.name + '市',
                            label: child.name + '市'
                        })
                    });
                    let obj = {
                        value: item.name,
                        label: item.name,
                        children: children
                    };
                    options.push(obj);
                });
                return options
            }
        }
    }
</script>
