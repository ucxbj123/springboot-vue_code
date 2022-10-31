<template>
  <div class="app-container">
    <!-- 第一行-->
    <el-row class="module-height" :gutter="20">
      <!-- 年级-->
      <el-col :span="6">
        年级 <el-input class="inputwidth"  v-model="name" placeholder="请输入年级名称"></el-input>
      </el-col>
      <el-col :span="6">
        年级编号 <el-input class="inputwidth"  v-model="gno" placeholder="请输入年级编号"  ></el-input>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click.native="Search" >搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click.native="Reset" >重置</el-button>
      </el-col>
    </el-row>

    <el-row class="buttonMenu">
        <el-button type="primary" size="small" icon="el-icon-plus" plain round>添加</el-button>
        <el-button type="primary" size="small" icon="el-icon-edit" plain round>修改</el-button>
        <el-button type="primary" size="small" icon="el-icon-delete" plain round>删除</el-button>
        <el-button type="primary" size="small" icon="el-icon-download" plain round>导出</el-button>
    </el-row>

    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" >
        <el-table :data="userList" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange">
            <!-- 自定义索引 index可以是number可以是function返回一个number-->
            <el-table-column type="index" :index="indexMethod"></el-table-column>
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="gno" label="年级编码" ></el-table-column>
            <el-table-column prop="name" label="年级名称"></el-table-column>
            <el-table-column prop="manager" label="年级主任"></el-table-column>
            <el-table-column prop="email" label="主任邮箱"></el-table-column>
            <el-table-column prop="telephone" label="主任电话"></el-table-column>
            <el-table-column prop="introducation" label="年级简介"></el-table-column>
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
  </div>
</template>

<script>
import { getPage } from '@/api/grade'

export default {
  name: 'Gradeinfo',
  data() {
    return {
      userList:[],//后端返回的用户数据
      name: '',//年级名称
      gno: '', //年级编号
      loading: false, //加载数据提示
      selectRow: [], //存储选中的用户值
      currentPage: 1, //默认当前分页是第1页
      pagesize: 10, //每页展示多少条数据，默认是10
      total: 0, //总的记录数，未查询时为0

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
            this.gno = ''
        },

        Search(){//搜索年级信息
            const pagedate = { gno: this.gno, name: this.name, pagesize: this.pagesize, currentPage: this.currentPage }
            getPage(pagedate).then(response =>{
                this.userList = response.data.data.grades
                this.total = response.data.data.total
                console.log(response.data)
            })
        }


  },
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

.inputwidth{
    width: 200px;
}

.buttonMenu{
    margin-bottom: 10px;
}
</style>

