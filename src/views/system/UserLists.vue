<template>
  <div class="app-container">
    <el-row class="module-height" :gutter="20">
      <!--账号类型-->
      <el-col :span="6">
        账号类型
        <el-select v-model="usertype" placeholder="请选择" clearable>
          <el-option v-for="type in accountType" :key="type.value" :label="type.label" :value="type.value"></el-option>
        </el-select>
      </el-col>
      <!-- 账号-->
      <el-col :span="4">
        <el-input clearable v-model="userID" placeholder="请输入账号" ></el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click.native="SearchUser" :disabled="buttonDisabled">搜索</el-button>
      </el-col>
      
      <!-- 预留一个位置，没有内容不占位置-->
      <el-col :span="9"></el-col>

      <!-- 右侧的下拉菜单-->
      <el-col :span="2" :offset="9">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-button type="primary" icon="el-icon-s-fold">操作</el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">添加账号</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="updateStatus">禁用/启用账号</el-dropdown-item>
            <el-dropdown-item ><svg-icon icon-class="查看" /> 查看账号</el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete">删除账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" >
        <el-table :data="userList" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange">
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="userID" label="账号" ></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="telephone" label="电话"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="isdelete" label="状态">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-tag effect="dark" type="success" v-if="scope.row.isdelete < 1">启用</el-tag>
                <el-tag effect="dark" type="info" v-else>禁用</el-tag>
              </template>
            </el-table-column>
        </el-table>
    </el-row>

    <!-- 分页功能-->
    <el-row class="page" >
      <el-pagination
        @size-change="SizeChange"
        @current-change="PageChange"
        :current-page="currentPage"
        :page-sizes="[10, 1, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>

import request from '@/utils/request'

export default {
  name: 'UserLists',
  data() {
    return {
      userList:[],//后端返回的用户数据
      //账号类型
      accountType:[
        { value: 'admin', label: '管理员'},
        { value: 'student', label: '学生'},
        { value: 'teacher', label: '教师'},
      ],
      userID: '',//输入查询的账号
      usertype:'', //用户选择的账号类型
      loading: false, //加载数据提示
      buttonDisabled: false, //搜索按钮，默认是不禁用
      selectRow: [], //存储选中的用户值
      currentPage: 1, //默认当前分页是第1页
      pagesize: 100, //每页展示多少条数据，默认是100

    }
  },

  methods: {
        getUser(){
            this.buttonDisabled = true
            this.loading = true
            request({
                method:'post',
                url: 'system/getUser',
                responseType: 'json',
                data: {
                  userID: this.userID,
                  usertype: this.usertype
                },
            }).then(response =>{
                if(response.data.success){
                  this.userList = response.data.data
                }else{//查询账号失败的情况
                  this.$message({
                  message:response.data.msg,
                  type:'warning'
                })
                this.userList = [] //查询失败后情数据清空
                }
                this.buttonDisabled = false
                this.loading = false
            }).catch(error =>{//报异常后取消禁用搜索按钮和加载提示
                this.buttonDisabled = false
                this.loading = false
            })
        },
        SearchUser(){//根据账号类型向后端请求账号查询
          if(this.usertype == ''){
            this.$message({
              message: '请选中账号类型',
              type: 'warning'
            })
            return
          }
          this.getUser()
        },

        handleCurrentChange(currentRow){ //表格选择row后的触发事件，储存选中的行
            this.selectRow = currentRow
        },

        updateStatus(){//启用或者禁用账号
          let user = this.selectRow
          if(user.length === 1){
            if(user[0].isdelete === 1){//若账号处于禁用状态，则变更为启用
              user[0].isdelete = 0
            }else{//账号变更为禁用
              user[0].isdelete = 1
            }
            request({
              url: '/system/updateStatus',
              responseType: 'json',
              data: user[0],
              method: 'post'
            }).then(res =>{
              this.$message(res.data.msg)
            })
          }else{
            this.$message('禁用/启用账号只能单个操作')
          }

        },

        SizeChange(val){//更新每页展示数据量
          console.log(val)
          this.pagesize = val
        },

        PageChange(val){//更新当前页的页码
          console.log(val)
          this.currentPage = val
        },


  },
  computed:{
    showList(){//当前页展示的数据
        let list = []
        if(this.userList.length>0){
          let start = this.pagesize * (this.currentPage - 1)
          let end = start+this.pagesize
          for(let i = start; i<end ; i++ ){
            list.push(this.userList[i])
          }
          return list
        }else{
          return list
        }

    }
  },
  mounted(){
        
  }
}
</script>

<style scoped>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
.module-height{
  height: 100px;
}
.page{
  margin-top: 20px;
  /* border: 1px solid black; */
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>

