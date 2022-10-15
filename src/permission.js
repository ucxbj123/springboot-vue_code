import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    // console.log('路由跳转有token'+getToken()) //调试
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })


      NProgress.done()
    } else {
      let hasinfo
      if(store.getters.name && store.getters.userID.length > 0){
        hasinfo = true
      }
      // const hasGetUserInfo = store.getters.name    //保证用户信息一直保存在前端的vuex中，如果没有则通过token进行用户的信息获取(后续根据需要设置多个条件判断)
      
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if(hasRoles){
        hasinfo = true
      }else{
        hasinfo =false
      }
      if (hasinfo) {
        console.log('有token又有info') //调试
        next()
      } else {
        console.log('有token无info') //调试
        try {
          // get user info
          const { roles } = await store.dispatch('user/getInfov2')
          console.log('roles:',roles)

          // generate accessible routes map based on roles
          console.log('permission/generateRoutes前')  //调试
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log('permission/generateRoutes')  //调试
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          console.log('addRoutes')
          next({ ...to, replace: true })
        } catch (error) {
          console.log('路由跳转异常',error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // console.log('路由跳转无token') //调试

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
