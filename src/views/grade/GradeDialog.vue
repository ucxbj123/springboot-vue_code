<template>
    <div>
        <el-dialog :visible.sync="open" v-if="business == 'insert'" width="30%">
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
                    <el-autocomplete class="inputwidth" v-model="gradeInfo.manager" placeholder="请输入年级编码" 
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
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="open" v-else-if="business == 'update'" width="30%">
            <!-- 主题-->
            <template slot="title">
                <svg-icon icon-class="修改" /> {{title}}
            </template>
            <el-row>
                <el-col>年级名称    <el-input class="inputwidth" v-model="gradeInfo.name"></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级编码    <el-input class="inputwidth" v-model="gradeInfo.gno" disabled ></el-input></el-col>
            </el-row>
            <el-row class="el">
                <el-col>年级主任    
                    <el-autocomplete class="inputwidth" v-model="gradeInfo.manager" placeholder="请输入年级编码" 
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
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
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
                teacherList: [
                    {value:'你好'},
                    {value:'撒旦你'}
                    ],    //全部老师的信息，主任人选一般是在老师信息里进行获取，但是也可以自己进行填写
                
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
                console.log('item',item)
            }

        },
        watch:{
            business(newvalue){//监视business的类型进行信息变更
                if(newvalue == 'update'){
                    var info = JSON.parse(JSON.stringify(this.gradeRow[0])) //解决父组件数据跟着变化的问题
                    this.gradeInfo = info
                }
            }
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