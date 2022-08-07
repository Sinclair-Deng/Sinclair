import { reqSearchInfo } from '@/api'
// search模块的小仓库
// state:仓库存储数据的地方
const state = {
    // 仓库初始状态
    searchList: {}
}
// mutations:修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}
// actions:处理actions，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 获取search模块数据
    async getSearchList({ commit }, params = {}) {
        // params形参：是当用户派发actions时，第二个参数传递过来的，它至少是一个空对象
        let result = await reqSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    // 当前形参state是search仓库下的，并非总的仓库
    goodsList(state){
        // 下述写法是为了当网络不给力时，返回的是空数组而非undefined
        return state.searchList.goodsList||[]
    },
    trademarkList(state){
        // 下述写法是为了当网络不给力时，返回的是空数组而非undefined
        return state.searchList.trademarkList||[]
    },
    attrsList(state){
        // 下述写法是为了当网络不给力时，返回的是空数组而非undefined
        return state.searchList.attrsList||[]
    },

}

export default {
    state,
    mutations,
    actions,
    getters
}