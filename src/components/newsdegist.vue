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
      <!--通知公告-->
      <div id="info">
        <h1>{{infodegist.NTitle}}</h1>
        <p class="title"><span>{{infodegist.NDate}}</span> <span>{{infodegist.NType}}</span></p>
        <div class="newsdgeist" v-html="infodegist.NContents">
        </div>
        <ul style="padding-bottom: 15px">
          <li>
            附件下载例表:
          </li>
          <li v-for="item in Filelist">
            <a :href="item.url" style="color: #26a2ff;padding-top: 3px;">{{item.name}}</a>
          </li>
        </ul>
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
        guid: '',  //通知公告详情
        userid: localStorage.getItem("UserID"),
        infodegist: '',  //公告详情
        Filelist: '',//附件例表
      }
    },
    activated (){
      this.guid = this.$route.query.guid;
      this.getinfodegist();
    },
    mounted(){

    },
    methods: {
      //通知详情
      getinfodegist(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.guid + md5Key);
        let getapi = "GetNewsDetails|UserID=" + this.userid + "|ID=" + this.guid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          Indicator.close();
          if (e.result == 1) {
            //请求成功
            _this.infodegist = e.list[0];
            _this.Filelist = e.list[0].filelist;

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
    background: #009966;
    color: #fff;
    font-size: 0.25rem;
    padding: 0.075rem 0.125rem;
    border-radius: 0.125rem;
  }

  .tj {
    display: none;
  }
</style>
