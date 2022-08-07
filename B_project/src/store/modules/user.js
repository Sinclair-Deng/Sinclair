import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    // 项目中已有的异步路由与服务器返回的标记信息进行对比之后最终需要展示的路由
    resultAsyncRoutes: [],
    // 最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state,userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色信息
    state.roles = userInfo.roles
  },
  // 最终计算出的路由
  SET_RESULTASYNCROUTES: (state,asyncRoutes) => {
    // vuex保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 将异步路由与常量路由及任意路由合并
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
}

const computedAsyncRoutes = (asyncRoutes,routes) => {
  // 过滤出当前用户需要展示的异步路由
  return asyncRoutes.filter(item => {
    // 数组中如果有这个元素返回的索引值一定不是-1
    if(routes.indexOf(item.name) != -1){
      // 递归，记得还有子路由
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes);
      }
      return true;
    }
  })
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'));
    }
  },

  // 获取用户信息(返回的数据包含：用户名name、用户的头像avatar、routes[返回的标志：不同的用户应该展示哪些菜单的标记]、roles(用户角色信息)、buttons[按钮的信息：按钮权限用的标记])
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token);
    if (result.code === 20000) {
      if (!result.data) {
        return reject('Verification failed, please Login again.')
      }
      // vuex存储用户的全部信息
      commit('SET_USERINFO',result.data)
      commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,result.data.routes))
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token);
    if (result.code === 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

