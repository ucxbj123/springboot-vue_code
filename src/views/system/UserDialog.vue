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
            <el-row class="el">
                <el-col>
                    类型    
                    <el-select v-model="userinfo.usertype" placeholder="请选择" clearable>
                        <el-option v-for="type in accountType" :key="type.value" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>账号    <el-input class="inputwidth" v-model="userinfo.userID" placeholder="请输入账号"></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>姓名    <el-input class="inputwidth" v-model="userinfo.name" placeholder="请输入姓名" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>密码    <el-input class="inputwidth" v-model="userinfo.password" placeholder="请输入密码" show-password ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>性别    
                    <el-select v-model="userinfo.gender" placeholder="请选择" >
                        <el-option v-for="type in genderType" :key="type.value" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>邮箱    <el-input class="inputwidth" v-model="userinfo.email" placeholder="邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>电话    <el-input class="inputwidth" v-model="userinfo.telephone" placeholder="请输入电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>地址    <el-input class="inputwidth" v-model="userinfo.address" placeholder="请输入居住地址" ></el-input></el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="InsertUserOne" >添 加</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible="open" v-else-if="business == 'update'" width="30%" :close="closeDialog" :before-close="closeDialog" >
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="修改" /> {{title}}
            </template>
            <el-row class="el">
                <el-col>
                    类型    
                    <el-select v-model="userinfo.usertype" placeholder="请选择" disabled>
                        <el-option v-for="type in accountType" :key="type.value" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>账号    <el-input class="inputwidth" v-model="userinfo.userID" placeholder="请输入账号"></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>姓名    <el-input class="inputwidth" v-model="userinfo.name" placeholder="请输入姓名" ></el-input></el-col>
            </el-row>
             <el-row class="el">
                <el-col>密码    <el-input class="inputwidth" v-model="userinfo.password" placeholder="重置密码" show-password ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>性别    
                    <el-select v-model="userinfo.gender" placeholder="请选择" >
                        <el-option v-for="type in genderType" :key="type.value" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>邮箱    <el-input class="inputwidth" v-model="userinfo.email" placeholder="邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>电话    <el-input class="inputwidth" v-model="userinfo.telephone" placeholder="请输入电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>地址    <el-input class="inputwidth" v-model="userinfo.address" placeholder="请输入居住地址" ></el-input></el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="UpdateUsers" >修 改</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
import { insertUser } from '@/api/system'

    export default {
        name:'UserDialog',
        data() {
            return {
                userinfo:{
                    userID: '',
                    name: '',
                    gender: '',
                    email: '',
                    telephone: '',
                    address: '',
                    usertype: '',
                    password: ''
                },
                accountType:[
                    { value: 'admin', label: '管理员'},
                    { value: 'student', label: '学生'},
                    { value: 'teacher', label: '教师'},
                ],
                genderType:[
                    { value: '男', label: '男'},
                    { value: '女', label: '女'},
                ]
            }
        },
        props:{
            title: String, //主题
            open: {         //是否打开dialog弹窗
                type: Boolean,
                default: false
            },
            Row:{      //年级信息
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
            InsertUserOne(){//添加账号
                if(this.userinfo.name == '' || this.userinfo.userID == '' || this.userinfo.usertype == ''){
                    this.$message('账号、姓名和账号类型都不能为空')
                    return
                }
                if( this.business == 'insert' && this.userinfo.password == ''){
                    this.$message('密码不能为空')
                    return
                }
                insertUser(this.userinfo).then(response => {
                    const da = response.data
                    if(da.success){
                        this.$message({
                            message: da.msg,
                            type: 'success'
                        })
                        this.userinfo = {}     //清空数据
                        this.closeDialog()
                    }else{
                        this.$message({
                            message: da.msg,
                            type: 'error'
                        })
                    }
                })
            },

            UpdateUsers(){//修改账号信息

            }

        },
        watch:{
            business:{//监视business的类型进行信息变更
                deep:true,
                handler(newvalue){
                    if(newvalue == 'update' && this.Row.type !== 'undefined'){
                        var info = JSON.parse(JSON.stringify(this.Row[0])) //解决父组件数据跟着变化的问题
                        this.userinfo = info
                        this.userinfo.password = ''
                    }else{
                        this.userinfo.name = ''
                        this.userinfo.userID = ''
                        this.userinfo.telephone = ''
                        this.userinfo.address = ''
                        this.userinfo.email = ''
                        this.userinfo.gender = ''
                        this.userinfo.usertype = ''
                    }
                }
            },
            userInfo2(newvalue){//监控gradeRow的数据变动，只有同时监控数据与操作类型的变更，再变更gradeInfo，这样才能动态打开获取对应的数据
                if(this.business == 'update' && typeof(newvalue) !== 'undefined'){
                    var info = JSON.parse(JSON.stringify(newvalue)) //解决父组件数据跟着变化的问题
                    this.userinfo = info
                    this.userinfo.password = ''
                }else{
                    this.userinfo.name = ''
                    this.userinfo.userID = ''
                    this.userinfo.telephone = ''
                    this.userinfo.address = ''
                    this.userinfo.email = ''
                    this.userinfo.gender = ''
                    this.userinfo.usertype = ''
                }
            }
        },

        computed:{//获取props传入数据的值
            userInfo2(){
                return this.Row[0]
            }
        },
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