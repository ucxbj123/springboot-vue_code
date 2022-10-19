import { login, loginv2, logout, logoutv2, getInfo, getInfov2 } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),//口令
    name: '',//可以用于存储用户的唯一id，也就是后端返回的id，也可以是用户名，根据个人需要
    avatar: '',  //头像的路径，在actions的getinfo()动态获取用户的头像路径进行展示(后台返回的头像URL)
    baseavatar: '',
    userID:'' , //用户登录id
    usertype:'', //用户类型
    roles: [] //角色权限
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    //assgin将通过getDefaultState函数获取的原始数据覆盖现在state，即所有的属性都为空;通过函数返回每一个对象都是新的
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userID) => {
    state.userID = userID
  },
  SET_USERTYPE: (state, usertype) => {
    state.usertype = usertype
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        // console.log('getinfo:'+JSON.stringify(data))

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data
        
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  //以下是个人重写
  // springboot user/login
  loginv2(context, userInfo) {
    const { username, password, verifiCode, usertype, userID  } = userInfo
    return new Promise((resolve, reject)=>{
    loginv2({ userID: userID.trim(), password: password, verifiCode:verifiCode, usertype:usertype }).then(
      response => {
        console.log(response)
        const res = response.data
        if (res.status){
          context.commit('SET_TOKEN', res.token)
          context.commit('SET_USERTYPE', usertype)
          context.commit('SET_USERID', userID)
          setToken(res.token)
          console.log('设置token成功', res.token)
          resolve(res)
        // return true
        }else{
          resolve(res)
        }
      }
    ).catch(error => {
      reject(error)
      console.log(error)
      // return false
    })
    })
  },

  getInfov2({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfov2(state.token).then(response => {
        const { data } = response
        // console.log('getinfo:'+JSON.stringify(data))

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, userID, usertype, roles } = data
        
        commit('SET_NAME', name) //设置用户名
        commit('SET_AVATAR', avatar) //设置用户头像路径
        commit('SET_ROLES', roles) //设置角色权限
        commit('SET_USERID', userID) //设置用户ID
        commit('SET_USERTYPE', usertype) //设置用户类型
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logoutv2({ commit, state }) {
    // console.log('登出',state.token) 调试
    return new Promise((resolve, reject) => {
      logoutv2(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

