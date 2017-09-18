<template>
    <div class="vip-card container">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
    
        <p style="padding-bottom: 15px">活动配置/活动配置</p>
        <el-row :gutter="5">
            <el-col :span="24" style="margin-bottom: 10px">
                <div class="grid-content">
                    <span style="margin-right: 15px">创建日期</span>
                    <el-date-picker
                        v-model="dataObj.dateRange"
                        type="daterange"
                        @change="dateBlur"
                        placeholder="选择日期范围">
                    </el-date-picker>
    
                    <span style="margin: 0 12px">活动主题</span>
                    <el-input class="el-inputs" v-model="dataObj.themeName" placeholder="请输入活动主题"></el-input>
    
                    <span style="margin: 0 12px">地区</span>
                    <el-button  @click="chooseAreaClick">请选择投放地区</el-button>
                    <span style="margin: 0 12px">状态</span>
                    <el-select v-model="dataObj.status" class="select" placeholder="请选择">
                        <el-option
                            v-for="item in stateOptions"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                
                    <el-button class="btn btn-left" @click="searchClick">查询</el-button>
                    <el-button class="btn btn-right" @click="CreateActivityClick">创建活动</el-button>
                </div>
            </el-col>
        </el-row>
        <el-table
            :data="activityList"
            border
        >
            <el-table-column
                prop="name"
                label="活动名称"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="activityTime"
                label="活动时间"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="picUrl"
                label="活动图片"
                align="center"
                width="100">
                <template scope="scope">
                    <img style="width:30px;height: 20px" :src= scope.row.picUrl alt="">
                </template>

            </el-table-column>
        
            <el-table-column
                prop="areaName"
                label="地区"
                align="center"
                width="100">
            </el-table-column>
        
            <el-table-column
                prop="electricFenceId"
                align="center"
                label="电子围栏">
            </el-table-column>
    
            <el-table-column
                prop="gmtTime"
                align="center"
                label="创建时间">
            </el-table-column>
            
            <el-table-column
                prop="status"
                align="center"
                width="130"
                label="状态">
            </el-table-column>
        
        
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small"
                               @click="modifyClick(scope.row.activityId)">修改
                    </el-button>
                    <el-button type="text" size="small"
                               @click="onlineClick(scope.row.activityId)">上线
                    </el-button>
                    <el-button type="text" size="small"
                               @click="offlineClick(scope.row.activityId)">下线
                    </el-button>
                    <el-button type="text" size="small"
                               @click="detailsClick(scope.row.activityId)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import SelectAreas from '../components/SelectArea.vue'

    export default {
    components: {
        SelectAreas,
    },
    data() {
      return {
          dialogVisible: false,       // 控制是否显示 选择地址的 dialog
          cityCodeArr: [],
          page: {
              currentPage: 1,
              pageSize: 10,
          },
          // 查询时发送的对象
          dataObj: {
              dateRange: '',          // 时间范围 (传给接口的时候不能将这个字段的值传过去，(Sat Sep 16 2017 00:00:00 GMT+0800 (CST)))
              startDate: '',
              endDate: '',
              name: '',          // 活动主题
              areaCode: '',
              status: '',          // 卡状态
          },
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
                  label: '已上线',
              },
              {
                  value: 3,
                  label: '已结束',
              },
              {
                  value: 2,
                  label: '已下线',
              },
    
          ],
      }
    },
        computed: {
            ...mapGetters([
                'activityList',
                'recordsTotal'
            ])
        },
      created() {
        this.getActivityList(this.page);
      },
      methods: {
          ...mapActions([
              'getActivityList',
          ]),
          dateBlur(res) {
              console.debug(res);
          },
    
          chooseAreaClick() {
              this.dialogVisible = true;
          },
          cancelSelect () {
              let self = this;
              self.dialogVisible = false;
          },
          setAreas(val) {
              let self = this;
              if (!val.provinces.length) {
                  self.$notify({
                      title: '提示',
                      message: '请选择省份',
                      type: 'info'
                  });
                  return;
              }
              // 获取cityCode
              for(let i = 0; i < val.provinces.length; i++){
                  self.cityCodeArr.push(val.provinces[i].cityCode);
              }
              self.dataObj.areaCode = self.cityCodeArr.toString();
              console.debug('cityCode',self.dataObj.areaCode);
              self.dialogVisible = false;
          },
          
          searchClick() {
              let self = this;
              console.debug(self.dataObj.dateRange);
              self.$router.push();
          },
          CreateActivityClick() {
              this.$router.push('createActivity');
          },
          handleSizeChange(val) {
              let self = this;
              self.page.pageSize = val;
              self.getAcList(self.page);
          },
          handleCurrentChange(val) {
              let self = this;
              self.page.currentPage = val;
              self.getAcList(self.page);
          },
          modifyClick(activityId) {
              this.$router.push({
                  path: 'editActivity',
                  query: {
                      activityId: activityId,
                      isFromWhere: 'modify'
                  }
              })
          },
          // 获取活动列表
          getAcList(params) {
              this.getActivityList(params)
                  .then(() => {},((err)=> {
                      this.$notify({
                          title: '登陆已失效',
                          message: err,
                          type: 'error'
                      })
                   }))
          },
      }
    
  }
</script>

<style lang="less">

</style>
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
        width: 150px !important;
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
        background: rgba(22, 155, 213, 1);
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
