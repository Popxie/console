<template>
    <div class="vip-card container">
        <!--上、下线的dialog-->
        <el-dialog
            title="提示"
            v-model="dialogConfirmOff"
            size="tiny">
            <span v-if="showOnline">您确定要上线吗？？</span>
        
            <span v-else >您确定要下线吗？？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirmOff = false">取 消</el-button>
                <el-button type="primary" @click="confirmClick">确 定</el-button>
            </span>
        </el-dialog>
        
        <p style="padding-bottom: 15px">优惠券管理/会员卡列表</p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="会员卡活动" name="first"></el-tab-pane>
            <el-tab-pane label="自营会员卡" name="second"></el-tab-pane>
        </el-tabs>
        
        <el-row :gutter="5">
            <el-col :span="18" style="margin-bottom: 10px">
                <div class="grid-content">
                    <span>会员卡名称</span>
                    <el-input class="el-inputs" v-model="dataObj.name" placeholder="请输入会员卡名称"></el-input>
                    
                    <span>状态</span>
                    <el-select v-model="dataObj.cardStatus" class="select" placeholder="请选择">
                        <el-option
                            v-for="item in stateOptions"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    
                    <span>卡的类型</span>
                    <el-select v-model="dataObj.type" class="select" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    
                    <el-button class="btn btn-left" @click="searchVipCard">查询</el-button>
                    <el-button class="btn btn-right" type="info" @click="routeToCreate">创建活动</el-button>
                </div>
            </el-col>
        </el-row>
        
        <el-table
            :data="vipCardList"
            border
        >
            <el-table-column
                v-if="showActivity"
                prop="batchNo"
                label="批次号"
                align="center"
                width="120">
            </el-table-column>
            
            <el-table-column
                prop="name"
                align="center"
                label="会员卡名称">
            </el-table-column>
            
            <el-table-column
                v-if="showActivity"
                prop="isNewuserUse"
                label="是否是新用户"
                :formatter="isNewUserFilter"
                align="center"
                width="130">
            </el-table-column>
            
            <el-table-column
                v-if="!showActivity"
                prop="ruleTitle"
                label="规则名称"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                v-if="!showActivity"
                prop="ruleContent"
                label="规则内容"
                align="center"
                width="180">
            </el-table-column>
            
            <el-table-column
                v-if="showActivity"
                prop="oneReceiveCountMax"
                label="单用户领取上限"
                align="center"
                width="140">
            </el-table-column>
            
            <el-table-column
                prop="type"
                :formatter="typeFilter"
                width="130"
                align="center"
                label="类型">
            </el-table-column>
    
            <el-table-column
                prop="canUseCounts"
                :formatter="useCountsFilter"
                width="130"
                align="center"
                label="可使用次数">
            </el-table-column>
            
    
            <el-table-column
                v-if="showActivity"
                prop="expireDays"
                align="center"
                label="活动时间">
            </el-table-column>
    
            <el-table-column
                v-if="!showActivity"
                prop="originalPrice"
                align="center"
                label="原价">
            </el-table-column>
            
            <el-table-column
                v-if="!showActivity"
                prop="price"
                align="center"
                label="惊爆价">
            </el-table-column>
            
            <el-table-column
                prop="status"
                :formatter="statusFilter"
                align="center"
                width="130"
                label="状态">
            </el-table-column>
           
            
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" v-show="scope.row.status == 0 || scope.row.status == 4"
                               @click="modifyClick(scope.row.id)">修改
                    </el-button>
                    <el-button type="text" size="small" v-show="scope.row.status == 0 || scope.row.status == 4"
                               @click="onlineClick(scope.row.id, '1')">上线
                    </el-button>
                    <el-button type="text" size="small" v-show="scope.row.status == 1 || scope.row.status == 3"
                               @click="onlineClick(scope.row.id, '0')">下线
                    </el-button>
                    <el-button type="text" size="small"
                               @click="detailsClick(scope.row.id)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                dialogConfirmOff: false,
                showOnline: false,
                searchForm: {
                    type: ''
                },
                // 查询时发送的对象
                dataObj: {
                    name: '',          // 卡名称
                    cardStatus: '',     // 卡状态
                    type: '',           // 卡类型
                    sourceFrom: 2,     // 来源 (默认活动)
                },
                // 上下线
                params: {},
                stateOptions: [
                    {
                        value: '',
                        label: '全部',
                    },
                    {
                        value: 0,
                        label: '未上线',
                    },
                    {
                        value: 1,
                        label: '进行中',
                    },
                    {
                        value: 3,
                        label: '活动已结束',
                    },
                    {
                        value: 4,
                        label: '已下线',
                    },
                    
                ],
                typeOptions: [
                    {
                        value: '',
                        label: '全部',
                    },
                    {
                        value: 21,
                        label: '月卡',
                    },
                    {
                        value: 22,
                        label: '半年卡',
                    },
                    {
                        value: 24,
                        label: '次卡',
                    },
                ],
                showActivity: true,     // 是否显示活动会员卡 table
                activeName: 'first',
            }
        },
        created() {
            let self = this;
            if(self.$route.query.isFrom === 'self-support') {
                self.showActivity = false;
                self.dataObj.sourceFrom = 1;
                self.activeName = 'second';
            }
            if(this.showActivity) {
                self.dataObj.sourceFrom = 2;
            } else {
                self.dataObj.sourceFrom = 1;
            }
            self.getVipCardList(self.dataObj);
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
    
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            
            /**
             * 格式化参数
             * @param obj
             * @returns {string}
             */
            parseParams: function (obj) {
                var str = '';
                Object.keys(obj).map(function (key) {
                    if (obj[key]) {
                        str += '&' + key + '=' + obj[key];
                    }
                });
                return str.substring(1);
            },
            //
            handleClick() {
                let self = this;
                self.showActivity = !self.showActivity;
                if(self.showActivity) {
                    self.dataObj.sourceFrom = 2;
                } else {
                    self.dataObj.sourceFrom = 1;
                }
                self.getVipCardList(self.dataObj);
    
            },
            //路由跳转到创建优惠券页面
            routeToCreate() {
                let self = this;
                self.$router.push({path: 'createCoupon'})
            },
           
            //查询
            searchVipCard() {
                let self = this;
                self.getVipCardList(this.dataObj);
            },
            
            // 修改
            modifyClick(id) {
                if(this.dataObj.sourceFrom === 2) {
                    this.$router.push({
                        path: 'editVipCardActivity',
                        query: {
                            id: id,
                            isFromWhere: 'modify'
                        }
                    })
                } else {
                    this.$router.push({
                        path: 'editVipCard',
                        query: {
                            id: id,
                            isFromWhere: 'self_support_modify'
                        }
                    })
                }
            },
            // 详情
            detailsClick(id) {
                if(this.dataObj.sourceFrom === 2) {
                    this.$router.push({
                        path: 'editVipCardActivity',
                        query: {
                            id: id,
                            isFromWhere: 'details'
                        }
                    })
                } else {
                    this.$router.push({
                        path: 'editVipCard',
                        query: {
                            id: id,
                            isFromWhere: 'self_support_details'
                        }
                    })
                }
                
            },
    
            // 上/下线
            onlineClick(id, inx) {
                let self = this;
                this.dialogConfirmOff = true;
                inx === '0' ? this.showOnline = false : this.showOnline = true;
                self.params = {
                    id: id,
                    type: inx,
                };
            },
    
            confirmClick() {
                let self = this;
                self.offlineVipCard(self.parseParams(self.params))
                    .then((res) => {
                        self.$nextTick(() => {
                            self.getVipCardList(self.dataObj);
                        });
                        self.alertFn('成功', res.msg, 'success');
                        this.dialogConfirmOff = false;
                    }, (err) => {
                        self.alertFn('失败', err.msg, 'error');
                    });
            },
            
            typeFilter(row){
                if(row.type === '21') {
                    return '月卡'
                } else {
                    return '半年卡'
                }
            },
            isNewUserFilter(row) {
                if(row.isNewuserUse === 0) {
                return '否';
                } else {
                    return '是';
                }
            },
            statusFilter(row){
                switch (row.status) {
                    case '0':
                        return '未上线';
                    break;
                    case '1':
                        return '进行中';
                        break;
                    case '2':
                        return '已过期';
                        break;
                    case '3':
                        return '活动已结束';
                        break;
                    case '4':
                        return '已下线';
                        break;
                }
            },
            useCountsFilter(row){
                if(row.canUseCounts === '1000000' || row.canUseCounts === 'null') {
                    return '无限次'
                } else {
                    return row.canUseCounts + '次'
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .container {
        background: #fff;
        padding: 20px;
    }
    .grid-content {
        height:36px;
        line-height: 36px;
        display: flex;
    }
    .el-inputs {
        padding-left: 5px;
        width: 150px !important;
        margin-right: 20px;
    }
    .select {
        padding-left: 5px;
        width: 90px !important;
        margin-right: 20px;
    }
    .btn {
        width: 88px !important;
    }
    .btn-left {
        margin: 0 30px;
        margin-right: 20px;
    }
    .btn-right {
        color: white;
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
<style lang="less">
    .vip-card {
        .el-tabs__header {
            border: none ;
        }
    }
</style>


