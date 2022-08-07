// 获取品牌管理数据的模块
import request from '@/utils/request'

// 获取品牌列表的接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

// 添加品牌与修改品牌
export const reqAddOrUpdateTradeMark = (trademark) => {
    // 带给服务器的数据中携带ID————修改
    if (trademark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: trademark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: trademark })
    }
}

// 删除品牌接口
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })