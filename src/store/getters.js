const getters = {
  sidebar: state => state.app.sidebar, //侧边菜单栏的开关
  device: state => state.app.device,
  token: state => state.user.token, //用户口令
  avatar: state => state.user.avatar, //头像的路径
  name: state => state.user.name, //用户名
  usertype: state => state.user.usertype, //账号类型
  userID: state => state.user.userID, //账号
  roles: state => state.user.roles, //当前账号角色权限
  permission_routes: state => state.permission.routes, //有权限的路由信息
  visitedViews: state => state.tagsView.visitedViews, //用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
  cachedViews: state => state.tagsView.cachedViews,  //缓存的组件名单
}
export default getters
