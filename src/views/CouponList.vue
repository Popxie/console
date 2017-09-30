<template>
    <div class="container">
        <Confirm :show-confirm="showConfirm" :message="message" text-align="center" @confirm="updateStatus"
                 @cancel="cancel"/>
        <el-row class="btn-m" :gutter="30">
            <el-col :span="3">
                <el-button type="primary" @click="()=> $router.push('createCoupon')">创建优惠券</el-button>
            </el-col>
            <el-col :span="4">
                <el-input style="width: 100%" placeholder="输入发券活动主题搜索" v-model="page.topic"
                          @keyup.enter.native="getConponL">
                    <el-button slot="append" icon="search" @click="getConponL"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-select style="width: 100%" v-model="page.isNewuserUse" placeholder="是否仅新用户可用" @change="getConponL">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="是" :value="'1'"></el-option>
                    <el-option label="否" :value="'0'"></el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select style="width: 100%" v-model="page.status" placeholder="劵的状态" @change="getConponL">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="已生成" value="1"></el-option>
                    <el-option label="已下线" value="2"></el-option>
                    <el-option label="已过期" value="3"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-tabs v-model="page.type" @tab-click="changeType">
                    <template v-for="tap in taps">
                        <el-tab-pane :label="tap.task" :name="tap.value">
                            <el-table
                                :data="couponList"
                                border
                                style="width: 100%;text-align: center">
                                <el-table-column
                                    fixed
                                    label="劵批次"
                                    prop="batchNo"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="发券活动主题"
                                    prop="topic"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="劵类型"
                                    prop="type"
                                    width="150"
                                    :formatter="typeFilter"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="有效地域"
                                    width="150">
                                    <template scope="scope">
                                        <div v-show="scope.row.areaType == 0">
                                            全域
                                        </div>
                                        <div v-show="!(scope.row.areaType == 0)" class="citys">
                                            <el-tooltip placement="top">
                                                <div slot="content">
                                                    <div style="width: 200px;font-size: 13px;">{{scope.row.cityName}}</div>
                                                </div>
                                                <span>{{scope.row.cityName}}</span>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="是否仅新用户可用"
                                    prop="isNewuserUse"
                                    width="150"
                                    :formatter="isNewuserUseFilter"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="单用户可领用/兑换上限张数"
                                    prop="limitSize"
                                    width="150"
                                    :formatter="returnLimitSize">
                                </el-table-column>
                                <el-table-column
                                    label="券过期时间"
                                    prop="endDate"
                                    width="150">
                                </el-table-column>
                                <el-table-column v-if="page.type != 3 && page.type != 0  "
                                    label="券的面额（元)"
                                    prop="allDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column v-if="page.type == 3"
                                                 label="券的折扣（折)"
                                                 prop="allDenomination"
                                                 width="150">
                                </el-table-column>
                                <el-table-column v-if="page.type == 0 "
                                                 label="券的面额或者折扣"
                                                 prop="allDenomination"
                                                 width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券总张数"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="领用张数（线上)"
                                    prop="receivedNum"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="兑换张数"
                                    prop="exchangedNum"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="充值张数"
                                    prop="rechargeNum"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券生成时间"
                                    prop="createDate"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="状态"
                                    prop="status"
                                    :formatter="statusFilter"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="查看劵码"
                                    width="150">
                                    <template scope="scope">
                                        <el-button
                                            size="small"
                                            type="text"
                                            @click="routeToEdit(scope.$index, scope.row)">查看劵码
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200"
                                >
                                    <template scope="scope">
                                        <el-button v-if="scope.row.status == 1"
                                                   size="small"
                                                   @click="handleEdit(scope.$index, scope.row, 'edit')">执行下线

                                        </el-button>
                                        <el-button v-if="scope.row.status == 2"
                                                   size="small"
                                                   @click="handleEdit(scope.$index, scope.row, 'edit')">执行再次上线

                                        </el-button>
                                        <el-button
                                            v-if="scope.row.status != 4 && scope.row.status != 1"
                                            size="small"
                                            type="danger"
                                            @click="handleEdit(scope.$index, scope.row, 'delete')">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </template>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row type="flex" justify="end">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="recordsTotal">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import Confirm from '../components/Confirm.vue';
    export default{
        components: {
            Confirm
        },
        data() {
            return {
                taps: [{
                    task: '全部',
                    value: ''
                }, {
                    task: '充值劵',
                    value: '1'
                }, {
                    task: '抵扣劵',
                    value: '2'
                }, {
                    task: '折扣劵',
                    value: '3'
                }],
                query: {},
                isShowCitys:false,
                operationType: '',
                showConfirm: false,
                message: '',
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    topic: '',
                    isNewuserUse: '',
                    status: '',
                    type: '',
                }
            }
        },
        computed: {
            ...mapGetters({
                couponList: 'getCouList',
                recordsTotal: 'getConRecordsTotal'
            })
        },
        methods: {
            ...mapActions([
                'getConponList',
                'deleteConponById',
                'updateConponStatusById',
                'deleteConponById'
            ]),
            getCoupons(params) {
                this.getConponList(params).then(()=> {
                },((err)=> {
                    this.$notify({
                        title: '登陆已失效',
                        message: err,
                        type: 'error'
                    });
                }))
            },
            showCitys(){
              this.isShowCitys = ! this.isShowCitys;
            },
            cancel() {
                this.showConfirm = false;
            },
            changeType(tab, event) {
                let self = this;
                self.page.currentPage = 1;
                self.page.pageSize = 10;
                self.getCoupons(self.page);
            },
            routeToEdit(index, row) {
                let self = this;
                self.$router.push({path: 'couponInfo', query: {id: row.id, type: row.type}})
            },
            typeFilter(row, column) {
                let types = ['充值劵', '抵扣劵', '折扣劵'];
                if (!row.type) return '';
                return types[row.type - 1];
            },
            isNewuserUseFilter(row, column) {
                let isNewuserUse = ['否', '是'];
                return isNewuserUse[row.isNewuserUse];
            },
            returnLimitSize(row, column) {
            	if(row.limitSize != -1) return row.limitSize;
            	return '不限';
            },
            statusFilter(row, column) {
                let status = ['已生成', '已下线', '已过期', '已删除'];
                if (!row.status) return '';
                return status[row.status - 1];
            },
            //执行上下线
            handleEdit(index, row, type) {
                let self = this;
                self.query = {
                    id: row.id,
                    status: row.status,
                    del: 'edit'
                };
                self.operationType = type;
                self.showConfirm = true;
                type == 'edit' ? self.message = '是否确定执行此操作？' : self.message = '是否确定删除该优惠券？';
            },
            updateStatus() {
                let self = this;
                self.showConfirm = false;
                if (self.operationType == 'edit') {
                    self.updateConponStatusById(self.query)
                        .then((data) => {
                            self.$notify({
                                title: '成功',
                                message: '执行成功',
                                type: 'success'
                            })
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            })
                        });
                } else {
                    // 删除
                    self.query.del = 'del';
                    self.deleteConponById(self.query)
                        .then((data) => {
                            self.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            })
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            })
                        });
                }

            },
            handleSizeChange(val) {
                let self = this;
                self.page.pageSize = val;
                self.getCoupons(self.page);
            },
            handleCurrentChange(val) {
                let self = this;
                self.page.currentPage = val;
                self.getCoupons(self.page);
            },
            getConponL(){
            	let self = this;
                self.getCoupons(self.page);
            }
        },
        mounted() {
            let self = this;
            self.getCoupons(self.page);
        }
    }
</script>
<style>
    .cell {
        visibility: visible !important;
    }
</style>
<style scoped>
    .container {
        padding-top: 10px;
        background-color: #fff;
        height: 100%;
    }
    .citys{
        height:25px;
        overflow: hidden;
    }
    .btn-m {
        margin-bottom: 10px;
        margin-left: 10px !important;
    }
</style>
