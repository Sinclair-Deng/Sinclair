import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api"
import { getUUID } from '@/utils/uuid_token'

const state = {
    goodsInfo: {},
    // 游客临时身份
    uuid_token: getUUID()
}
const mutations = {
    GETGOODSINFO(state, goodsInfo) {
        state.goodsInfo = goodsInfo
    }
}
const actions = {
    async getGoodsInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODSINFO', result.data)
        }
    },
    // 将产品添加到购物车中
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 此处若服务器写入数据成功，不会返回其余的数据，只是返回code==200，因此不需要三连环存储数据
        let result = await reqAddOrUpdateShopCart(skuId, skuNum);
        // 如果返回成功的标记
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
const getters = {
    categoryView(state) {
        // 如果不加{}，由于state.goodsInfo的初始状态为空对象，而空对象没有categoryView属性，会出现假的报错。
        return state.goodsInfo.categoryView || {};
    },
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {};
    },
    // 产品售卖属性的简化
    spuSaleAttrList(state) {
        return state.goodsInfo.spuSaleAttrList || [];
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}