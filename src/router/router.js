import App from '../App'
const home = r => require.ensure([], () => r(require('../page/home/home.vue')), 'home') //框架主页
const main = r => require.ensure([], () => r(require('../page/main/main.vue')), 'main') //首页
const maina = r => require.ensure([], () => r(require('../page/maina/maina.vue')), 'maina') //满意度测评
const mainb = r => require.ensure([], () => r(require('../page/mainb/mydangfei.vue')), 'mainb') //我的党费
const newsdegist = r => require.ensure([], () => r(require('../components/newsdegist.vue')), 'newsdegist') //新闻详情页
const xuexidegist = r => require.ensure([], () => r(require('../components/xuexidegist.vue')), 'xuexidegist') //学习详情页
const papers = r => require.ensure([], () => r(require('../page/Papers/papers.vue')), 'papers') //试卷详情页
const comment = r => require.ensure([], () => r(require('../page/Comment/Comment.vue')), 'comment') //评论列表
const myddegist = r => require.ensure([], () => r(require('../page/maina/degist.vue')), 'myddegist') //满意度测评详情
const regedist = r => require.ensure([], () => r(require('../page/regedist/regeist.vue')), 'regedist') //钉钉用户注册
const management = r => require.ensure([], () => r(require('../page/mainb/Paymanagement.vue')), 'management') //缴纳管理
const managementdegist = r => require.ensure([], () => r(require('../page/mainb/mangementdegist.vue')), 'managementdegist') //缴纳登记
export default [{
  path: '/',
  component: App, //顶层路由，对应index.html
  children: [
     //  地址为空时跳转home页面
    {
      path: '',
      redirect: '/home'
    },
    //框架主页
    {
      path: '/home',
      component: main,
    },
    //首页
    {
      path: '/main',
      component: main,
    },
    //满意度测评
    {
      path: '/maina',
      component: maina,
    },
    // 我的党费
    {
      path: '/mainb',
      component: mainb,
    },
    //新闻详情页
    {
      path: '/newsdegist',
      component: newsdegist,
    },
    //学习详情页
    {
      path: '/xuexidegist',
      component: xuexidegist,
    },
    //考试详情页
    {
      path: '/papers',
      component: papers,
    },
    //评论列表
    {
      path: '/comment',
      component: comment,
    },
    //满意度测评
    {
      path: '/myddegist',
      component: myddegist,
    },
    //钉钉用户注册
    {
      path: '/regedist',
      component: regedist,
    },
    //缴纳管理
    {
      path: '/management',
      component: management,
    },
    //缴纳登记
    {
      path: '/managementdegist',
      component: managementdegist,
    },
  ]

}]

