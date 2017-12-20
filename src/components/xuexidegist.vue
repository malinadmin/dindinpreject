<template>
  <div>
    <div class="headers papersks">
      <div>

      </div>
      <div class="title">

      </div>
      <div class="">

      </div>
    </div>
    <div class="contentsdegist">
      <!--学习-->
      <div id="xuexi">
        <h1>{{edguid.EDName}}</h1>
        <p class="title"><span>{{edguid.CreateDate}}</span> <span>{{edguid.EDType}}</span></p>
        <div class="newsdgeist" v-html="edguid.EDFileContent">

        </div>
        <ul style="padding-bottom: 70px">
          <li>
            附件下载列表:
          </li>
          <li v-for="item in Filelist">
            <a :href="item.url" style="color: #26a2ff;padding-top: 3px;">{{item.name}}</a>
          </li>
        </ul>
      </div>
      <div class="alldiscuss">
        <div class="nr">
          <div class="pl">
            <input type="" name="" placeholder="写评论" id="review" v-model="pinlun" v-on:input ="inputFunc">
          </div>
          <div class="ckall">
            <div class="allpl">
              <router-link :to="{path: '/comment/',query:{guid:edguid.EDGuid}}">
                <span class="icon-pinlun"></span>
                <span>全部评论</span>
              </router-link>
            </div>
            <div class="tj">
              <button @click="pltj()">提交评论</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod} from  '@/servers/Ajaxgetconfing.js';
  import md5 from 'js-md5'; //md5加密
  import {Toast} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  export default {
    name: 'hello',
    data () {
      return {
        edguid: '', //学习详情
        userid: localStorage.getItem("UserID"),
        infodegist: '',  //公告详情
        pinlun:'',
        Filelist: '',//附件例表
      }
    },
    created(){

    },
    //首页用了只加载一次数据必须使用此生命周期
    activated(){
      this.edguid = this.$route.query.edguid;
      this.getlistxuexi();
      this.pinlun = '';
    },
    mounted(){

    },
    methods: {
      inputFunc(){
        if(this.pinlun.length!=''){
          $(".tj").show();
          $(".allpl").hide();
        }else{
          $(".tj").hide();
          $(".allpl").show();
        }
      },
      //学习详情
      getlistxuexi(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.edguid + md5Key);
        let getapi = "GetStudyDetails|UserID=" + this.userid + "|EDGuid=" + this.edguid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          if (e.result == 1) {
            //请求成功
            _this.edguid = e.list;
            _this.Filelist = e.files;
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
      //提交评论
      pltj(){
        Indicator.open();  //加载状态
        let _this = this;
        let ECContents = $("#review").val();
        let EDGuid  =this.$route.query.edguid;
        let MD5 = md5(this.userid + EDGuid + ECContents + md5Key);
        let getapi = "SaveStudyComment|UserID=" + this.userid + "|EDGuid=" + EDGuid + "|ECContents=" + ECContents + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          if (e.result == 1) {
            //请求成功
            Toast("评论已提交");
            $("#review").val('');
            $(".tj").hide();
            $(".allpl").show();
          } else {
            //打印错误信息
            alert(e.message)
            _this.qxiaopl();
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //取消评论
      qxiaopl(){
        $(".allpl").show();
        $(".tj").hide();
      },
    }
  }
</script>

<style>
  .contentsdegist {
    padding: 0px 0.25rem;
    padding-top: 0.375rem;
  }

  .contentsdegist h1 {
    text-align: center;
    font-size: 0.45rem;
    color: #333;
    font-weight: 600;
  }

  .contentsdegist .title {
    color: #999;
    padding-top: 0.25rem;
    font-size: 0.3rem;
    text-align: center;
  }

  .contentsdegist .title span:first-child {
    padding-right: 0.25rem;
  }

  .contentsdegist .newsdgeist {
    padding-top: 0.625rem;
    padding-bottom: 1.2rem;
    font-size: 0.4rem;
  }

  .alldiscuss {
    width: 100%;
    padding: 0.375rem 0.25rem 0.25rem 0.25rem;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: -5px 5px 7px 5px #ccc;
    background: #fff;
  }

  .alldiscuss .nr {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .alldiscuss .nr .pl {
    flex: 0 0 80%;
  }

  .alldiscuss .nr .pl input {
    border: none;
    width: 90%;
    padding-bottom: 0.175rem;
    border-bottom: 1px solid #ddd;
    background: url(../assets/pl.png) no-repeat left 0.05rem;
    background-size: 5%;
    padding-left: 0.5rem;
    border-radius: 0;
  }

  .alldiscuss .nr .ckall {
    flex: 0 0 20%;
  }

  .alldiscuss .nr .ckall span {
    color: #b21b1b;
    font-size: 0.375rem;
  }

  .alldiscuss .nr .ckall span:last-child {
    font-size: 0.3rem;
  }

  .tj button {
    border: 0;
    background: #fff;
    color: #b21b1b;
    font-size: 0.25rem;
    padding: 0.075rem 0.125rem;
    -border-radius: 0.125rem;
  }

  .tj {
    display: none;
    text-align: center;
  }
</style>
