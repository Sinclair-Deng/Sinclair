import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api'
import { setToken, getToken, removeToken } from '@/utils/token'
// 登录与注册的仓库
const state = {
    code: '',
    token: getToken(),
    userInfo: {}
}

const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR(state) {
        // 将仓库中的相关用户信息清空
        state.token = '';
        state.userInfo = {};
        // 本地存储数据清空
        removeToken();
    }
}

const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        // 此处的获取验证码接口直接将验证码返回，实际中应该发送至手机
        let result = await reqGetCode(phone)
        if (result.code == 200) {
            commit('GETCODE', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户注册
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error("faile"))
        }
    },
    // 用户登录
    async userLogin({ commit }, user) {
        let result = await reqUserLogin(user)
        if (result.code == 200) {
            // 用户登录成功且获取到token
            commit('USERLOGIN', result.data.token)
            // 持久化存储token
            setToken(result.data.token);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户信息
    async getUserInfo({ commit }) {
        let result = await reqUserInfo();
        if (result.code == 200) {
            commit('GETUSERINFO', result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户退出登录
    async userLogout({ commit }) {
        let result = await reqLogout();
        if (result.code == 200) {
            commit('CLEAR')
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}

const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}