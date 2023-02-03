<template>
  <div>
    <!-- 显示界面-->
    <el-row :gutter="10" class="el" v-model="Row">
      <el-form :inline="true" >
        <el-form-item label="项目" >
          <el-input  v-model="Row.project" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="检验标准">
          <el-input  v-model="Row.standardname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input  v-model="Row.standardcode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="长度">
          <el-input  v-model="Row.checklength" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <!-- 显示界面-->
    <el-row :gutter="10" class="el">
      <el-col :span="6">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="条码">
            <el-input  v-model="checkcode" @keydown.native.enter="check()"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 折叠面板：检验标准操作按钮-->
    <el-row class="el">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            操作按钮<i class="el-icon-s-unfold" />
          </template>
          <div>
            <el-button  @click.native="insertRow()" plain type="primary">新增行</el-button>
            <el-button  @click.native="deleteRow()" plain type="primary">删除行</el-button>
            <el-button  @click.native="deleteAllRow()" plain type="primary">清空校验标准</el-button>
            <el-button  @click.native="saveRow()" plain type="primary">保存</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)" class="el">
        <el-table :data="detailedData.data" style="width:80%" border highlight-current-row @selection-change="handleCurrentChange" 
          :row-class-name="RowClassName" >
            <el-table-column type="selection" ></el-table-column>
            <el-table-column label="检验项目" align="center">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-input v-model="scope.row.standardproject" v-if="scope.row.edit" ></el-input>
                <span v-else>{{scope.row.standardproject}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验起始位置" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.checkstartposition" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.checkstartposition}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="长度" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.standardlength" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.standardlength}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="检验条件1" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.checkcondition" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.checkcondition}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="参考值" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.checkvalue" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.checkvalue}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="逻辑值" align="center" width="100px">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.logicvalue" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.logicvalue}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="检验条件2" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.checkcondition1" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.checkcondition1}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="参考值2" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.checkvalue1" v-if="scope.row.edit" ></el-input>
                <span v-else>{{scope.row.checkvalue1}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="是否校验" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.ischeck" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.ischeck}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="唯一校验" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.uniquecheck" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.uniquecheck}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="值类型" align="center" width="110px">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.valuetype" placeholder=" " v-if="scope.row.edit" clearable>
                  <el-option
                    v-for="item in detailedData.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.valuetype}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100px">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-button v-if="!scope.row.edit" @click.native="changeEdit(scope.row)">编辑</el-button>
                <el-button v-else @click.native="changeEdit(scope.row)">完成</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>

<script>
import { saveStandard, getTeststandard, checkcodeOne } from '@/api/other/check'
import { isInteger } from '@/utils/validate'


