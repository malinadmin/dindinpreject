<template>
    <div>
      <div class="bottom">
          <ul>
              <li>
                <router-link :to="{path: '/home/'}">
                <span class="icon-index"></span>
                <p>首页</p>
                </router-link>
              </li>
              <li>
                <router-link :to="{path: '/maina/'}">
                <span class="icon-menu"></span>
                  <p>满意度测评</p>
                </router-link>
              </li>
              <li>
                <router-link :to="{path: '/mainb/'}">
                <span class="icon-menus"></span>
                <p>我的党费</p>
                </router-link>
              </li>
          </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'hello',
        data () {
            return {}
        },
        mounted(){

        },
        methods: {

        }
    }
</script>

<style>
  .bottom ul{
    display: flex;
    text-align: center;
  }
  a{
    display: block;
  }
  .bottom ul li{
   flex: 1;
   border-top: 1px solid #eee;
   padding-top: 0.125rem;
   padding-bottom: 0.115rem;
   color: #666;
   font-size: 0.3rem;
  }
  .bottom ul li span{
    display: inline-block;
  }
  .bottom .icon-index{
    font-size: 0.875rem;

  }
  .bottom .icon-menu{
   font-size: 0.625rem;
    padding-top: 0.125rem;
    padding-bottom:0.175rem;

  }
  .bottom .icon-menus{
    font-size: 0.75rem;
    padding-top: 0.075rem;
    padding-bottom:0.075rem;
  }
  .router-link-exact-active{
    color: #d61515;
  }
</style>
