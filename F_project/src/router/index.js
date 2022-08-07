// 配置路由的文件
import Vue from 'vue'
import VueRouter from 'vue-router'
// 使用插件
Vue.use(VueRouter)
import routes from './routes'
import store from '@/store'

// 先把VueRouter原型对象的push保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push与replace
/* 
    第一个参数：告诉原来的push方法，往哪里跳转(传递哪些参数) 
    第二个参数：成功的回调
    第三个参数：失败的回调
*/
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        /* 
            call与apply的却别
            相同点：都可以调用一次函数，都可以修改函数的上下文一次
            不同点：call传递参数用逗号隔开，而apply方法需要传递数组 
        */
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

// 配置路由
let router = new VueRouter({
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 返回的这个y=0，代表滚动条在页面的最上方
        return { y: 0 }
    }
})

// 全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
    // to：可以获取到要跳转到哪个路由的信息
    // from：可以获取到从哪个路由跳转而来的信息
    // next：放行函数 next()放行 next(path) 放行到指定路由
    // 只有在用户登录的情况下才会有token，未登录一定没有token
    let token = store.state.user.token;
    // 用户信息 [注：空对象的布尔值始终为true]
    let name = store.state.user.userInfo.name;

    // 如果用户登录
    if (token) {
        // 如果路由跳转到login[不能去，停留在首页]
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            // 路由跳转的不是login
            if (name) {
                // 如果用户信息已有
                next()
            } else {
                // 没有用户信息，需要派发actions让仓库存储用户信息再跳转
                try {
                    await store.dispatch("getUserInfo");
                    next()
                } catch (error) {
                    // 身份失效，清除token，重新登录
                    await store.dispatch('userLogout');
                    next('/login')
                }
            }
        }
    } else {
        // 用户未登录的情况下，不能去交易相关(trade)、支付相关(pay,paysuccess)以及个人中心，如果跳转的是以上路由，皆跳转至登录页面
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            // 将未登录的时候想去而没有去成的信息，存储于地址栏中
            next('/login?redirect=' + toPath);
        } else {
            // 如果用户跳转的不是上述的路由，则放行
            next();
        }
    }
})

export default router;