import { reqCategoryList, reqFloor, reqListContainer } from '@/api'

// home模块的小仓库
// state:仓库存储数据的地方
const state = {
    // state中数据默认初始值不要瞎写，服务器返回对象(数组)，初始值就是对象(数组)
    categoryList: [],
    bannerList: [],
    floor: []
}
// mutations:修改state的唯一手段
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    LISTCONTAINER(state, bannerList) {
        state.bannerList = bannerList
    },
    FLOOR(state, floor) {
        state.floor = floor
    }
}
// actions:处理actions，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 通过API里面的接口函数调用，向服务器发送请求，获取服务器的数据
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        if (result.code == 200) {
            commit('CATEGORYLIST', result.data)
        }
    },
    // 获取首页轮播图的数据
    async listContainer({ commit }) {
        let result = await reqListContainer()
        if (result.code == 200) {
            commit('LISTCONTAINER', result.data)
        }
    },
    // 获取floor数据
    async floor({ commit }) {
        let result = await reqFloor()
        if (result.code == 200) {
            commit('FLOOR', result.data)
        }
    }
}
// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}