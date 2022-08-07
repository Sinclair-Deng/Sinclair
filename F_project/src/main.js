import Vue from 'vue'
import App from './App.vue'
// 三级联动组件————全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
// 第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
// ElementUI注册组件的时候，除了全局注册，还有另外一种写法，即挂在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 引入路由
import router from '@/router'
// 引入仓库
import store from './store'
// 引入mockServer.js
import '@/mock/mockServer'
// 引入swiper样式
import 'swiper/css/swiper.css'
// 统一接收api文件夹中全部的请求函数
import * as API from '@/api'
// 引入插件
import VueLazyload from 'vue-lazyload'
// 引入懒加载图片
import lazyload from '@/assets/lazyload.gif'
// 注册插件
Vue.use(VueLazyload, {
  // 懒加载默认的图片
  loading: lazyload
})

// 引入表单校验插件
import "@/plugins/validate"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 全局事件总线$bus的配置
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  // 注册路由信息，当此处书写router时，组件身上都拥有$route与$router属性。
  router,
  // 注册仓库：组件实例的身上会多一个$store属性
  store
}).$mount('#app')
