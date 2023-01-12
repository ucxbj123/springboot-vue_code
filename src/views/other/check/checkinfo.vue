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
      </el-form>
    </el-row>
    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)">
        <el-divider content-position="left">检验标准</el-divider>
        <el-table :data="checkdata.date" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange" size="small" >
            <!-- 自定义索引 index可以是number可以是function返回一个number-->
            <el-table-column type="index" :index="indexMethod"></el-table-column>
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="sno" label="项目" ></el-table-column>
            <el-table-column prop="name" label="编号"></el-table-column>
            <el-table-column prop="gender" label="检验标准名称"></el-table-column>
            <el-table-column prop="email" label="条码长度"></el-table-column>
            <el-table-column label="状态">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-tag effect="dark" type="success" v-if="scope.row.isdelete < 1">正常</el-tag>
                <el-tag effect="dark" type="info" v-else>禁用</el-tag>
              </template>
            </el-table-column>
        </el-table>
    </el-row>

     <!-- 分页功能-->
    <el-row class="page" v-show="checkdata.selectRow.length > 0" >
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
  </div>
</template>

<script>
export default {
    name: 'checkinfo',
    data() {
      return {
        formValue: {
          item: '',
          checkname: ''
        },
        rules:{
          item:[
            { required: true, message: '项目是必选项', trigger: 'change' }
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
        }
      }
    },
    methods:{
      select(){//执行查询功能
        this.$refs["checkform"].validate((valid) =>{
          if(valid){
            this.$message("OK")
          }
        })
      },
      tocheckDetaild(){//跳转到检验标准明细界面
        if(this.checkdata.selectRow != 1){
          this.checkdata.selectRow.push({id:123})
          this.$router.push({
            name: 'checkDetailed',
            query: {
              data: this.checkdata.selectRow
            }
          })
        }else{
          this.$message({
            message: '请选择一条数据',
            type: 'warning'
          })
        }
        
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
</style>