<template>
    <div class="pricing-rule container">
        <div class="block">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-button type="primary" @click="toCreatePrice">创建计费规则</el-button>
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="请输入内容" v-model="searchForm.nameContent">
                        <el-button icon="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="timePeriod"
                        type="daterange"
                        clearable="true"
                        placeholder="选择日期范围">
                    </el-date-picker>
                </el-col>
                <el-col :span="4">
                    <el-button @click="searchPriceRule">搜索</el-button>
                </el-col>
            </el-row>
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
                prop="status"
                :formatter="statusFilter"
                label="状态">
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="getModelDetail(scope.row.id)">详情</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" v-show="scope.row.status == 1"
                               @click="offlineRule(scope.row.id)">停止

                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="1"
            layout="total, prev, pager, next"
            :total="totalPages">
        </el-pagination>
        <el-dialog
            title="当前规则模板详情"
            :visible.sync="dialogVisible"
            size="tiny"
            :before-close="handleClose">
            <div class="name">{{currentPriceDetail.name}}</div>
            <div class="intro" v-for="item in currentPriceDetail.valueArray">每{{item.minute}}分钟，需要{{item.value}}元</div>
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
</style>
<script>
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
                dialogVisible: false,
                currentPage: 1, //当前第几页
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
                    page: 0
                },
                currentPriceDetail: {
                    name: '',
                    valueArray: []
                }
            }
        },
        created() {
            let self = this;

            self.getPriceList(self.searchForm).then((res) => {
                console.log(res);
                self.priceList = self.priceList.concat(res.data.priceListData);
                self.totalPages = res.data.totalCount;
                self.$notify({
                    title: '成功',
                    message: '加载完成',
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
        computed: {
//            ...mapGetters([
//                'priceList'
//            ])
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            ...mapActions([
                'getPriceList',
                'offlineRule',
                'getRuleModelDetail'
            ]),
            toCreatePrice() {
                let self = this;
                self.$router.push({path: 'createPrice'})
            },
            //检索计费规则
            searchPriceRule() {
                let self = this;
                if(self.timePeriod) {
                    self.searchForm.startTime = new Date(self.timePeriod[0]).getTime()/1000;
                    self.searchForm.endTime = new Date(self.timePeriod[1]).getTime()/1000;
                }
                self.searchForm.page = 0;
                self.getPriceList(self.searchForm).then((res) => {
                    console.log(res);
                    self.priceList = [];
                    self.priceList = self.priceList.concat(res.data.priceListData);
                    self.totalPages = res.data.totalCount;
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
            //
            timeFilter(row, column) {
                let timeList = [row.startTime, row.endTime];
                return row.startTime
                return new Date(parseInt(row.startTime) * 1000);
                let formatTime = '';
                timeList.forEach((item) => {
                    let time = new Date(item);
                    formatTime += time.getFullYear() + '-' + time.getMonth() + 1 + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + '';
                });
                return formatTime;
            },
            //下线
            offlinePrice(id) {
                let self = this;
                self.offlineRule(id).then((res) => {
                    let data = res.data;
                    console.log(data);
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
                    console.log(data);
                    let valueArray = data.value.split('-');
                    let minute = valueArray[0] / 60;
                    let value = valueArray[1];
                    console.log(minute);
                    self.currentPriceDetail = {
                        name: data.name,
                        valueArray: [{
                            value: value,
                            minute: minute,
                        }]
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
