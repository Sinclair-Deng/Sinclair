// 当前这个模块：API进行统一管理
import requests from "./request";
import mockRequests from "./mockRequest"

// 三级联动接口
// /api/product/getBaseCategoryList  get请求 无参数
// 发送请求：axios发请求返回Promise对象
export const reqCategoryList = () => requests.get(`/product/getBaseCategoryList`)
// 获取home首页轮播图的数据
export const reqListContainer = () => mockRequests.get(`/banner`)
// 获取floor数据
export const reqFloor = () => mockRequests.get(`/floor`)

// 获取搜索模块数据 请求方式：POST 需要带参数
// 当前接口(获取搜索模块的数据)，给服务器传递一个默认参数[至少是一个空对象，否则接收不到数据]
export const reqSearchInfo = params => requests({ url: "/list", method: "post", data: params })

// 获取产品详情信息的接口
export const reqGoodsInfo = skuId => requests({ url: `/item/${skuId}`, method: 'get' })

// 将产品添加到购物车中(获取更新某一个产品的个数)
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

// 获取购物车列表数据接口
export const reqCartList = () => requests({ url: "/cart/cartList", method: 'get' })

// 删除购物车产品的接口
export const reqDeleteCartById = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

// 修改商品的选中状态
export const reqUpdateCheckedById = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })

// 获取验证码
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: "get" })

// 用户注册
export const reqUserRegister = data => requests({ url: "/user/passport/register", data, method: "post" })

// 用户登录
export const reqUserLogin = data => requests({ url: "/user/passport/login", data, method: "post" })

// 获取用户信息[需要带着用户的token向服务器要用户信息]
export const reqUserInfo = () => requests({ url: "/user/passport/auth/getUserInfo", method: "get" })

// 用户退出登录
export const reqLogout = () => requests({ url: "/user/passport/logout", method: "get" })

// 获取用户地址信息
export const reqAddressInfo = () => requests({ url: "/user/userAddress/auth/findUserAddressList", method: "get" })

// 获取商品清单
export const reqOrderInfo = () => requests({ url: "/order/auth/trade", method: "get" })

// 提交订单
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: "post" })

// 获取支付信息
export const reqPayInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: "get" })

// 获取支付订单状态
export const reqPayStatus = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: "get" })

// 获取个人中心数据
export const reqMyOrderList = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: "get" })