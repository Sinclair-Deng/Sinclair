// 对于axios进行二次封装
import axios from 'axios'
// 引入进度条
import nProgress from 'nprogress'
// start 进度条开始动  done 进度条结束
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 1、利用axios对象的create方法创建一个axios实例
// 2、requests就是axios，只是需要稍微配置一下
const requests = axios.create({
    // 配置对象
    // 基础路径，发送请求的时候，路径中出现api
    baseURL: '/mock',
    // 请求超时的时间为5s
    timeout: 5000
})

// 请求拦截器：在发送请求之前，请求拦截器可以检测到，并在请求发送之前做一些事情
requests.interceptors.request.use((config) => {
    // config:配置对象，对象中的headers(请求头)很重要
    nProgress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 成功的回调函数，服务器的响应数据返回以后，响应拦截器可以检测到并做一些事情
    nProgress.done()
    return res.data
},(err) => {
    // 响应失败的回调函数
    return err.message
})

// 对外暴露
export default requests