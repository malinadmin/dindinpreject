<template>
  <div>
    <div class="header">
      <div class="lefticon"></div>
      <div class="navtab" id="satisficing">
        <mt-navbar v-model="selected">
          <mt-tab-item id="xuexi"><i><em>待测评</em> <!--<span class="bage"></span>--></i></mt-tab-item>
          <mt-tab-item id="kaoshi"><i><em>已测评</em></i></mt-tab-item>
        </mt-navbar>
      </div>
      <div class="righticon"></div>
    </div>
    <div class="contents">
      <!-- tab-container -->
      <mt-tab-container v-model="selected" @change="silders" >
        <!--待测评-->
        <mt-tab-container-item id="xuexi">
          <div class="list">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                         :auto-fill="false"
                         ref="loadmore">
              <ul>
                <li v-for="item in list">

                  <div class="meadetext">
                    <p>
                      {{item.STitle}}
                    </p>
                    <div class="bottomtext">
                      <p>
                        <span>{{item.DepartmentName}}</span>
                        <span>{{item.CreateDate}}</span>
                      </p>
                      <p class="state">
                        <router-link :to="{path: '/myddegist/',query:{SGuid:item.SGuid,Type:0}}">
                          <button>参与</button>
                        </router-link>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <div id="nodata" v-if="list.length==''"> 暂无数据.. </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="kaoshi">
          <!--已测评-->
          <div class="list">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                         :auto-fill="false"
                         ref="loadmore1">
              <ul>
                <li v-for="item in list">

                  <div class="meadetext">
                    <p>
                      {{item.STitle}}
                    </p>
                    <div class="bottomtext">
                      <p>
                        <span>{{item.DepartmentName}}</span>
                        <span>{{item.CreateDate}}</span>
                      </p>
                      <p class="state">
                        <router-link :to="{path: '/myddegist/',query:{SGuid:item.SGuid,Type:1}}">
                          <button class="result">查看结果</button>
                        </router-link>
                      </p>
                    </div>
                  </div>


                </li>
              </ul>
              <div id="nodata" v-if="list.length==''"> 暂无数据.. </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <div class="footer">
      <footers></footers>
    </div>
  </div>
