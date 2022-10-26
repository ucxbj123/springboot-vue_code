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
            <el-dropdown-item icon="el-icon-circle-plus">禁用/启用账号</el-dropdown-item>
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
    }
  },

  methods: {
        getUser(){
            this.buttonDisabled = true
            this.loading = true
            console.log('userlist.vue:',this.userID)
            request({
                method:'post',
                url: 'system/getUser',
                responseType: 'json',
                data: {
                  userID: this.userID,
                  usertype: this.usertype
                },
            }).then(response =>{//查询账号失败的情况
                if(response.data.success){
                  this.userList = response.data.data
                }else{
                  this.$message({
                  message:response.data.msg,
                  type:'warning'
                })
                this.userList = [] //查询失败后情况数据
                }
                this.buttonDisabled = false
                this.loading = false
            }).catch(error =>{//报异常后取消禁用搜索按钮和加载提示
                this.buttonDisabled = false
                this.loading = false
            })
        },
        SearchUser(){
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
</style>

