<template>
  <div>
    <div class="headers papersks">
      <div>

      </div>
      <div class="title">
        我的党费
      </div>
      <div class="jlglreep">
        <span class="jlgl" v-if="jurisdiction===true"><router-link :to="{path: '/management/'}"><img
          src="../../assets/jlgl.png" alt=""></router-link></span>
      </div>
    </div>
    <div class="dangfeiheader">
      <div class="myziliao">
        <div class="mytouxiang">
          <img :src="Photo" v-if="Photo!=null">
        </div>
        <div class="gerenname">
          <p>{{UserName}}</p>
          <p v-if="DepartmentPost!='null'">{{DepartmentPost}}</p>
          <p v-if="DepartmentPost=='null'"></p>
        </div>
      </div>
      <div class="myziliao yjdf">
        <div class="myyj">
          <p>每月应缴党费</p>
          <p>￥ <span>{{dfmoney.SBDPayableMoney}}</span></p>
        </div>
        <div>
          <p>欠缴党费</p>
          <p>￥ <span>{{dfmoney.SBDPayableArrears}}</span></p>
        </div>
      </div>
    </div>
    <div class="jfjl">
      <div class="owing">
        <p class="current" @click="jfnavs(0)"><span><img src="../../assets/down.png" alt=""></span> 欠缴记录</p>
        <ul id="list1">
          <li v-for="item in ArrearsList" v-if="ArrearsList.length!=''">
            <span class="time">{{item.SBYear}}年{{item.SBMonth}}月</span>
            <span class="qj">欠缴</span>
            <span class="je">{{item.PMMoney}}元</span>
            <span><button @click="Alipay(item)">支付</button></span>
          </li>
          <li v-if="ArrearsList.length==''">
            <p>暂无欠缴!</p>
          </li>
        </ul>
        <p @click="jfnavs(1)"><span><img src="../../assets/down.png" alt=""></span> 已缴记录</p>
        <ul id="list2">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                       :auto-fill="false"
                       ref="loadmore">
            <li v-for="item in yjList">
              <span class="time">{{item.SBYear}}年{{item.SBMonth}}月</span>
              <span class="qj">缴纳类型:{{item.SBDType}}</span>
              <span class="je">缴纳金额:{{item.SBDActualMoney}}元</span>
              <span style="display: block;margin-top: 5px;">缴纳日期:{{item.SBDActualTime}}</span>
            </li>
            <li v-if="yjList.length==''">
              <p>暂无记录!</p>
            </li>
          </mt-loadmore>
        </ul>
      </div>
    </div>
    <!--支付-->
    <div id="applys" style="display:none">

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
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'hello',
    components: {
      footers
    },
    data () {
      return {
        UserName: localStorage.getItem("UserName"),  //获取用户姓名
        DepartmentPost: localStorage.getItem("DepartmentPost"), //获取职位信息
        Photo: localStorage.getItem("Photo"), //获取用户头像
        userid: localStorage.getItem("UserID"),
        dfmoney: '',
        ArrearsList: '', //欠缴列表
        yjList: [], // 已缴列表
        PageIndex: 1,
        PageSize: 5,
        allLoaded: false,
        scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalCount: '',  //总条数
        jurisdiction: false,
      }
    },
    mounted(){

    },
    activated(){
      if (!this.userid) {
        this.$router.push({path: '/regedist/'});
      } else {
        this.getdangfei();
        $(".owing ul").eq(0).show();
        //this.navtable(); //选项卡折叠
        this.getyijiao(); //已缴记录
        this.GetAuthorization() //判断是否有权限操作党费缴纳管理
      }
    },
    methods: {
      getdangfei(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + md5Key);
        let getapi = "GetMyPartyMoney|UserID=" + this.userid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          if (e.result == 1) {
            //请求成功
            _this.dfmoney = e.list[0];
            _this.ArrearsList = e.list[0].Arrearslist;
          } else {
            //打印错误信息
            alert(e.message)
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      navtable(){
        $(".owing ul").eq(0).show();
        $(".owing p").click(function () {
          $(this).toggleClass("current").siblings('.owing p').removeClass("current");//切换图标
          $(this).next(".owing ul").slideToggle(200).siblings(".owing ul").slideUp(200);
          console.log($(this).next(".owing ul").text())
        });
      },
      jfnavs(obj){
        if (obj == 0) {
          $("#list2").hide(200);
          $("#list2").prev().removeClass("current")
          if ($("#list1").prev().hasClass("current")) {
            $("#list1").hide(200);
            $("#list1").prev().removeClass("current")
          } else {
            $("#list1").show(200);
            $("#list1").prev().addClass("current")
          }
        } else {
          $("#list1").hide(200);
          $("#list1").prev().removeClass("current")
          if ($("#list2").prev().hasClass("current")) {
            $("#list2").hide(200);
            $("#list2").prev().removeClass("current")
          } else {
            $("#list2").show(200);
            $("#list2").prev().addClass("current")
          }
        }
      },
      getyijiao(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetMyPartyStandingBookPayLog|UserID=" + this.userid + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          var list = e.list;
          var totalCounts = e.totalCount;  //总条数返回
          if (e.result == 1) {
            //请求成功
            Indicator.close();  //关闭加载状态
            _this.totalCount = totalCounts;
            for (var i = 0; i < list.length; i++) {
              _this.yjList.push(list[i])
            }
          } else {
            //打印错误信息
            alert(e.message)
            Indicator.close();  //关闭加载状态
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
        this.yjList = [];
        this.scrollMode = "touch";
        this.PageIndex = 1;
        this.getyijiao();
        this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      loadBottom(){
        this.PageIndex++;
        if (this.totalCount == this.yjList.length) {
          Toast("没有更多数据了");
        } else {
          this.getyijiao();
        }
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      //判断用户是否有操作缴费权限
      GetAuthorization(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + md5Key);
        let getapi = "GetAuthorization|UserID=" + this.userid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          if (e.result == 1) {
            //请求成功
            _this.jurisdiction = true;
          } else {
            //打印错误信息
            console.log(e.message)
          }
        };
        var error = function (e) {
          alert(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //支付
      Alipay(item){
        MessageBox.confirm('确定支付'+ item.SBMonth + '月账单吗?').then(action => {
           //调用接口
            Indicator.open();  //加载状态
            let SBDGuid = item.SBDGuid;
            let SBDPayableMoney = item.PMMoney;
            let MD5 = md5(this.userid +SBDGuid + SBDPayableMoney + md5Key);
            let getapi = "GoAlipay|UserID=" + this.userid + "|SBDGuid=" + SBDGuid+ "|SBDPayableMoney=" + SBDPayableMoney + "|MD5=" + MD5;
            // 创建请求
            var success = function (e) {
              Indicator.close();
              if (e.result == 1) {
                  $("#applys").append(e.list[0].form);
                  $("#alipaysubmit").submit();
              } else {
                //打印错误信息
                console.log(e.message)
              }
            };
            var error = function (e) {
              alert(e)
              Indicator.close();
            };
            Ajaxmethod(getapi, 'get', '', success, error);
        });

      }
    }
  }
</script>

<style>
  .dangfeiheader {
    padding: 0.0rem 0.375rem;
  }

  .jfjl {
    padding-bottom: 1.3rem;
  }

  .dangfeiheader .myziliao {
    margin-top: 0.375rem;
    padding: 0.375rem;
    box-shadow: 0px 3px 5px #f6d5d5;
    border-radius: 7px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dangfeiheader .myziliao div {
    flex: 1;
  }

  #list1 li span:last-child {
    position: absolute;
    right: 0;
  }

  #list1 li span button {
    border: none;
    padding: 3px 15px;
    background: #FF6600;
    border-radius: 3px;
    color: #fff;

  }

  .owing ul {
    display: none;
  }

  .owing p span img {
    width: 0.3rem;
    height: 0.25rem;
    transform: rotate(271deg);
  }

  .current img {
    transform: none !important;
  }

  .dangfeiheader .myziliao .mytouxiang {
    flex: 0 0 1.625rem;
    height: 1.625rem;
    border-radius: 100%;
    background: #ccc;
    overflow: hidden;
  }

  .dangfeiheader .myziliao .gerenname {
    font-size: 0.35rem;
    color: #333;
    padding-left: 0.375rem;

  }

  .dangfeiheader .myziliao .gerenname p:last-child {
    font-size: 0.325rem;
    color: #999;
    padding-top: 0.375rem;
  }

  .dangfeiheader .yjdf {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    text-align: center;
    color: #999;
  }

  .dangfeiheader .yjdf p:first-child {
    font-size: 0.4rem;
    color: #666;
    padding-bottom: 0.25rem;
  }

  .dangfeiheader .yjdf span {
    font-size: 0.35rem;
    color: #d04545;
  }

  .dangfeiheader .yjdf .myyj {
    position: relative;
  }

  .dangfeiheader .yjdf .myyj:after {
    content: ''; /*CSS伪类用法*/
    position: absolute; /*定位背景横线的位置*/
    right: 0;
    top: 0;
    background: #ddd; /*宽和高做出来的背景横线*/
    width: 0.025rem;
    height: 100%;
  }

  .owing {
    margin-top: 0.5rem;
  }

  .jlglreep {
    text-align: right;
  }

  .jlgl img {
    width: 0.425rem;
    height: 0.5rem;
    vertical-align: middle;

  }

  .owing > p {
    background: #e4e4e4;
    font-size: 0.4rem;
    color: #999;
    padding: 0.25rem 0.375rem;
    border-bottom: 1px solid #fff;
  }

  .owing ul li {
    border-bottom: 1px solid #ddd;
    padding: 0.375rem;
    font-size: 0.35rem;
  }

  .owing ul li span {
    padding-right: 0.25rem;
  }

  .owing ul li .time {
    color: #5b87d8;
  }

  .owing ul li .qj {
    color: #999;
  }

  .owing ul li .je {
    color: #d04545;
  }

  .owing ul li p {
    color: #999;
  }
</style>
