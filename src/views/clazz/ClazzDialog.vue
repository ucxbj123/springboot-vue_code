<template>
    <div>
        <!-- 在本组件不推荐:visible.sync，因为.sync修饰符相当于触发dialog关闭回调，会将props的open设为false，但是props在子组件被修改是会报警告的
            解决方法：不使用修饰符，绑定关闭回调事件 :close="closeDialog"，触发父组件事件改变open值
        -->
        <el-dialog :visible="open" v-if="business == 'insert'" width="30%" :close="closeDialog" :before-close="closeDialog" v-el-drag-dialog >
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="新增" /> {{title}}
            </template>
            <el-row>
                <el-col>班级名称    <el-input class="inputwidth" v-model="clazzInfo.name" placeholder="请输入班级名称"></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班级编码    <el-input class="inputwidth" v-model="clazzInfo.cno" placeholder="请输入班级编码" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班级主任    
                    <el-autocomplete class="inputwidth" v-model="clazzInfo.coordinator" placeholder="请输入班级主任" 
                    :fetch-suggestions="querySearch"
                    @select="handleSelect"
                    >
                    </el-autocomplete>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>班主任邮箱    <el-input class="inputwidth" v-model="clazzInfo.email" placeholder="请输入班主任邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班主任电话    <el-input class="inputwidth" v-model="clazzInfo.telephone" placeholder="请输入班主任电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>
                    所属年级    <el-select v-model="SelectGrade" filterable placeholder="请选择所属年级" value-key="gno" @change="ChangeValue">
                        <el-option
                        v-for="item in GradeList"
                        :key="item.gno"
                        :label="item.name"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col :span="3">班级简介</el-col>
                <el-col :span="8">
                    <el-input class="inputwidth" v-model="clazzInfo.introducation" placeholder="请输入内容" type="textarea"
                    maxlength="50"
                    show-word-limit>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="InsertClazzOne" >添 加</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible="open" v-else-if="business == 'update'" width="30%" :close="closeDialog" :before-close="closeDialog" v-el-drag-dialog >
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="修改" /> {{title}}
            </template>
            <el-row>
                <el-col>班级名称    <el-input class="inputwidth" v-model="clazzInfo.name" disabled ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班级编码    <el-input class="inputwidth" v-model="clazzInfo.cno" disabled ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班级主任    
                    <el-autocomplete class="inputwidth" v-model="clazzInfo.coordinator" placeholder="请输入班级主任" 
                    :fetch-suggestions="querySearch"
                    @select="handleSelect"
                    >
                    </el-autocomplete>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>班主任邮箱    <el-input class="inputwidth" v-model="clazzInfo.email" placeholder="请输入班主任邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>班主任电话    <el-input class="inputwidth" v-model="clazzInfo.telephone" placeholder="请输入班主任电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>
                    <!-- 如果v-model绑定的值为对象，则必须设置value-key，否下拉选择会出错-->
                    所属年级    <el-select disabled v-model="SelectGrade" filterable placeholder="请选择所属年级" value-key="gno" @change="ChangeValue">
                        <el-option
                        v-for="item in GradeList"
                        :key="item.gno"
                        :label="item.name"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col :span="3">班级简介</el-col>
                <el-col :span="8">
                    <el-input class="inputwidth" v-model="clazzInfo.introducation" placeholder="请输入内容" type="textarea"
                    maxlength="50"
                    show-word-limit>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="UpdateClazz" >修 改</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>

