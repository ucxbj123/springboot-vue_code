<template>
  <div class="app-container">
    <el-row class="module-height" :gutter="20">
      <!-- 年级-->
      <el-col :span="6">
        教师 <el-input class="inputwidth"  v-model="tno" placeholder="请输入教师账号" :disabled="allow"></el-input>
      </el-col>
      <el-col :span="6" >
        <el-button type="primary" @click.native="getTnoClass(tno)" ><svg-icon icon-class="确定" /> 确 定</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click.native="Reset" >重 置</el-button>
      </el-col>
    </el-row>
    <el-tabs type="border-card" v-model="tagName">
        <el-tab-pane label="任课班级" name="Shift">
            <!-- 穿梭框-->
            <el-transfer
            style="text-align: left; display: inline-block"
            v-model="selectValue"
            filterable
            filter-placeholder="请输入班级进行搜索"
            :props="{
                key: 'cno',
                label: 'name'
            }"
            :titles="['班级', `${teacherName}`]"
            :button-texts="['取消', '任职']"
            :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
            }"
            @change="handleTapChange"
            :data="data">
            <span slot-scope="{ option }">{{ option.cno }} - {{ option.name }}</span>
            </el-transfer>
        </el-tab-pane>
        <el-tab-pane label="教学内容" name="content">
            <el-select v-model="cno" filterable placeholder="请选择" @change="changeSelect">
                <el-option
                v-for="item in options"
                :key="item.cno"
                :label="item.clazz_name"
                :value="item.cno">
                </el-option>
            </el-select>
            <!-- 文本框-->
            <el-row class="content">
                <el-col :span="8">
                    <el-input
                        type="textarea"
                        placeholder="任课内容"
                        v-model="content"
                        maxlength="50"
                        show-word-limit
                        >
                    </el-input>
                </el-col>
            </el-row>
            <!-- 按钮-->
            <el-row>
                <el-col>
                    <el-button type="primary" round icon="el-icon-check" @click.native="handover(content)">提 交</el-button>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getClass, insertClassBatch, deleteClassBatch, updateContent, getContentByTnoAndCno } from '@/api/teacher'
import { partObject } from '@/utils/validate'
 
export default {
    name:"TeacherClass",
    data() {
        return {
            selectValue: [], //穿梭框右侧的值
            data: [],       //总的数据
            tno: '',        //教师编号
            cno:'',         //选择器绑定的班级编号
            teacherName: '无',    //教师姓名
            tagName: 'Shift',
            allow: false,   //是否禁用输入框
            options: [],    //选择绑定的值
            content: '',    //文本框的任课内容
        }
    },

    methods:{
        handleTapChange(CurrentValue,move,changeValue){//穿梭框右侧列表元素变化时触发的事件
            let classinfo = []
            //进行深拷贝，避免影响data的数据
            let newdata = JSON.parse(JSON.stringify(this.data))
            //处理数据返回给后台
            newdata.forEach(item => {
                changeValue.forEach(v => {
                    if(item.cno == v){
                        item['tno'] = this.tno
                        item['clazz_name'] = item.name
                        //item['clazz_name']必须放在前面，否则原来的name的值会不见
                        item['name'] = this.teacherName
                        classinfo.push(item)
                    }
                })
            })
            // console.log('结果',classinfo)    //调试，查询数据处理结果
            if(move == 'right'){
                insertClassBatch(classinfo).then(response =>{
                    this.$message({
                        message: response.data.msg,
                        type: 'info'
                    })
                })
            }else if(move == 'left'){
                deleteClassBatch(classinfo).then(response =>{
                    this.$message({
                        message: response.data.msg,
                        type: 'info'
                    })
                })
            }
        },

        Reset(){
            this.tno = ''
            this.allow = false
            this.cno = ''
            this.data = []
            this.selectValue = []
            this.teacherName = '无'
            this.content = ''
        },

        getTnoClass(tno){//获取班级信息和任课班级用于穿梭框
            //校验是否填写教师编号
            if(tno == ''){
                this.$message({
                    message: '请输入教师编号，为必填项',
                    type: 'info'
                })
                //中断操作
                return
            }
            getClass(tno).then(response => {
                const res = response.data.data
                console.log('结果',res)     //调试，查看返回结果
                this.data = res.clazz.map(v => {
                    let keys = [ 'cno', 'name']
                    return partObject(v,keys)
                })
                this.selectValue = res.class.map(v => {
                    return v['cno']
                })
                this.teacherName = res.teacher.name

                //锁定输入框
                this.allow = true
                
            })
        },

        handover(content){//提交教师班级的授课内容
            if(this.cno == ''){
                this.$message('班级不能为空，是必选项')
                return
            }
            updateContent(content,this.tno,this.cno).then(response =>{
                const res =response.data
                this.$message({
                    message: res.msg,
                    type: 'success'
                })
                //提交成功后清除内容
                this.content = ''
            })
        },
        changeSelect(val){//用于选择班级时，获取任课内容并显示在文本中
            if(this.tno == '') return
            getContentByTnoAndCno(this.tno, val).then(response =>{
                const res = response.data
                this.content = res.data
            })
        }
    },

    watch:{
        selectValue:{//根据穿梭框值的变化，动态改变选择器的值
            deep:true,
            immediate:true,
            handler(newValue,oldValue){
                let option = []
                //进行深拷贝，避免影响data的数据
                let newdata = JSON.parse(JSON.stringify(this.data))
                newdata.forEach(item => {
                    newValue.forEach(v => {
                        if(item.cno == v){                           
                            item['clazz_name'] = item.name
                            option.push(item)
                        }
                    })
                })
                this.options = option
            }
        }
    }
}
</script>

<style scoped>
.module-height{
  height: 70px;
}

.inputwidth{
    width: 200px;
}

.buttonMenu{
    margin-bottom: 10px;
}
.content{
    margin-top: 20px;
    margin-bottom: 20px;
}

</style>