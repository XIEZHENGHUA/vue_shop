import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    //在request拦截器中，展示进度条
    nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.request.use(config => {
    nprogress.done()
    return config
})
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')