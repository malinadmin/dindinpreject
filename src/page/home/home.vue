<template>
  <div>
    <div>
      <mains></mains>
    </div>
  </div>
</template>

<script>
  import mains from '@/page/main/main.vue'  //主页
  import {Indicator} from 'mint-ui';
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod} from  '@/servers/Ajaxgetconfing.js';
  import { MessageBox } from 'mint-ui';
  import md5 from 'js-md5'; //md5加密
  export default {
    name: 'hello',
    components: {
      mains
    },
    data () {
      return {
        agentId:'',
        Url:'',
        corpid:'',
      }
    },
    mounted(){

    },
    created(){

    },
    methods: {
        messgesbox(){
          MessageBox({
            title: '提示',
            message: '当前帐号未绑定钉钉是否前往绑定?',
            showCancelButton: true,
            closeOnClickModal:false,
          });
        },
      //获取钉钉userid
      getdd(){
        this.Url = window.location.href;  // window.location.href //http://192.168.1.130:8080/x5/home
        let MD5 =md5(this.agentId + this.Url + md5Key);
        let getapi = "GetDingDingJsskdinfo|AgentId=" + this.agentId + "|Url=" + this.Url + "|MD5=" + MD5;
        //alert(getapi)
        var _this = this;
        var success = function (e) {
            //alert(JSON.stringify(e));
            if(e.result==1){
              var js = e.list[0];
             dd.config({
                agentId: js.agentId, // 必填，微应用ID
                corpId: js.corpid, //必填，企业ID
                timeStamp: js.timestamp, // 必填，生成签名的时间戳
                nonceStr: js.nonceStr, // 必填，生成签名的随机串
                signature: js.signature, // 必填，签名
                type: 0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                jsApiList: ['runtime.info'] // 必填，需要使用的jsapi列表，注意：不要带dd。
              });
              //alert(js.corpid);
              dd.error(function(error){
                /**
                 {
                    message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
                    errorCode:"错误码"
                 }
                 **/
                alert('dd error: ' + JSON.stringify(error));
              });
              dd.ready(function() {
                //alert("进入拉取用户一步")
                dd.runtime.permission.requestAuthCode({
                  corpId: js.corpid,
                  onSuccess: function(result) {
                   // alert(JSON.stringify(result));
                      let Code = result.code;
                      let MD5 = md5(Code + md5Key);
                      let getapi = "GetDingDingUserInfoByCode|Code=" + Code + "|MD5=" + MD5;
                   var success = function (e) {
                        //alert(JSON.stringify(e));
                        if(e.result==1){
                            //如果成功拉取用户
                          //alert(e.list[0].UserID);
                           localStorage.setItem("dduserid",e.list[0].UserID);
                          //获取用户基本信息
                          Indicator.open();  //加载状态
                          let MD5 = md5(e.list[0].UserID + md5Key);
                          let that = this;
                          let getapi = "GetUserInfoByCode|DingdingUserId=" + e.list[0].UserID + "|MD5=" + MD5;
                          // 创建请求
                          var success = function (e) {
                            Indicator.close();
                            if (e.result == 1) {
                              //请求成功
                              localStorage.setItem("UserID", e.list[0].UserID)  //缓存用户信息
                             //alert(substring(e.list[0].UserID));
                              localStorage.setItem("UserName", e.list[0].UserName)  //缓存用户姓名
                              localStorage.setItem("DepartmentPost", e.list[0].DepartmentPost) //缓存职务信息
                              localStorage.setItem("Photo", e.list[0].Photo) //缓存用户头像
                              localStorage.setItem("BirthDate", e.list[0].BirthDate.substring(5)); //缓存个人生日
                              localStorage.setItem("CheckInDate",e.list[0].CheckInDate.substring(5)); //缓存入党生日
                              localStorage.setItem("CheckInDaterd",e.list[0].CheckInDate.substring(0,4)); //缓存入党生日
                            } else if(e.result==4){
                                //前往绑定页面
                              _this.messgesbox();
                              $(".mint-msgbox-confirm").click(function(){
                                //确定
                                _this.$router.push({ path: '/regedist/' });
                              });
                              $(".mint-msgbox-cancel").click(function () {
                                //取消
                                //否则退出应用
                                dd.biz.navigation.goBack({
                                  onSuccess : function(result) {

                                  },
                                  onFail : function(err) {}
                                })
                              })
                            }
                            else {
                              //打印错误信息
                              alert(e.message)
                            }
                          };
                          var error = function (e) {
                            console.log(e)
                            Indicator.close();
                          };
                          Ajaxmethod(getapi, 'get', '', success, error);
                        }else{

                        }
                    };
                    var error = function (e) {
                       alert(JSON.stringify(e));
                    };
                    Ajaxmethod(getapi, 'get', false, success, error);
                  },
                  onFail : function(err) {
                    alert(JSON.stringify(err));
                  }

                });
              });
            }
        };
        var error = function (e) {
          console.log(e)
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
       //跳转注册页
       getregeist(){

       },
    }
  }
</script>

<style>
  /*.mint-cell-value{
      flex: 1;
  }*/
  .bottom .mint-tab-item-icon{
    width: auto;
  }
  .bottom .mint-tab-item span{
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    font-size: 0.8rem;
  }
  .bottom .mint-tab-item-label{
    font-size: 0.25rem;
  }
  .bottom .mint-tab-item .icon-menu{
    font-size: 0.54rem;
    padding-top: 0.125rem;
  }
  .bottom .mint-tab-item .icon-menus{
    font-size: 0.6rem;
    padding-top: 0.075rem;
  }
  .bottom .mint-tabbar > .mint-tab-item.is-selected{
    background: none;
    color: #d61515;
  }
</style>
