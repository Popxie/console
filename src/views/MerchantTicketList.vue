<template>
	<div class="merchant-list-cont">
        
        <div style="display: flex;height: 36px;width: 100%;line-height: 36px;margin-bottom: 15px">
            <el-input class="el-inputs" v-model="dataObj.topic" placeholder="请输入券活动主题"></el-input>
    
            <el-select v-model="dataObj.isNewPerson" class="is-new-user" placeholder="是否仅新用户可用">
                <el-option
                    v-for="item in isNewOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            
            <el-select v-model="dataObj.status" class="select" placeholder="券的状态">
                <el-option
                    v-for="item in stateOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button class="btn" type="primary" @click="searchClick">搜索</el-button>
            <el-button class="btn" type="primary" @click="() => { $router.push('createCoupon') }">创建商家券</el-button>
        </div>
        
        <el-tabs v-model="couponType" @tab-click="handleClick">
            <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.value">全部</el-tab-pane>
        </el-tabs>
        
        <el-table
            :data="merchantList"
            border
        >
            <el-table-column
                prop="batchNo"
                label="券批次"
                align="center"
                width="110"
            >
                <template scope="scope">
                    <el-button
                        size="small" type="text"
                        @click="toDetailsClick(scope.$index, scope.row)"
                    >
                        {{scope.row.batchNo}}
                    </el-button>
                </template>
            </el-table-column>
            
            <el-table-column
                prop="topic"
                label="发券活动主题"
                align="center"
            >
            </el-table-column>
    
            <el-table-column
                prop="couponTypeName"
                label="券类型"
                align="center"
            >
            </el-table-column>
            
            <el-table-column
                prop="cityName"
                label="有效地域"
                align="center"
            >
            </el-table-column>
            
            <el-table-column
                prop="isNewuserUse"
                align="center"
                label="是否仅新用户可用"
            >
            </el-table-column>
            
            <el-table-column
                prop="exchangedNum"
                align="center"
                label="单用户可领用/兑换上限张数"
            >
            </el-table-column>
            
            <el-table-column
                prop="formatEffectiveTime"
                align="center"
                width="130"
                label="使用期限"
            >
            </el-table-column>
            
            <el-table-column
                prop="allDenomination"
                align="center"
                label="券面额"
            >
            </el-table-column>
            
            <el-table-column
                prop="totalDenomination"
                align="center"
                label="券总张数"
            >
            </el-table-column>
            
            <el-table-column
                prop="receivedNum"
                align="center"
                label="领用张数(线上)"
            >
            </el-table-column>
            
            <el-table-column
                prop="status"
                align="center"
                label="兑换张数"
            >
            </el-table-column>
            
            <el-table-column
                prop="formatCreateTime"
                align="center"
                label="券生成时间"
            >
            </el-table-column>
            
            <el-table-column
                prop="couponBatchStatus"
                align="center"
                label="状态"
            >
            </el-table-column>
            <el-table-column
                prop="status"
                align="center"
                label="查看券码"
            >
            </el-table-column>
            
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="modifyClick(scope.row.activityId)">修改</el-button>
                    <el-button type="text" size="small" @click="onlineClick(scope.row.activityId)" >上线</el-button>
                    <el-button type="text" size="small" @click="offlineClick(scope.row.activityId)">下线</el-button>
                    <el-button type="text" size="small" @click="delClick(scope.row.activityId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <el-row type="flex" justify="end">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.page"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-row>
    
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';

    export default {
    components: {},
    data() {
      return {
          couponType: '-1',        // 组件绑定的值必须是字符串 但是接口接收的是 num 最后记得转换下
          
          stateOptions: [
              {
                  value: 1,
                  label: '可用',
              },
              {
                  value: 2,
                  label: '失效',
              },
              {
                  value: 3,
                  label: '已使用',
              },
          ],
          isNewOptions: [
              {
                  value: 0,
                  label: '否'
              },
              {
                  value: 1,
                  label: '是'
              }
          ],
          testList: [
              {
                  batchId: '2222',
                  couponNo: '123123',
                  couponName: '而我翁人',
                  cityName: '杭州',
                  isNewUserUse: '否',
                  allDenomination: '100',
                  expirationTimeStart: '2017.3.29-2017.04.10',
                  couponCreateTime: '2017.3.29',
                  isUse: '未领用',
                  status: '已使用'
              },
              {
                  batchId: '2222',
                  couponNo: '123123',
                  couponName: '而我翁人',
                  cityName: '杭州',
                  isNewUserUse: '否',
                  allDenomination: '100',
                  expirationTimeStart: '2017.3.29-2017.04.10',
                  couponCreateTime: '2017.3.29',
                  isUse: '未领用',
                  status: '已使用'
              },
              {
                  batchId: '2222',
                  couponNo: '123123',
                  couponName: '而我翁人',
                  cityName: '杭州',
                  isNewUserUse: '否',
                  allDenomination: '100',
                  expirationTimeStart: '2017.3.29-2017.04.10',
                  couponCreateTime: '2017.3.29',
                  isUse: '未领用',
                  status: '已使用'
              }
          ],
          // 查询时发送的对象
          dataObj: {
              dateRange: '',          // 时间范围 (传给接口的时候不能将这个字段的值传过去，(Sat Sep 16 2017 00:00:00 GMT+0800 (CST)))
              startDate: '',
              endDate: '',
              topic: '',          // 活动主题
              status: null,
              isNewPerson: null,
          },
    
          tabs: [
              {
                  label: '全部',
                  value: '-1',
              },
              {
                  label: '兑换券',
                  value: '1',
              },
              {
                  label: '折扣券',
                  value: '2',
              },
              {
                  label: '代金券',
                  value: '3',
              },
          ],
          page: {
              couponType: -1,
              page: 1,
              size: 10,
          },
      }
    },
    computed: {
        ...mapGetters([
            'merchantList',
            'total'
        ])
    },
    created() {
        this.getMerchantList(this.page);
    },
    methods: {
        ...mapActions([
            'getMerchantList'
        ]),
        handleClick(val) {
            // this.couponType = Number(this.couponType);
            switch (val.index) {
                case 0:
                    this.page.couponType = -1;
                    break;
                case 1:
                    this.page.couponType = 1;
                    break;
                case 2:
                    this.page.couponType = 2;
                    break;
                default:
                    this.page.couponType = 3;
            }
            this.getMerchantList(this.page);
        },
        searchClick() {
            console.debug('搜索');
        },
        toDetailsClick(index, val) {
            console.debug(index);
            console.debug(val);
            this.$router.push(
                {
                    path: 'merchantTicketDetails',
                    query: {
                        batchId: val.batchNo,
                    }
                }
            )
        },
        handleSizeChange(val) {
            let self = this;
            self.page.size = val;
            self.getMerchantList(self.page);
        },
        handleCurrentChange(val) {
            let self = this;
            self.page.page = val;
            self.getMerchantList(self.page);
        },
    }
    
  }
</script>

<style lang="less">
    .merchant-list-cont {
        background: #fff;
        padding: 20px;
        .el-inputs {
            width: 175px !important;
            margin-left: 15px;
        }
        .is-new-user {
            margin-left: 15px;
            width: 150px;
        }
        .select {
            margin-left: 15px;
            width: 100px;
        }
        .btn {
            margin-left: 15px;
        }
        .el-input__inner {
            padding-right: 20px;
        }
        .el-tabs__header {
            border: none ;
        }
        .el-tab-pane {
            display: none;
        }
    }
    
</style>
