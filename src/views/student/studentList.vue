<template>
  <div class="app-container">
    <!-- 第一行-->
    <el-row class="module-height" :gutter="20">
      <!-- 年级-->
      <el-col :span="6">
        班级编号 <el-input class="inputwidth"  v-model="cno" placeholder="班级编号"></el-input>
      </el-col>
      <el-col :span="6">
        班级名称 <el-input class="inputwidth"  v-model="name" placeholder="请输入班级名称"  ></el-input>
      </el-col>
      <el-col :span="6" >
        <el-button type="primary" icon="el-icon-search" @click.native="SearchButton(pagesize,currentPage)" >搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click.native="Reset" >重置</el-button>
      </el-col>
    </el-row>
    <el-row class="buttonMenu">
        <el-button type="primary" size="small" icon="el-icon-edit" plain round @click.native="tochange">分配班级</el-button>
    </el-row>

    
    <el-tabs type="border-card" :before-leave="beforeleave" v-model="tagName">
      <el-tab-pane label="查询" name="query">
        <!-- 表格内容-->
        <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)">
            <el-table :data="clazzList" style="width:100%" stripe border highlight-current-row @selection-change="handleCurrentChange" >
                <!-- 自定义索引 index可以是number可以是function返回一个number-->
                <el-table-column type="index" :index="indexMethod"></el-table-column>
                <el-table-column type="selection" ></el-table-column>
                <el-table-column prop="cno" label="班级编号" ></el-table-column>
                <el-table-column prop="name" label="班级名称"></el-table-column>
                <el-table-column prop="coordinator" label="班主任"></el-table-column>
                <el-table-column prop="email" label="班主任邮箱"></el-table-column>
                <el-table-column prop="telephone" label="班主任电话"></el-table-column>
                <el-table-column prop="introducation" label="班级简介"></el-table-column>
                <el-table-column prop="number" label="班级人数"></el-table-column>
                <el-table-column prop="grade_name" label="所属年级"></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="学生班级分配" name="Shift">
        <!-- 穿梭框-->
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="selectValue"
          filterable
          filter-placeholder="请输入姓名进行搜索"
          :props="{
            key: 'sno',
            label: 'name'
          }"
          :titles="['未分配班级的学生', `${titleName}`]"
          :button-texts="['取消', '分配']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleTapChange"
          :data="studentdata">
          <span slot-scope="{ option }">{{ option.sno }} - {{ option.name }}</span>
        </el-transfer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPage } from '@/api/clazz'
import { getStudentByCno, updateStudentClazz } from '@/api/student'


export default {
  name: 'studentlist',
  data() {
    return {
      clazzList:[],//后端返回的班级数据
      name: '',//班级名称
      cno: '', //班级编号
      loading: false, //加载数据提示
      selectRow: [], //存储选中的班级值
      currentPage: 1, //默认当前分页是第1页
      pagesize: 10, //每页展示多少条数据，默认是10
      total: 0, //总的记录数，未查询时为0
      tagName: 'query',//设置默认的name，自定义了别名，必须手动设置默认的name
      titleName: '班级',
      studentdata: [],//总的学生信息
      selectValue: [],//已分配titleName班级的学生
      FirstSearch: true, //是否是第一次使用查询功能。true：pagesize与currentPage的改变不会触发查询功能;false：每次改变pagesize与currentPage都会触发查询功能，向后台请求数据
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
            this.cno = ''
        },

        SearchButton(pagesize2,currentPage2){
          this.Search(pagesize2,currentPage2)
          this.FirstSearch = false //第一次执行查询功能后设为false
          //切换tag为query
          this.tagName = 'query'
        },

        Search(pagesize2,currentPage2){//搜索班级信息
            this.loading = true
            const pagedate = { cno: this.cno, name: this.name, pagesize: pagesize2, currentPage: currentPage2 }
            getPage(pagedate).then(response =>{
                this.clazzList = response.data.data.clazz
                this.total = response.data.data.total
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },
        beforeleave(activeName, oldActiveName) {//点击新的选项卡触发，切换前触发的函数;activeName是指name属性，也就是标签别名，若没有指明，则以索引顺序排列
            if(activeName == 'Shift'){
              //切换分配班级前检验是否选择班级记录
              if(this.selectRow.length === 1){
                this.titleName = this.selectRow[0].name
                //若符合条件则从后端获取学生信息进行班级分配
                this.getStudent()
              }else{
                //若班级信息多条或者未选则禁止切换
                this.$message({
                  message: '请选择学生分配的班级，只能选一个',
                  type:'warning'
                })
                return false
              }
            }
            return true
        },

        getStudent(){//获取穿梭框的titleName班级的学生信息和未分配班级的学生信息
            //获取titleName班级的学生信息
            getStudentByCno(this.selectRow[0].cno).then(response =>{
              this.studentdata = response.data.data
              this.selectValue = response.data.data.map(v =>{//已分配班级学生
                return v['sno']
              }) 
              //获取未分配班级的学生
              getStudentByCno(null).then(response =>{
                this.studentdata = this.studentdata.concat(response.data.data)  //合并
              })
            })
        },

        handleTapChange(CurrentValue,move,changeValue){//穿梭框右侧列表元素变化时触发的事件
          if(move == 'left'){
            console.log('left')
            updateStudentClazz(changeValue, this.selectRow[0].cno, this.selectRow[0].name, false).then(response =>{
              this.$message({
                message: response.data.msg,
                type: 'info'
              })
            })
          }else if(move == 'right'){
            updateStudentClazz(changeValue, this.selectRow[0].cno, this.selectRow[0].name, true).then(response =>{
              this.$message({
                message: response.data.msg,
                type: 'info'
              })
            })
            console.log('right')
          }
        },

        tochange(){
          //验证是否符合切换标准
          let result = this.beforeleave("Shift")
          //若符合则切换
          if(result){
            this.tagName = "Shift"
          }
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

