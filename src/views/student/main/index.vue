<template>
  <div class="app-container">
    <!-- 第一行-->
    <el-row class="module-height" :gutter="20">
      <!-- 年级-->
      <el-col :span="6">
        账号 <el-input class="inputwidth"  v-model="sno" placeholder="请输入账号"></el-input>
      </el-col>
      <el-col :span="6">
        姓名 <el-input class="inputwidth"  v-model="name" placeholder="请输入姓名"  ></el-input>
      </el-col>
      <el-col :span="6">
        性别 
        <el-select v-model="gender" placeholder="请选择">
            <el-option v-for="type in sex" :key="type.value" :label="type.label" :value="type.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" >
        <el-button type="primary" icon="el-icon-search" @click.native="SearchButton(pagesize,currentPage)" >搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click.native="Reset" >重置</el-button>
      </el-col>
    </el-row>
    <el-row class="switch">
        <el-col>账号正常
            <el-switch
            v-model="status"
            active-color="#22D672">
            </el-switch>
        </el-col>
    </el-row>
    <el-row class="buttonMenu">
        <el-button type="primary" size="small" icon="el-icon-edit" plain round @click.native="update">修改</el-button>
        <el-button type="primary" size="small" icon="el-icon-download" plain round @click.native="ExportExcel">导出</el-button>
    </el-row>

    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)">
        <el-table :data="userList" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange" >
            <!-- 自定义索引 index可以是number可以是function返回一个number-->
            <el-table-column type="index" :index="indexMethod"></el-table-column>
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="sno" label="账号" ></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="telephone" label="电话"></el-table-column>
            <el-table-column prop="address" label="住址"></el-table-column>
            <el-table-column prop="clazz_name" label="所属班级"></el-table-column>
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
    <el-row class="page" >
      <el-pagination
        @size-change="SizeChange"
        @current-change="PageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <!-- 弹出，执行修改-->
    <student-dialog  :open="opendialog" :title="titledialog"  :Row="selectRow" @close = "closeDialog" />
  </div>
</template>

<script>
import { getStudentPage } from '@/api/student'
import { formatJson } from '@/utils/validate'

import StudentDialog from './StudentDialog.vue'

export default {
  name: 'studentmain',
  components:{
    StudentDialog
  },
  data() {
    return {
      userList:[],//后端返回的用户数据
      name: '',//姓名
      sno: '', //账号
      gender:'',//性别
      loading: false, //加载数据提示
      selectRow: [], //存储选中的用户值
      currentPage: 1, //默认当前分页是第1页
      pagesize: 10, //每页展示多少条数据，默认是10
      total: 0, //总的记录数，未查询时为0
      FirstSearch: true, //是否是第一次使用查询功能。true：pagesize与currentPage的改变不会触发查询功能;false：每次改变pagesize与currentPage都会触发查询功能，向后台请求数据
      opendialog: false,  //打开弹窗开关
      titledialog: '',    //弹窗主题
      sex: [
        { value: '男',label: '男' },
        { value: '女',label: '女' }
      ],
      status: true,//账号状态，查询条件
    }
  },

  methods: {
        handleCurrentChange(currentRow){ //表格选择row后的触发事件，储存选中的行
            this.selectRow = currentRow
        },

        SizeChange(val){//更新每页展示数据量
          this.pagesize = val
        },

        PageChange(val){//更新当前页的页码
          this.currentPage = val
        },
        indexMethod(index){//自定义索引
          //因为index默认从0开始，需要+1
          return index + 1 + (this.pagesize * (this.currentPage - 1))
        },

        Reset(){//重置输入框
            this.name = ''
            this.sno = ''
            this.gender = ''
        },

        SearchButton(pagesize2,currentPage2){
          this.Search(pagesize2,currentPage2)
          this.FirstSearch = false //第一次执行查询功能后设为false
        },

        Search(pagesize2,currentPage2){//搜索学生信息
            this.loading = true
            const pagedate = { sno: this.sno, name: this.name, pagesize: pagesize2, currentPage: currentPage2, gender: this.gender, isdelete: this.status }
            getStudentPage(pagedate).then(response =>{
                this.userList = response.data.data.students
                this.total = response.data.data.total
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },

        update(){//修改学生信息
          if(this.selectRow.length <= 0){
            this.$message({
              message:'请选择需要修改的账号',
              type: 'info'
            })
            return
          }else if(this.selectRow.length > 1){
            this.$message({
              message:'只能选项一条记录',
              type:'info'
            })
            return
          }
          this.titledialog = '修改学生账号'
          this.opendialog = true
        },

        closeDialog(){//关闭弹窗
          this.opendialog = false
        },

        ExportExcel(){
          import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['账号', '姓名', '性别', '邮箱', '电话', '住址', '所属班级', '状态']
          const filterVal = ['sno', 'name', 'gender', 'email', 'telephone', 'address', 'clazz_name', 'isdelete' ]
          const list = this.userList
          const data = formatJson(filterVal, list)  //取filterVal中的值并构建成Array数据用于导出
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '学生信息',
            autoWidth: true,
            bookType: 'xlsx',   //支持xlsx,csv,txt
          })
         })
        }

  },

  watch:{
    pagesize(newvalue){//若未使用查询功能，每页显示总数改变都不会执行查询方法
      if(this.FirstSearch) {return}
      this.Search(newvalue,this.currentPage)
    },
    currentPage(newvalue){
      if(this.FirstSearch) {return}
      this.Search(this.pagesize,newvalue)
    }
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
  height: 70px;
}
.page{
  margin-top: 20px;
  /* border: 1px solid black; */
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.inputwidth{
    width: 200px;
}

.buttonMenu{
    margin-bottom: 10px;
}
.switch{
    margin-bottom: 25px;
}
</style>