export default {
    name: 'checkDetailed',
    data() {
        return {
            context: '',
            loading: false,
            checkcode: '',  //待校验的条码条码
            Row: this.$route.query.data ? this.$route.query.data : {project: '', standardname: '', standardcode: '', checklength : 0}, //主页传的检验标准信息
            detailedData: {
              data: [], //后台返回的校验标准明细数据
              selectRow: [], //存储选中的行数据
              resultRow: [], //后台返回检验项的校验结果
              updateRow: [], //某一校验项目的逻辑修改结果，未使用
              deleteRow: [], //删除某一检验项目的逻辑，未使用
              insertRow: [], //添加新的校验项目，未使用
              options: [  //检验条件
                {value: '=', label: '='},
                {value: '!=', label: '!='},
                {value: '<', label: '<'},
                {value: '>', label: '>'},
                {value: '<=', label: '<='},
                {value: '>=', label: '>='}
              ],
              options2: [ //用于判断某些条件是否生效
                {value: true, label: '是'},
                {value: false, label: '否'},
              ],
              options3: [ 
                {value: 'int', label: '数值型'},
                {value: 'string', label: '字符串'},
              ],
              options4: [ 
                {value: 'and', label: 'and'},
                {value: 'or', label: 'or'},
              ]
            }
        }
    },
    methods:{
      handleCurrentChange(selectRow){//表格选择row后的触发事件，储存选中的行
        this.detailedData.selectRow = selectRow
      },
      changeEdit(row){//保存行记录的编辑状态,需要限制检验条件、起始位置、长度为必选；再根据情况是否限制检验条件2为必选
        if(row.edit){//需要保存记录
          if(row.checkstartposition == '' || row.standardlength == '' || row.checkcondition == '' || row.ischeck == '' || row.valuetype == ''){
            this.$message({message: '检验条件、起始位置、长度、是否校验、值类型为必填', type: 'warning'})
            return
          }else if(row.logicvalue.length != ''){
            if(row.checkcondition1 == ''){
              this.$message({message: '因逻辑值不为空,检验条件2为必填', type: 'warning'})
              return
            }
          }else if(!isInteger(row.standardlength) || !isInteger(row.checkstartposition)){
              this.$message({message:'起始位置、长度只能填正整数', type: 'warning'})
              return
          }
          //关闭编辑状态
          row.edit = false
        }else{
          row.edit = true
        }
      },

      insertRow(){//新增行
        const json = {
          standardcode: this.Row.standardcode, standardname: this.Row.standardname, standardproject: '',
          checkstartposition: '', standardlength: '', checkcondition: '', checkvalue: '',
          logicvalue: '', checkcondition1: '', checkvalue1: '', ischeck: '', uniquecheck: '',
          valuetype: '', isenabled: true, createuser: this.$store.getters.name, edit: false
        }
        this.detailedData.data.push(json)
      },
      deleteRow(){//删除行
        const row = this.detailedData.selectRow
        for(let i = 0; i < row.length; i++){
          //判断选中记录的索引再进行指定位置的元素删除
          let index = this.detailedData.data.indexOf(row[i])
          this.detailedData.data.splice(index, 1)
        }
      },
      deleteAllRow(){//清空所有行
        const len = this.detailedData.data.length
        this.detailedData.data.splice(0,len)
      },
      saveRow(){//保存检验项
        //若有检验项处于编辑状态不允许保存
        var status = false
        const data = this.detailedData.data
        for(let i = 0; i< data.length; i++){
          if(data[i].edit){
            status = true
            //若有处于编辑状态则中断循环继续判断
            break
          }
        }
        if(status){
          this.$message({message:'还有检验项处于编辑状态，请先编辑完！', type: 'warning'})
          return
        }
        saveStandard(this.detailedData.data, this.Row.standardcode).then(response => {
          const res = response.data
          if(res.success){
            this.$message({
                message: res.msg,
                type: 'success'
            })
          }else{
              this.$message({
                  message: res.msg,
                  type: 'error'
              })
          }
        })
      },
      check(){//校验条码
        if(this.checkcode == ''){
          this.$message({
            message: '条码不能为空',
            type: 'warning'
          })
          return
        }else if(!this.Row.isenabled){
          this.$message({message:this.Row.standardname+'检验标准未启用，请先启用',type: 'warning'})
          return
        }
        //通过则继续往下执行
        checkcodeOne(this.Row.standardcode, this.checkcode).then(response => {
          const res = response.data
          const re = res.data
          //接收后台返回的各个检验项的校验结果
          this.detailedData.resultRow = re
          var result = ''
          var status = true
          for( let j = 0; j < re.length; j++ ){
            if(!re[j].success){
              result += re[j].standardproject +':'+ re[j].message
              result += '  '
              status = false
            }
          }
          if(status){
            this.$message({
              message: '校验通过',
              type: 'success'
            })
          }else{
            this.$message.error(result)
          }
        })
      },
      RowClassName({row, rowIndex}){//判断行内状态，显示不同颜色
          console.log(row,rowIndex)
          const data = this.detailedData.resultRow
          if(data.length > 0){
            for(let i = 0; i < data.length; i++){
            if(row.id == data[i].id && !data[i].success){//若返回对应检验项的结果是失败的，则行高亮红色
                console.log(row.standardproject)
                return 'warning-row'
              }
            }
            // return 'success-row'
          }
          return ''
      }
    },
    mounted(){
      //页面加载时将对应的编号的检验项显示
      const standardcode = this.Row.standardcode
      getTeststandard(standardcode).then(response =>{
        const res = response.data.data
        for( let i = 0; i < res.length; i++){//添加edit属性用于编辑检验项的控制
          res[i].edit = false
        }
        this.detailedData.data = this.detailedData.data.concat(res)
      })
    }
}
</script>

<style>
.el{
    margin-top: 20px;
}
.el-table .warning-row{
  background: #b42e49;
}
.el-table .success-row {
    background: #13CE66;
  }
</style>