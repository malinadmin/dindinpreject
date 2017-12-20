<template>
    <div>
      <div class="tiger">

      </div>
      <div class="regedist">
        <p>欢 迎 使 用</p>
          <ul>
            <li>
                 <input type="text" name="" placeholder="请输入用户名" id="LoginName">
            </li>
            <li>
                 <input type="password" name="" placeholder="请输入密码" id="PassWord">
            </li>
          </ul>
          <div class="btndinding">
              <button @click="btnok()">立即绑定</button>
          </div>
      </div>
    </div>
</template>

<script>
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod} from  '@/servers/Ajaxgetconfing.js';
  import { MessageBox } from 'mint-ui';
  import {Toast} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import md5 from 'js-md5'; //md5加密
    export default {
        name: 'hello',
        data () {
            return {}
        },
        mounted(){
         // alert(localStorage.getItem("dduserid"))

        },
        methods: {
          btnok(){
              this.getrgedist();
          },
            getrgedist(){
              Indicator.open();  //加载状态
              let LoginName = $("#LoginName").val();
              let PassWord  = $("#PassWord").val();
              let _this = this;
              let MD5 = md5(localStorage.getItem("dduserid") + LoginName + PassWord + md5Key);
              let getapi = "SetUserInfoByCode|DingdingUserId=" +localStorage.getItem("dduserid") + "|LoginName=" + LoginName + "|PassWord=" + PassWord + "|MD5=" + MD5;
              // 创建请求
              var success = function (e) {
                var succice = e.result;
                if (succice == 1) {
                 // Indicator.open();  //加载状态
                  let MD5 = md5(localStorage.getItem("dduserid") + md5Key);
                  let getapi = "GetUserInfoByCode|DingdingUserId=" + localStorage.getItem("dduserid") + "|MD5=" + MD5;
                  // 创建请求
                  var success = function (e) {
                    //alert(JSON.stringify(e));
                    if (e.result == 1) {
                      localStorage.setItem("UserID", e.list[0].UserID)  //缓存用户信息
                      //alert(e.list[0].UserID);
                      localStorage.setItem("UserName", e.list[0].UserName)  //缓存用户姓名
                      localStorage.setItem("DepartmentPost", e.list[0].DepartmentPost) //缓存职务信息
                      localStorage.setItem("Photo", e.list[0].Photo) //缓存用户头像
                      localStorage.setItem("BirthDate", e.list[0].BirthDate.substring(5)); //缓存个人生日
                      localStorage.setItem("CheckInDate",e.list[0].CheckInDate.substring(5)); //缓存入党生日
                      localStorage.setItem("CheckInDaterd",e.list[0].CheckInDate.substring(0,4)); //缓存入党生日
                      //请求成功
                      Indicator.close();
                      //注册成功
                      MessageBox.alert('注册成功,请重新进入应用').then(action => {
                        dd.biz.navigation.close({
                          onSuccess : function(result) {
                            /*result结构
                             {}
                             */
                          },
                          onFail : function(err) {}
                        })
                      });

                    }
                    else {
                      //打印错误信息
                      alert(e.message)
                    }
                  };
                  var error = function (e) {
                    alert(e.message)
                    Indicator.close();
                  };
                  Ajaxmethod(getapi, 'get', '', success, error);
                  Indicator.close();  //关闭加载状态
                }
                else {
                  Toast(e.message)
                  Indicator.close();
                }
              };
              var error = function (e) {
                console.log(e)
                Indicator.close();
              };
              Ajaxmethod(getapi, 'get', '', success, error);
            },
        }
    }
</script>

<style>
    .regedist p{
      margin-top: 26%;
      text-align: center;
      font-size: 1.0rem;
      background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(132, 202, 252, 1)), to(rgba(49, 149, 220, 1)));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .regedist ul{
       margin-top: 3.0rem;
       padding: 0px 0.75rem;
    }
    .regedist ul li{
      height: 1.1rem;
      margin-bottom: 0.375rem;
    }
    .regedist ul li input{
      width: 100%;
      height: 100%;
      border: 1px solid #e5e5e5;
      font-size: 0.35rem;
      padding-left: 0.25rem;
      box-sizing: border-box;
    }
    .regedist ul li input:focus{
      border: 1px solid #4babef;
    }
    .btndinding{
      text-align: center;
       padding: 0px 0.75rem;
    }
    .btndinding button{
      background: #4babef;
      border: none;
      width: 100%;
      height: 1.125rem;
      color: #fff;
      margin-top: 0.75rem;
      font-size:0.375rem;
    }
    .tiger{
      border-bottom: 1px solid #eee;
    }
</style>
