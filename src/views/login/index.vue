<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      
      <div style="text-align: center;margin-bottom:10px;height:47px">
        <el-radio-group v-model="loginForm.usertype">
          <el-radio label="admin" border>管理员</el-radio>
          <el-radio label="student" border>学生</el-radio>
          <el-radio label="teacher" border>老师</el-radio>
        </el-radio-group>
      </div>

      <el-form-item prop="userID">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userID"
          v-model="loginForm.userID"
          placeholder="登录账号"
          name="userID"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="verifiCode">
        <span class="svg-container">
          <i class="el-icon-mobile-phone"></i>
        </span>
        <el-input
          ref="verifiCode"
          v-model="loginForm.verifiCode"
          type="text"
          placeholder="验证码"
          name="verifiCode"
          tabindex="3"
          auto-complete="on"
        />
      </el-form-item>
      <div style="margin-bottom:10px;height:47px">
          <el-image :src="imageurl"  @click.native="getimage"></el-image>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import axios from 'axios'


export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        // callback(new Error('The password can not be less than 6 digits'))
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        verifiCode:'',
        usertype:'student',
        userID:''
      },
      loginRules: {
        userID: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifiCode: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      imageurl:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted(){
    console.log(this) //方便查看vue身上的数据
    //初始化获取验证码
    this.getimage()

  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // const result = this.$store.dispatch('user/loginv2', this.loginForm)
          // if (result) {
          //   console.log('handleLogi执行成功',this)
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // } else {
          //   this.loading = false
          // }
          this.$store.dispatch('user/loginv2', this.loginForm).then(
            response => {
              console.log('handleLogi执行成功',this)
              // if(this.$store.getters.usertype == 'teacher'){
              //   // console.log('路由',teacherRouter)
              //   this.$router.addRoutes(teacherRouter) //动态添加路由规则
              //   this.$router.options.routes = this.$router.options.routes.concat(teacherRouter) //手动更新
              //   console.log('动态添加路由成功',this.$router)
              //   this.$router.push({ path: this.redirect || '/' })
              //   this.loading = false
              // }else{
                if (response.status){
                  console.log('login.vue 账号验证成功',response)
                  this.$router.push({ path: this.redirect || '/' })
                  this.loading = false
                }else{
                  console.log('login.vue 账号验证失败',response)
                  this.$message.error(response.msg);
                  this.loading = false
                }
                
              // }
              
            }
          ).catch(error => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getimage(){ //通过异步获取后端返回的验证码图片
      axios({
        responseType:'arraybuffer',
        url:'/springboot/login/getVerifiCodeImage',
        method:'get'
      }).then(response => {
        return (
          "data:image/png;base64,"+
          btoa(
            new Uint8Array(response.data).reduce(
              (data,byte) => data+String.fromCharCode(byte),
              ""
            )
          )
        )
      }).then(data => {
        this.imageurl = data
        // console.log(this.imageurl)
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