</template>
<script>
  import footers from '@/components/footer.vue';
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod} from  '@/servers/Ajaxgetconfing.js';
  import md5 from 'js-md5'; //md5加密
  import {Toast} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  export default {
    name: 'page-tab-container',
    components: {
      footers
    },
    data () {
      return {
        value: '',
        PageIndex: 1,
        PageSize: 10,
        CateType: '',
        list: [],  //列表数据
        allLoaded: false,
        scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalCount: '',  //总条数
        selected: 'xuexi',
        userid: localStorage.getItem("UserID"),
      }
    },
    watch: {
      selected(val, oldVal) {
        if (val == "xuexi") {
          this.dcp();
        } else {
          this.kaoshi();
        }
      },
    },
    mounted(){

    },
    activated(){
      if(!this.userid){
        this.$router.push({path: '/regedist/'});
      }else{
        this.list = [];
        var Type = '';
        this.getlist();
      }
    },
    methods: {
      getlist(Type){
        Indicator.open();  //加载状态
        Type = Type ? Type : 0;
        let _this = this;
        let MD5 = md5(this.userid + Type + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetSatisfactionList|UserID=" + this.userid + "|Type=" + Type + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.totalCount = totalCounts;
            for (var i = 0; i < list.length; i++) {
              _this.list.push(list[i])
              $(".bage").text(e.totalCount);
            }
          }
          else {
            console.log(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      loadTop(){
        //刷新
        this.list = [];
        this.scrollMode = "touch";
        this.PageIndex = 1;
        let text = $("#satisficing .mint-navbar .mint-tab-item.is-selected em").text();  //获取当前nav文字用于重置刷新方法
        console.log(text)
        if (text.trim() == "待测评") {
          let type = 0;
          this.getlist(type);
          this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "已测评") {
          let type = 1;
          this.getlist(type);
          this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      loadBottom(){
          this.PageIndex++;
          let text = $("#satisficing .mint-navbar .mint-tab-item.is-selected em").text();  //获取当前nav文字用于重置刷新方法
          if (text.trim() == "待测评") {
            if (this.totalCount == this.list.length) {
                Toast("没有更多数据了");
            } else{
              let Type = 0;
              this.getlist(Type);
            }
            this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

          } else if (text.trim() == "已测评") {
            if (this.totalCount == this.list.length) {
              Toast("没有更多数据了");
            }else{
              let Type = 1;
              this.getlist(Type);
            }
            this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      //已评测
      kaoshi(){
        let type = 1;
        this.list = [];
        this.getlist(type);
      },
      //待评测
      dcp(){
        let type = 0;
        this.list = [];
        this.getlist(type);
      },
      //关闭底部考试banner
      close(){
        $(".botomimg").hide();
      },
      //滑动事件
      silders(){
        alert(233)
      }
    },
  }
</script>

<style scoped>
  .header {
    display: flex;
    padding: 0px 0.25rem;
    border-bottom: 1px solid #ddd;
  }

  .header .navtab {
    overflow: hidden;
    flex: 0 0 60%;
  }

  .header .lefticon {
    flex: 0 0 20%;
  }

  .header .righticon {
    flex: 0 0 20%;
    text-align: right;
  }

  .header .navtab img {
    width: 0.575rem;
    height: 0.6rem;
    position: absolute;
    left: 0.0rem;
    margin-top: -0.075rem;
  }

  .header .navtab span {
    display: inline-block;
    width: 0.375rem;
    height: 0.375rem;
    text-align: center;
    line-height: 0.375rem;
    border-radius: 100%;
    background: #d61515;
    position: absolute;
    right: -0.45rem;
    font-size: 0.3rem;
    color: #fff;
  }

  .header .icon-fanhui {
    font-size: 0.45rem;
    color: #999;
    display: inline-block;
    line-height: 1.125rem;
  }

  .header .icon-serach {
    font-size: 0.5rem;
    color: #999;
    line-height: 1.125rem;
  }

  .mint-tab-item-label i {
    color: #999;
    font-size: 0.375rem;
    font-style: normal;
    position: relative;
  }

  .mint-navbar .mint-tab-item {
    padding: 13px 0;
    padding-bottom: 11px;
    position: relative;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border: 0;
  }

  .mint-navbar .mint-tab-item.is-selected i {
    color: #333;
  }

  .mint-navbar .mint-tab-item.is-selected:after {
    content: ''; /*CSS伪类用法*/
    position: absolute; /*定位背景横线的位置*/
    bottom: 3%;
    left: 0.9rem;
    background: #d61515; /*宽和高做出来的背景横线*/
    width: 1rem;
    height: 0.125rem;
    border-radius: 55px;
  }

  .banner {
    height: 4.375rem;
    background: #e5e5e5;
  }

  .list {
    padding: 0px 0.25rem;
  }

  .list ul li {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.25rem;
    margin-top: 0.25rem;
  }

  .list ul li a {
    display: flex;
  }

  .list ul li > div {
    height: 1.625rem;
    overflow: hidden;
  }

  .list .meadetext {
    flex: 1;
  }

  .list .meadetext > p {
    font-size:0.4rem;
    color: #333;
    font-weight: bold;
    height: 1.0rem;
    overflow: hidden;
  }

  .list .bottomtext {
    display: flex;
    justify-content: space-between;
  }

  .list .bottomtext p {
    font-size:0.35rem;
    font-weight: normal;
  }

  .list .bottomtext p span {
    color: #999;
  }

  .list .bottomtext .state .yx {
    color: #2ae217
  }

  .list .bottomtext .state .noyx {
    color: #eaa12f;
    display: none;
  }

  .list .bottomtext .state button {
    border: 1px solid #4cb6e7;
    padding: 0px 0.175rem;
    height: 0.625rem;
    color: #4cb6e7;
    text-align: center;
    background: #fff;
  }

  .list ul li:nth-child(4) div {
    height: auto;
  }

  .list ul li:nth-child(4) .meadeimg {
    display: none;

  }

  .list ul li:nth-child(4) .meadetext {
    flex: 1;
  }

  .list ul li:nth-child(4) .meadetext img {
    width: 100%;
    height: 5.0rem;
    background: #e5e5e5;
  }

  .banner .bannertext {
    width: 100%;
    height: 0.75rem;
    line-height: 0.75rem;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    bottom: 0;
    font-size: 0.35rem;
    display: flex;
    justify-content: space-between;
    padding: 0px 0.25rem;
    color: #fff;
    box-sizing: border-box;
  }

  .banner .bannertext .active {
    color: #d61515;
    font-size: 0.375rem;
  }

  .kaosilist {
    margin-top: 0.625rem;
  }

  .kaosilist ul li {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 0.375rem;
    background: #fafafa;
    margin-bottom: 0.25rem;
  }

  .kaosilist ul li .leftlist {
    flex: 0 0 80%;
  }

  .kaosilist ul li .leftlist .title {
    font-size: 0.425rem;
    color: #333;
    padding-bottom: 0.175rem;
  }

  .kaosilist ul li .leftlist .time {
    font-size: 0.3rem;
    color: #999;
    padding-bottom: 0.075rem;
  }

  .kaosilist ul li .leftlist .time:last-child {
    padding-bottom: 0;
  }

  .kaosilist ul li .rightlist {
    flex: 0 0 20%;
    text-align: right;
  }

  .kaosilist ul li .rightlist button {
    display: block;
    padding: 0.125rem;
    background: #fff;
  }

  .kaosilist ul li .rightlist .ks {
    border: 1px solid #4cb6e7;
    color: #4cb6e7;
    background: #fff;
  }

  .kaosilist ul li .rightlist .jg {
    border: 1px solid #ec9a0a;
    color: #ec9a0a;
  }

  .togzhilist {
    padding: 0.0rem 0.125rem;
  }

  .togzhilist ul li {
    border-bottom: 1px solid #ddd;
    padding: 0.25rem 0.0rem;
  }

  .togzhilist ul li p {
    font-size: 0.375rem;
    color: #333;
    padding-bottom: 0.25rem;
  }

  .togzhilist ul li .bottomtext {
    display: flex;
    justify-content: space-between;
    font-size: 0.3rem;
    color: #4cb6e7;
  }

  .togzhilist ul li .bottomtext span:last-child {
    color: #999;
  }

  .botomimg {
    width: 100%;
    height: 2.0rem;
    background: url(../../assets/botomms.png) no-repeat;
    background-size: 100% 100%;
    position: fixed;
    bottom: 1.575rem;
  }

  .botomimg span {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 100%;
    position: absolute;
    right: 0.25rem;
    margin-top: 0.25rem;
    z-index: 99;
  }

  .result {
    border: 1px solid #ec9a0a !important;
    color: #ec9a0a !important;
  }
</style>
