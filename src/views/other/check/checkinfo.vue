<template>
  <div>
    <!-- 查询条件-->
    <el-row class="formcheck">
      <el-form :inline="true" :model="formValue" :rules="rules" ref="checkform" size="mini">
        <el-form-item label="项目" prop="item">
          <el-select v-model="formValue.item" placeholder="项目" clearable>
            <el-option v-for="item in items" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验标准" prop="checkname">
          <el-select v-model="formValue.checkname" placeholder="检验标准" clearable>
            <el-option v-for="item in checkitem" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="select()" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tocheckDetaild()" icon="el-icon-view">明细</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="opendialog()" icon="el-icon-circle-plus-outline">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)">
        <el-divider content-position="left">检验标准</el-divider>
        <el-table :data="checkdata.data" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange" size="small" >
            <!-- 自定义索引 index可以是number可以是function返回一个number-->
            <el-table-column type="index" :index="indexMethod"></el-table-column>
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="project" label="项目" ></el-table-column>
            <el-table-column prop="standardcode" label="编号"></el-table-column>
            <el-table-column prop="standardname" label="检验标准名称"></el-table-column>
            <el-table-column prop="checklength" label="条码长度"></el-table-column>
            <el-table-column label="状态">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-tag effect="dark" type="success" v-if="scope.row.isenabled">启用</el-tag>
                <el-tag effect="dark" type="info" v-else>禁用</el-tag>
              </template>
            </el-table-column>
        </el-table>
    </el-row>

     <!-- 分页功能-->
    <el-row class="page" v-show="checkdata.data.length > 0" >
      <el-pagination
        @size-change="SizeChange"
        @current-change="PageChange"
        :current-page="checkdata.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="checkdata.total"
        >
      </el-pagination>
    </el-row>

    <!--弹窗dialog -->
    <el-row>
      <el-dialog :visible.sync="dialog" width="40%" :close="closeDialog" v-el-drag-dialog>
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="新增" /> 新增项目
            </template>
            <el-row :gutter="10" class="el">
              <el-col :span="3">项 目</el-col>
              <el-col :span="9"><el-input v-model="checkdata.project"></el-input></el-col>
              <el-col :span="3">检验标准</el-col>
              <el-col :span="9"><el-input v-model="checkdata.standardname"></el-input></el-col>
            </el-row>
            <el-row :gutter="10" class="el">
              <el-col :span="3">长 度</el-col>
              <el-col :span="9"><el-input v-model="checkdata.checklength"></el-input></el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="Insert" >添 加</el-button>
            </span>
        </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { insertproject, getproject } from '@/api/other/check'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui


export default {
    name: 'checkinfo',
    directives:{
        elDragDialog
    },
    data() {
      return {
        formValue: {
          item: '',
          checkname: ''
        },
        rules:{
          item:[
            { required: false, message: '项目是必选项', trigger: 'change' }
          ],
          checkname:[
            { required: false, message: '检验标准是必选项', trigger: 'change' }
          ]
        },
        items:[
          {value: '项目一', label:'项目一'},
          {value: '项目二', label:'项目二'},
          {value: '项目三', label:'项目三'}
        ],
        checkitem:[
          {value: '标准一', label:'标准一'},
          {value: '标准二', label:'标准二'},
          {value: '标准三', label:'标准三'}
        ],
        loading: false,
        checkdata:{
          data: [], //后台返回的数据
          selectRow: [], //存储选中的数据
          pagesize: 10, //每页展示多少条数据，默认是10
          currentPage: 1, //默认当前分页是第1页
          total: 0, //总的记录数，未查询时为0
          project: '', //项目
          standardname: '', //检验标准名称
          checklength: '', //长度
        },
        dialog: false,  //弹窗开关
      }
    },
    methods:{
      select(){//执行查询功能
        this.$refs["checkform"].validate((valid) =>{
          if(valid){
            getproject().then(response => {
              const res = response.data
              this.checkdata.data = res.data
              if(res.success){
                this.$message({
                    message: res.msg,
                    type: 'success'
                })
                this.closeDialog()
              }else{
                  this.$message({
                      message: res.msg,
                      type: 'error'
                  })
              }
            })
          }
        })
      },
      tocheckDetaild(){//跳转到检验标准明细界面
        if(this.checkdata.selectRow.length == 1){
          this.$router.push({
            name: 'checkDetailed',
            query: {
              data: this.checkdata.selectRow[0]
            }
          })
        }else{
          this.$message({
            message: '请选择一条数据',
            type: 'warning'
          })
        }
        
      },
      Insert(){
        if (this.checkdata.project == '' || this.checkdata.standardname == '' || this.checkdata.checklength == ''){
          this.$message({
            message:'项目、检验标准、长度是必填项',
            type: 'warning'
          })
          return
        }
        insertproject(this.checkdata.project, this.checkdata.standardname, this.checkdata.checklength,this.$store.getters.name).then(response => {
          const res = response.data
          if(res.success){
            this.$message({
                message: res.msg,
                type: 'success'
            })
            this.closeDialog()
          }else{
              this.$message({
                  message: res.msg,
                  type: 'error'
              })
          }
          //清楚数据并关闭弹窗
          this.checkdata.standardname = ''
          this.checkdata.project = ''
          this.checkdata.checklength = ''
          this.dialog = false
        })

      },
      opendialog(){
        this.dialog = true
      },
      closeDialog(){
        this.dialog = false
      },

      handleCurrentChange(selectRow){//表格选择row后的触发事件，储存选中的行
        this.checkdata.selectRow = selectRow
      },
      indexMethod(index){//自定义索引
          //因为index默认从0开始，需要+1
          return index + 1 + (this.checkdata.pagesize * (this.checkdata.currentPage - 1))
      },
      SizeChange(val){//更新每页展示数据量
        this.checkdata.pagesize = val
      },

      PageChange(val){//更新当前页的页码
        this.checkdata.currentPage = val
      },
    }
}
</script>

<style scoped>
.formcheck{
  height: 100px;
}
.el{
    margin-top: 20px;
}
</style>