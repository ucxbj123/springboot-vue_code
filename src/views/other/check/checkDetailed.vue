<template>
  <div>
    <!-- 折叠面板：检验标准操作按钮-->
    <el-row>
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            操作按钮<i class="el-icon-s-unfold" />
          </template>
          <div>
            <el-button  @click.native="insertRow()" plain type="primary">新增行</el-button>
            <el-button  @click.native="deleteRow()" plain type="primary">删除行</el-button>
            <el-button  @click.native="deleteAllRow()" plain type="primary">清空校验标准</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 表格内容-->
    <el-row  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)">
        <el-table :data="detailedData.data" style="width:80%" stripe border highlight-current-row @selection-change="handleCurrentChange"  >
            <el-table-column type="selection" ></el-table-column>
            <el-table-column label="检验项目" align="center">
              <!-- 自定义内容-->
              <template slot-scope="scope">
                <el-input v-model="scope.row.StandardProject" v-if="scope.row.edit" ></el-input>
                <span v-else>{{scope.row.StandardProject}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验起始位置" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.CheckStartPosition" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.CheckStartPosition}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="长度" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.StandardLength" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.StandardLength}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="检验条件1" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.CheckCondition" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.CheckCondition}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="参考值" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.CheckValue" v-if="scope.row.edit"></el-input>
                <span v-else>{{scope.row.CheckValue}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="逻辑值" align="center" width="100px">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.LogicValue" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.LogicValue}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="检验条件2" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.CheckCondition1" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.CheckCondition1}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="参考值2" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.CheckValue1" v-if="scope.row.edit" ></el-input>
                <span v-else>{{scope.row.CheckValue1}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="是否校验" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.IsCheck" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.IsCheck}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="唯一校验" align="center">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.UniqueCheck" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.UniqueCheck}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="值类型" align="center" width="110px">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.ValueType" placeholder=" " v-if="scope.row.edit">
                  <el-option
                    v-for="item in detailedData.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.ValueType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
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
export default {
    name: 'checkDetailed',
    data() {
        return {
            context: '',
            loading: false,
            detailedData: {
              data: [], //后台返回的校验标准明细数据
              selectRow: [], //存储选中的行数据
              updateRow: [], //某一校验项目的逻辑修改结果
              deleteRow: [], //删除某一检验项目的逻辑
              insertRow: [], //添加新的校验项目
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
      changeEdit(row){//改变行记录的编辑状态
        if(row.edit){
          row.edit = false
        }else{
          row.edit = true
        }
      }
    },
    mounted(){
      this.detailedData.data.push({
        StandardProject: '2',
        CheckStartPosition: '',
        StandardLength: '',
        CheckCondition: '',
        edit: false
      })
    }
}
</script>

<style>

</style>