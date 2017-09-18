<template>
    <div class="vip-card container">
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
                    <el-input class="el-inputs" v-model="dataObj.themeName" placeholder="请选择投放地区"></el-input>
    
                    <span style="margin: 0 12px">状态</span>
                    <el-select v-model="dataObj.cardStatus" class="select" placeholder="请选择">
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
                label="活动图片"
                align="center"
                width="100">
                <template scope="scope">
                    <img style="width:30px;height: 20px" src="http://img4.imgtn.bdimg.com/it/u=4258410114,1864035878&fm=27&gp=0.jpg" alt="">
                </template>

            </el-table-column>
        
            <el-table-column
                prop="area"
                label="地区"
                align="center"
                width="100">
            </el-table-column>
        
            <el-table-column
                prop="eRails"
                align="center"
                label="电子围栏">
            </el-table-column>
    
            <el-table-column
                prop="createTime"
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
                               @click="modifyClick(scope.row.id)">修改
                    </el-button>
                    <el-button type="text" size="small"
                               @click="onlineClick(scope.row.id)">上线
                    </el-button>
                    <el-button type="text" size="small"
                               @click="offlineClick(scope.row.id)">下线
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
    
    export default {
    components: {},
    data() {
      return {
          activeName: '',
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
          DataList: [
              {
                  name: 'test1',
                  activityTime: '2017-09-20 - 2017-10-16',
                  activityImg: 'http://img4.imgtn.bdimg.com/it/u=4258410114,1864035878&fm=27&gp=0.jpg',
                  area: '上海',
                  eRails: '2141',
                  createTime: '2017-09-20 - 2017-10-16',
                  status: '未上线',
              },
              {
                  name: 'test2',
                  activityTime: '2016-09-20 - 2016-10-16',
                  activityImg: 'http://img4.imgtn.bdimg.com/it/u=4258410114,1864035878&fm=27&gp=0.jpg',
                  area: '北京',
                  eRails: '3321',
                  createTime: '2016-09-20 - 2016-10-16',
                  status: '已上线',
              },
              {
                  name: 'test3',
                  activityTime: '2015-09-20 - 2015-10-1',
                  activityImg: 'http://img4.imgtn.bdimg.com/it/u=4258410114,1864035878&fm=27&gp=0.jpg',
                  area: '广州',
                  eRails: '5556',
                  createTime: '2015-09-20 - 2015-10-1',
                  status: '已下线',
              },
              {
                  name: 'test4',
                  activityTime: '2014-09-20 - 2014-10-1',
                  activityImg: 'http://img4.imgtn.bdimg.com/it/u=4258410114,1864035878&fm=27&gp=0.jpg',
                  area: '广州',
                  eRails: '3346',
                  createTime: '2014-09-20 - 2014-10-1',
                  status: '活动已结束',
              }
          ],
      }
    },
        computed: {
            ...mapGetters([
                'activityList'
            ])
        },
      created() {
        this.getActivityList(this.dataObj);
      },
      methods: {
          ...mapActions([
              'getActivityList',
          ]),
          dateBlur(res) {
              console.debug(res);
          },
          searchClick() {
              let self = this;
              console.debug(self.dataObj.dateRange);
          },
          CreateActivityClick() {
              this.$router.push('createActivity');
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