import { getTeachers, insertClazz, updateClazz, getGrades } from '@/api/clazz'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui


    export default {
        name:'ClazzDialog',
        directives:{
            elDragDialog
        },
        data() {
            return {
                clazzInfo:{
                    name:'',
                    cno:'',
                    coordinator:'',
                    email:'',
                    telephone:'',
                    introducation:'',
                    gno:'',
                    grade_name:'',
                    number:0
                },
                teacherList: [],    //全部老师的信息，主任人选一般是在老师信息里进行获取，但是也可以自己进行填写
                GradeList:[],       //全部年级信息
                SelectGrade: {},    //选中的年级信息  
            }
        },
        props:{
            title: String, //主题
            open: {         //是否打开dialog弹窗
                type: Boolean,
                default: false
            },
            clazzeRow:{      //年级信息
                type: Array,
                require: false
            },
            business: {
                type: String,
                default: 'insert',    //操作的类型
            }
        },

        methods:{
            closeDialog(){
                //关闭dialog就清数据
                if(this.business == 'insert'){
                    this.clazzInfo = {}
                }
                //清空选择器的值，否则重新打开会直接显示
                this.SelectGrade = {}
                this.$emit('close')
            },
            querySearch(queryString,callback){//输入建议方法
                var teacherList = this.teacherList
                var results = queryString ? teacherList.filter(this.createFilter(queryString)) : teacherList;
                // 调用 callback 返回建议列表的数据
                callback(results);
            },
            createFilter(queryString) {//模糊查询
                return (teacher) => {
                return (teacher.value.indexOf(queryString) !== -1);
                }
            },
            handleSelect(item){//选中建议项触发
                // console.log('item',item) //查看item的值
                this.clazzInfo.email = item.email
                this.clazzInfo.telephone = item.telephone
                this.clazzInfo.coordinator = item.name
            },

            getTeacherList(){//获取教师信息
                getTeachers().then(res => {
                    let list = res.data.data
                    let len
                    for(len in list){//添加value属性，自定义建议是取value的值
                        list[len].value = list[len].name+'-'+list[len].userID
                    }
                    this.teacherList = list
                })
            },

            InsertClazzOne(){//添加班级新记录
                if(this.clazzInfo.name == '' || this.clazzInfo.cno == ''){
                    this.$message('班级名称、编码不能为空')
                    return
                }
                insertClazz(this.clazzInfo).then(res => {
                    const da = res.data
                    if(da.success){
                        this.$message({
                            message: da.msg,
                            type: 'success'
                        })
                        this.clazzInfo = {}     //清空数据
                        this.closeDialog()
                    }else{
                        this.$message({
                            message: da.msg,
                            type: 'error'
                        })
                    }
                })

            },

            UpdateClazz() {//修改班级信息
                updateClazz(this.clazzInfo).then(response => {
                    const res = response.data
                    console.log(res)
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
            },

            GetGradesList(){//获取年级信息用于班级所属年级选择
                getGrades().then(res => {
                    let list = res.data.data
                    this.GradeList = list
                })
            },

            ChangeValue(value){//下拉框选中触发的事件
                this.clazzInfo.grade_name = value.name
                this.clazzInfo.gno = value.gno
            },
            reset(){
                this.clazzInfo.name = ''
                this.clazzInfo.gno = ''
                this.clazzInfo.coordinator = ''
                this.clazzInfo.telephone = ''
                this.clazzInfo.email = ''
                this.clazzInfo.introducation = ''
                this.clazzInfo.grade_name = ''
                this.clazzInfo.cno = ''
            }

        },
        watch:{
            business:{//监视business的类型进行信息变更
                deep:true,
                handler(newvalue){
                    if(newvalue == 'update' && this.clazzeRow.type !== 'undefined'){
                        var info = JSON.parse(JSON.stringify(this.clazzeRow[0])) //解决父组件数据跟着变化的问题
                        this.clazzInfo = info
                    }else{
                        this.reset()
                    }
                }
            },
            clazzInfo2(newvalue){//监控gradeRow的数据变动，只有同时监控数据与操作类型的变更，再变更gradeInfo，这样才能动态打开获取对应的数据
                if(this.business == 'update' && typeof(newvalue) !== 'undefined'){
                    var info = JSON.parse(JSON.stringify(newvalue)) //解决父组件数据跟着变化的问题
                    this.clazzInfo = info
                }else{
                    this.reset()
                }
            }
        },

        computed:{//获取props传入数据的值
            clazzInfo2(){
                return this.clazzeRow[0]
            }
        },

        mounted(){
            this.getTeacherList()
            this.GetGradesList()
        }
    }
</script>

<style scoped>
.inputwidth{
    width: 300px;
}
.el{
    margin-top: 20px;
}

</style>