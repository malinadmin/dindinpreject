<template>
  <div>
    <div class="headers papersks">
      <div>

      </div>
      <div class="title">
        满意度测评
      </div>
      <div class="jiaojuan">

      </div>
    </div>
    <div class="paperslist">
      <div class="list">
        <p class="title">
          {{Title}}
        </p>
        <ul>
          <li class="xuanzhereep" v-for="item in itemlist" @click="flag && chkdskf()">
            <p>
              <span class="xuanzhe" :SDGuid="item.SDGuid" :class="{ activeback: checkSDGuid==item.SDGuid }"></span>
              <span id="No"></span>
              <span>{{item.OptionCode}}</span>
            </p>
          </li>
        </ul>
        <div class="Next">
          <button @click="btntj()">提交</button>
        </div>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main" style="width: 300px;height:200px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import footers from '@/components/footer.vue';
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod} from  '@/servers/Ajaxgetconfing.js';
  import {echarts} from '@/servers/echarts.simple.min.js';  //图表
  import md5 from 'js-md5'; //md5加密
  import {Toast} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import {MessageBox} from 'mint-ui';
  export default {
    name: 'hello',
    data () {
      return {
        userid: localStorage.getItem("UserID"),
        SGuid: '',
        Title: '',
        itemlist: '',
        Type: '',
        checkSDGuid: '', //获得选中标识
        flag: true,
      }
    },
    mounted(){

    },
    activated (){
      this.SGuid = this.$route.query.SGuid;
      this.Type = this.$route.query.Type;
      if (this.Type == 0) {
        this.getlist();
        this.flag = true;
        $(".Next").show();
        $("#main").hide();
      } else {
        this.flag = false;
        this.getchakanlist();
        $(".Next").hide();
        //图表
        this.charts();
        $("#main").show();
      }
    },
    methods: {
      getlist(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.SGuid + md5Key);
        let getapi = "GetSatisfactionDetials|UserID=" + this.userid + "|ID=" + this.SGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list[0];
          if (succice == 1) {
            Indicator.close();
            _this.Title = list.STitle;
            _this.itemlist = list.itemlist;
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //已测评查看结果
      getchakanlist(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.SGuid + md5Key);
        let getapi = "GetParticipate|UserID=" + this.userid + "|ID=" + this.SGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list[0];
          if (succice == 1) {
            Indicator.close();
            _this.Title = list.STitle;
            _this.checkSDGuid = list.checkSDGuid;
            _this.itemlist = list.itemlist;
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      chkdskf(){
        var el = event.target;
        $(".paperslist .list").find(".xuanzhe").each(function (index) {
          $(".paperslist .list").find(".xuanzhe").eq(index).removeClass("activeback");
        })
        $(el).parents("li").find(".xuanzhe").addClass("activeback");
        /*  if($(el).parents("li").find(".xuanzhe").hasClass("activeback")){
         $(el).parents("li").find(".xuanzhe").removeClass("activeback");
         }else{
         $(el).parents("li").find(".xuanzhe").addClass("activeback");
         }*/
      },
      btntj(){
        MessageBox.confirm('确定提交吗?').then(({value, action}) => {
          this.tjok();
        });
      },
      //确认提交
      tjok(){
        Indicator.open();  //加载状态
        let SDGuid = $(".activeback").attr("SDGuid");
        let _this = this;
        let MD5 = md5(this.userid + this.SGuid + SDGuid + md5Key);
        let getapi = "SaveSatisfaction|UserID=" + this.userid + "|SGuid=" + this.SGuid + "|SDGuid=" + SDGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            Toast("感谢参与");
            history.back();
            // _this.$router.go(-1)
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
      //图表
      charts(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.SGuid + md5Key);
        let getapi = "GetParticipateMapSource|UserID=" + this.userid + "|ID=" + this.SGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          if (succice == 1) {
            var titledata = e.list[0].titledata;
            var datas = eval(e.list[0].data);
            // 指定图表的配置项和数据
            var option = {
              title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: titledata
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: '70%',
                  center: ['60%', '60%'],
                  data: datas,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
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
    }
  }
</script>

<style>
  .paperslist {
    padding: 0px 0.25rem;
    font-size: 0.35rem;
  }

  .paperslist ul li {
    font-size: 0.35rem;
    color: #666;
    margin-top: 0.625rem;
  }

  .paperslist .list {
    display: none;
  }

  .paperslist .list:first-child {
    display: block;
  }

  .paperslist .title {
    padding-top: 0.375rem;

  }

  .paperslist .title span {
    color: #2b9ad4;
  }

  .paperslist .chkebox {
    margin-top: 0.625rem;
  }

  .paperslist .chkebox .mint-cell, .paperslist .chkebox .mint-cell-wrapper {
    background: none;
  }

  .paperslist .Next {
    text-align: center;
    margin-top: 1.0rem;
  }

  .paperslist .Next button {
    border: 0;
    width: 2.5rem;
    height: 0.875rem;
    background: #ee6e27;
    font-size: 0.375rem;
    border-radius: 0.375rem;
    color: #fff;
    font-weight: bold;
  }

  .paperslist .page {
    width: 100%;
    position: absolute;
    bottom: 1.125rem;
    left: 0;
    padding: 0px 0.25rem;
    box-sizing: border-box;
  }

  .paperslist .page p {
    text-align: center;
    color: #ccc;
    margin-bottom: 0.25rem;
  }

  .paperslist .page ul {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    text-align: center;
  }

  .paperslist .page ul li {
    flex: 0 0 10%;
    border: 1px solid #ddd;
    font-size: 0.35rem;
    color: #666;
    padding: 0.25rem 0.0rem;
  }

  .wxts {
    width: 6.75rem;
    height: 1.75rem;
    border-radius: 0.125rem;
  }

  .wxtscontent {

    margin-top: 0.25rem;
    padding: 0px 0.25rem;
  }

  .wxtscontent > p {
    font-size: 0.35rem;
    background: #f5f5f5;
    padding: 0.175rem;
    color: #666;
  }

  .wxtscontent .timeout {
    font-size: 0.3rem;
    color: #999;
    padding-top: 0.375rem;
    padding-bottom: 1.25rem;
  }

  .goin {
    margin: 0.5rem 0.0rem;
    text-align: center;
  }

  .goin button {
    border: 1px solid #f78905;
    background: #fff;
    font-size: 0.325rem;
    padding: 0.3rem 0.375rem;
    color: #f78905;
    border-radius: 0.075rem;
  }

  .mint-popup {
    border-radius: 0.125rem;
  }

  .wxtscontent .numbers {
    color: #df3737;
  }

  .actives {
    color: #ee6e27 !important;
  }

  .xuanzhe {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border: 1px solid #ddd;
    vertical-align: center;
    margin-right: 0.125rem;
    position: relative;
    top: 0.125rem;
  }

  .activeback {
    background: url("../../assets/chock.png") no-repeat;
    background-size: 100%;
  }
</style>
