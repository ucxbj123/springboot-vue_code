<template>
    <div>
        <!-- 在本组件不推荐:visible.sync，因为.sync修饰符相当于触发dialog关闭回调，会将props的open设为false，但是props在子组件被修改是会报警告的
            解决方法：不使用修饰符，绑定关闭回调事件 :close="closeDialog"，触发父组件事件改变open值
        -->
        <el-dialog :visible="open" v-if="business == 'insert'" width="30%" :close="closeDialog" :before-close="closeDialog">
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="新增" /> {{title}}
            </template>
            <el-row>
                <el-col>年级名称    <el-input class="inputwidth" v-model="gradeInfo.name" placeholder="请输入年级名称"></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级编码    <el-input class="inputwidth" v-model="gradeInfo.gno" placeholder="请输入年级编码" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级主任    
                    <el-autocomplete class="inputwidth" v-model="gradeInfo.manager" placeholder="请输入年级主任" 
                    :fetch-suggestions="querySearch"
                    @select="handleSelect"
                    >
                    </el-autocomplete>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>主任邮箱    <el-input class="inputwidth" v-model="gradeInfo.email" placeholder="请输入主任邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>主任电话    <el-input class="inputwidth" v-model="gradeInfo.telephone" placeholder="请输入主任电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col :span="3">年级简介</el-col>
                <el-col :span="8">
                    <el-input class="inputwidth" v-model="gradeInfo.introducation" placeholder="请输入内容" type="textarea"
                    maxlength="50"
                    show-word-limit>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="InsertGrade" >添 加</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible="open" v-else-if="business == 'update'" width="30%" :close="closeDialog" :before-close="closeDialog" >
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="修改" /> {{title}}
            </template>
            <el-row>
                <el-col>年级名称    <el-input class="inputwidth" v-model="gradeInfo.name" disabled ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级编码    <el-input class="inputwidth" v-model="gradeInfo.gno" disabled ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级主任    
                    <el-autocomplete class="inputwidth" v-model="gradeInfo.manager" placeholder="请输入年级主任" 
                    :fetch-suggestions="querySearch"
                    @select="handleSelect"
                    >
                    </el-autocomplete>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>主任邮箱    <el-input class="inputwidth" v-model="gradeInfo.email" placeholder="请输入主任邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>主任电话    <el-input class="inputwidth" v-model="gradeInfo.telephone" placeholder="请输入主任电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col :span="3">年级简介</el-col>
                <el-col :span="8">
                    <el-input class="inputwidth" v-model="gradeInfo.introducation" placeholder="请输入内容" type="textarea"
                    maxlength="50"
                    show-word-limit>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="UpdateGrade" >修 改</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>

import { getTeachers, insertGrade, updateGrade } from '@/api/grade'


    export default {
        name:'GradeDialog',
        data() {
            return {
                gradeInfo:{
                    name:'',
                    gno:'',
                    manager:'',
                    email:'',
                    telephone:'',
                    introducation:''
                },
                teacherList: [],    //全部老师的信息，主任人选一般是在老师信息里进行获取，但是也可以自己进行填写
                
            }
        },
        props:{
            title: String, //主题
            open: {         //是否打开dialog弹窗
                type: Boolean,
                default: false
            },
            gradeRow:{      //年级信息
                type: Array,
                require: false
            },
            business: String,   //操作的类型
        },

        methods:{
            closeDialog(){
                //关闭dialog就清数据
                if(this.business == 'insert'){
                    this.gradeInfo = {}
                }
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
                this.gradeInfo.email = item.email
                this.gradeInfo.telephone = item.telephone
                this.gradeInfo.manager = item.name
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

            InsertGrade(){//添加年级新记录
                if(this.gradeInfo.name == ''){
                    this.$message('年级名称不能为空')
                    return
                }
                insertGrade(this.gradeInfo).then(res => {
                    const da = res.data
                    if(da.success){
                        this.$message({
                            message: da.msg,
                            type: 'success'
                        })
                        this.gradeInfo = {}     //清空数据
                        this.closeDialog()
                    }else{
                        this.$message({
                            message: da.msg,
                            type: 'error'
                        })
                    }
                })

            },

            UpdateGrade() {//修改年级信息
                updateGrade(this.gradeInfo).then(response => {
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

        },
        watch:{
            business:{//监视business的类型进行信息变更
                deep:true,
                handler(newvalue){
                    if(newvalue == 'update' && this.gradeRow.type !== 'undefined'){
                        var info = JSON.parse(JSON.stringify(this.gradeRow[0])) //解决父组件数据跟着变化的问题
                        this.gradeInfo = info
                    }else{
                        this.gradeInfo.name = ''
                        this.gradeInfo.gno = ''
                        this.gradeInfo.manager = ''
                        this.gradeInfo.telephone = ''
                        this.gradeInfo.email = ''
                        this.gradeInfo.introducation = ''
                    }
                }
            },
            gradeInfo2(newvalue){//监控gradeRow的数据变动，只有同时监控数据与操作类型的变更，再变更gradeInfo，这样才能动态打开获取对应的数据
                if(this.business == 'update' && typeof(newvalue) !== 'undefined'){
                    var info = JSON.parse(JSON.stringify(newvalue)) //解决父组件数据跟着变化的问题
                    this.gradeInfo = info
                }else{
                    this.gradeInfo.name = ''
                    this.gradeInfo.gno = ''
                    this.gradeInfo.manager = ''
                    this.gradeInfo.telephone = ''
                    this.gradeInfo.email = ''
                    this.gradeInfo.introducation = ''
                }
            }
        },

        computed:{//获取props传入数据的值
            gradeInfo2(){
                return this.gradeRow[0]
            }
        },

        mounted(){
            this.getTeacherList()
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