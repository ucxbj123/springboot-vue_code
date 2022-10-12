const getters = {
  sidebar: state => state.app.sidebar, //侧边菜单栏的开关
  device: state => state.app.device,
  token: state => state.user.token, //用户口令
  avatar: state => state.user.avatar, //头像的路径
  name: state => state.user.name, //用户名
  usertype: state => state.user.usertype //账号类型
}
export default getters
