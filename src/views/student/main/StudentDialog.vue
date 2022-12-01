<template>
    <div>
        <!-- 在本组件不推荐:visible.sync，因为.sync修饰符相当于触发dialog关闭回调，会将props的open设为false，但是props在子组件被修改是会报警告的
            解决方法：不使用修饰符，绑定关闭回调事件 :close="closeDialog"，触发父组件事件改变open值
        -->
        <el-dialog :visible="open" width="30%" :close="closeDialog" :before-close="closeDialog" v-el-drag-dialog >
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="修改" /> {{title}}
            </template>
            <el-row class="el">
                <el-col>账号    <el-input class="inputwidth" v-model="info.sno" placeholder="请输入账号" disabled></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>姓名    <el-input class="inputwidth" v-model="info.name" placeholder="请输入姓名" disabled></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>性别    
                    <el-select v-model="info.gender" placeholder="请选择" disabled>
                        <el-option v-for="type in genderType" :key="type.value" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="el">
                <el-col>邮箱    <el-input class="inputwidth" v-model="info.email" placeholder="邮箱" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>电话    <el-input class="inputwidth" v-model="info.telephone" placeholder="请输入电话" ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>地址    <el-input class="inputwidth" v-model="info.address" placeholder="请输入居住地址" ></el-input></el-col>
            </el-row>
            <!-- 底部的按钮-->
            <span slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="Updateinfo" >修 改</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { updateStudent } from '@/api/student'

    export default {
        name:'StudentDialog',
        directives:{
            elDragDialog
        },
        data() {
            return {
                info:{
                    sno: '',
                    name: '',
                    gender: '',
                    email: '',
                    telephone: '',
                    address: '',
                },
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
            Row:{      //学生账号信息
                type: Array,
                require: false
            }
        },

        methods:{
            closeDialog(){
                this.$emit('close')
            },

            Updateinfo(){//修改账号信息
                let info = this.getUserinfo()
                updateStudent(info).then(response => {
                    const res = response.data
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
            resetUserinfo(){//重置user的信息为空
                this.info.name = ''
                this.info.sno = ''
                this.info.telephone = ''
                this.info.address = ''
                this.info.email = ''
                this.info.gender = ''
            },
            getUserinfo(){
                let info2 = {}
                info2.name = this.info.name
                //后端的传参对象为userinfo
                info2.userID = this.info.sno
                info2.telephone = this.info.telephone
                info2.address = this.info.address
                info2.email = this.info.email
                info2.gender = this.info.gender
                return info2
            }

        },
        watch:{
            userInfo2(newvalue){
                if(typeof(newvalue) !== 'undefined'){//避免发生 "SyntaxError: Unexpected token u in JSON at position 0"
                    var info2 = JSON.parse(JSON.stringify(newvalue)) //解决父组件数据跟着变化的问题
                    this.info = info2
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