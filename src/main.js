import Vue from "vue";
import VueRouter from 'vue-router'
import routes from './router/router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css';
import '@/css/flexible.debug.css';
import '@/css/common.css';
//import  $ from  'jquery' ;
import {} from '../static/flexible.debug.js';
//配置路由
Vue.use(VueRouter)
Vue.use(MintUI)
const router = new VueRouter({
  mode: 'history',
  routes,
})
new Vue({
  router,
}).$mount('#app');
