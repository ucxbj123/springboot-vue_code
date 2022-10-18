<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="getUseImage+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>

          <el-dropdown-item @click.native="centerDialogVisible = true">
              修改密码
          </el-dropdown-item>

          <el-dropdown-item @click.native="updatesetting">
              {{settingContext}}
          </el-dropdown-item>

          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>

          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>

          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog
        title="修改密码"
        :visible.sync="centerDialogVisible"
        width="38%"
        >
        <el-row :gutter="20">
          <el-col :span="8" :offset="2"><span>登录账号 </span><el-input label="登录账号" disabled v-model="userID"><svg-icon slot="prefix" icon-class="people" /></el-input></el-col>
          <el-col :span="8" :offset="4">姓名 <el-input label="姓名" disabled v-model="name"><svg-icon slot="prefix" icon-class="用户" /></el-input></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" :offset="2">原密码 <el-input placeholder="请输入原密码" clearable show-password v-model="changeForm.oldpassword"><svg-icon slot="prefix" icon-class="password" /></el-input></el-col>
          <el-col :span="8" :offset="4">新密码 <el-input placeholder="请输入新密码" clearable show-password v-model="changeForm.newpassword"><svg-icon slot="prefix" icon-class="password" /></el-input></el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Closedialog">取 消</el-button>
          <el-button type="primary" @click="ChangePassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters , mapState} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import request from '@/utils/request'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,   //指向public内的静态资源
      centerDialogVisible: false,
      changeForm:{
        oldpassword: '',
        newpassword: '',
        Id: this.$store.state.user.userID,
        type: this.$store.state.user.usertype
      },
      settingContext:'关闭系统设置',
      showSettings: this.$store.state.settings.showSettings
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    getUseImage(){
      // console.log(this.publicPath+this.avatar) 调试
      return this.publicPath+this.avatar //获取后台返回给全局user.avatar的图片URL并解析
    },
    ...mapState('user',['name','userID','usertype']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logoutv2')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    ChangePassword(){//修改密码
      if(this.changeForm.oldpassword =='' || this.changeForm.newpassword ==''){
        this.$message({
          message:'密码不能为空',
          type:'warning'
        })
        return
      }
      request({//异步请求
        responseType:'json',
        data: this.changeForm,
        url: '/login/updatepassword',
        method: 'post'
      }).then(response =>{
        this.$message({
          message:response.data.result,
          type:response.data.status
        })
        this.centerDialogVisible = false

      })
    },

    Closedialog(){//关闭修改密码界面
      this.centerDialogVisible = false
      this.changeForm.newpassword = ''
      this.changeForm.oldpassword = ''
    },

    updatesetting(){ //控制右边的系统设置的显示
      if(this.showSettings){
        this.settingContext = '打开系统设置'
        this.showSettings = false
        this.$store.dispatch('settings/changeSetting',{
          key: 'showSettings',
          value: false
        })
      }else{
        this.settingContext = '关闭系统设置'
        this.showSettings = true
        this.$store.dispatch('settings/changeSetting',{
          key: 'showSettings',
          value: true
        })
      }
    }

  },

  watch:{
    centerDialogVisible(newValue,oldValue){ //对dialog关闭进行监视，若关闭则设置新旧密码为空，防止密码泄露
      if(newValue === false){
        this.changeForm.newpassword = ''
        this.changeForm.oldpassword = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
