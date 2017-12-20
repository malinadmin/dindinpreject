<template>
  <div>
    <div class="headers papersks">
      <div>
      </div>
      <div class="title">
        <div class="kstitme">
          <span id="timer"></span>
          <span><i class="one">{{numbers}}</i><i class="two">/{{timu.length}}</i></span>
        </div>
        <div class="dtqk">
          答题情况
        </div>
      </div>
      <div class="jiaojuan" @click="Paper()">
        <span>交卷</span>
      </div>
    </div>
    <div class="paperslist">
      <div v-for="(item,index) in timu" class="list" :etguid="item.etguid " :name="item.odguid">
        <p class="title">
          {{index + 1}}、 {{item.etname}}
          <span style="display: none" id="state">{{item.choice}}</span>
        </p>
        <ul>
          <li v-for="part in item.items" class="xuanzhereep">
            <p @click="xuanze" class="odguids"><span class="xuanzhe" :No="part.No"></span> <span
              id="No">{{part.No}}.</span><span>{{part.Answer}}</span>
            </p>
          </li>
        </ul>
        <div class="Next">
          <button @click="next(index)">下一题</button>
        </div>
      </div>
      <div class="page">
        <p><span class="icon-all"></span></p>
        <ul>
          <li v-for="(item,index) in timu" @click="pages(index)" :name="item.odguid">
            {{index + 1}}
          </li>
        </ul>
      </div>
    </div>
    <!--距离考试还有10分钟时弹出提示对话框-->
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
      <div class="wxts">
        <img src="../../assets/wxts.png">
      </div>
      <div class="wxtscontent">
        <p>
          您好!距离考试结束还有<span class="numbers">10</span>分钟了哦，要抓紧哦~
          时间抵达后，系统会直接交卷。
        <p class="timeout">
          时间抵达后，系统会直接交卷。
        </p>
        </p>
      </div>
      <div class="goin">
        <button @click="jxks">继续考试</button>
      </div>
    </mt-popup>
    <!--考试结束时弹出对话框-->
    <mt-popup
      v-model="popupVisibleend"
      popup-transition="popup-fade">
      <div class="wxts">
        <img src="../../assets/wxts.png">
      </div>
      <div class="wxtscontent">
        <p>
          哈喽，考试已经结束，你可以查看刚才你的答题情况哦~
        <p class="timeout">
          时间抵达后，系统会直接交卷。
        </p>
        </p>
      </div>
      <div class="goin">
        <button class="resindex">返回首页</button>
        <button @click="dtqk()">答题情况</button>
      </div>
    </mt-popup>
    <!--答题情况-->
    <div class="dtreep">
      <p class="dt">
        <span class="icon-all"></span>
      </p>
      <ul class="dtlist">
        <li v-for="(item,index) in list" :class="{erryo:item.IsTrue==0}" @click="dtqkclcik(index)">{{index + 1}}</li>
      </ul>
      <div class="titelsreep">
        <div class="titels" v-for="(item,index) in ksda">
          <p>
            <span>{{index + 1}}、</span> {{item.etname}}
          </p>
          <p style="color:#32cf39;padding-top: 0.25rem">
            <span>正确答案："{{item.zqda}}"</span>
          </p>
          <!-- <p class="youda">
             <span :class="{grren:item.zqda==item.checkeditem}">你选择的答案："{{item.checkeditem}}"</span>
           </p>-->
          <ul>
            <li v-for="part in item.items">
              <span :class="{activeback:part.IsChecked==1}"></span>
              {{part.No}}.{{part.Answer}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {md5Key} from '@/servers/serversconfing.js';
  import{Ajaxmethod, servertime,chat} from  '@/servers/Ajaxgetconfing.js';
  import md5 from 'js-md5'; //md5加密
  import {Toast} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import {MessageBox} from 'mint-ui';
  export default {
    name: 'hello',
    data () {
      return {
        value: '',
        options: [],
        popupVisible: false,
        popupVisibleend: false,
        EPGuid: '',
        userid: localStorage.getItem("UserID"),
        timu: '',  //题目
        numbers: 0,
        Eptime: '',// 考试分钟
        timer: '', //定时器
        ksda: [], //查看考试答案
        ksdaoption: '', //考试答案排序
        list: [],
        type: '',
        flage: false,
        Chiose: [], //用户选中的项
        etguid: '', //试题guid
      }
    },
    mounted(){
      //history.go(0)
    },
    updated(){
      //let _this = this;
    },
    activated (){
      this.EPGuid = this.$route.query.epguid;
      this.Eptime = this.$route.query.eptime;
      this.type = this.$route.query.type;
      if (this.type == 1) {
        this.dtqk();
        $(".paperslist").hide();
        $(".page").hide();
        $(".jiaojuan span").hide();
        $(".dtreep").show();
        $(".title .kstitme").hide();
        //$(".titels:first-child").show()
      } else {
        $(".paperslist").show();
        $(".page").show();
        $(".jiaojuan span").show();
        $(".dtreep").hide();
        $(".dtqk").hide();
        $(".title .kstitme").show()
        $("#timer").text('');
        this.getkaoshi();
        this.startsingr();
        this.pages(0)
      }
      //this.Countdown();
    },
    deactivated(){

    },
    methods: {
      //进入页面开始计时
      startsingr(){
        var PMGuid = this.userid;
        var EPGuid = this.EPGuid;
        var Eptime = this.Eptime * 60;
        let _this = this;
        $.connection.hub.logging = true;// 启动signalr状态功能
        chat.connection.url = servertime;
        // 开始考试
        chat.connection.start().done(function () {
          chat.server.startExamination(EPGuid, PMGuid, Eptime);
        });
      },
      //继续考试
      jxks(){
        this.popupVisible = false
      },
      next(){
        this.flage = false;
        let object = $(".paperslist .list");
        let _this = this;
        object.each(function (index) {
          object.eq(index).hide();
        });
        object.eq(this.numbers).show();
        let arry = [];
        let m = '';
        this.etguid = object.eq(this.numbers -1).attr("etguid");
        for (var i = 0; i < object.eq(this.numbers -1).find(".activeback").length; i++) {
          arry.push(object.eq(this.numbers -1).find(".activeback").eq(i).attr("No"))
          m = arry.join(",")
        }
        this.Chiose = m;
        if(this.Chiose==''){

        }else{
          this.tjthistimu()
        }
        $(".page ul li").each(function (index) {
          $(".page ul li").eq(index).removeClass("actives");
        });
        $(".page ul li").eq(this.numbers).addClass("actives");
        if (++this.numbers == this.timu.length) {
          $(".Next button").text("交卷");
        } else {
          $(".Next button").text("下一题");
        }
        if(this.numbers >this.timu.length){
          let EPGuid = this.EPGuid;
          let PMGuid = this.userid;
          let chat = $.connection.examinationHub;
          chat.connection.url = servertime
          chat.server.endExamination(EPGuid, PMGuid);
          $(".paperslist li").find(".xuanzhe").removeClass("activeback");
          this.$router.go(-1);

        }else{

        }
      },
      pages(index){
        this.numbers = index;
        this.flage = false;
        let object = $(".paperslist .list");
        let _this = this;
        object.each(function (index) {
          object.eq(index).hide();
        });
        object.eq(this.numbers).show();
        $(".page ul li").each(function (index) {
          $(".page ul li").eq(index).removeClass("actives");
        });
        $(".page ul li").eq(this.numbers).addClass("actives");
        if (++this.numbers == this.timu.length) {
          $(".Next button").text("交卷");
        } else {
          $(".Next button").text("下一题");
        }
        if(this.numbers >this.timu.length){
          let EPGuid = this.EPGuid;
          let PMGuid = this.userid;
          let chat = $.connection.examinationHub;
          chat.connection.url = servertime
          chat.server.endExamination(EPGuid, PMGuid);
          $(".paperslist li").find(".xuanzhe").removeClass("activeback");
          this.$router.go(-1)
        }else{

        }
      },
      //点击下一题提交当前题目
      tjthistimu(){
        Indicator.open();  //加载状态
        let _this = this;
        let object = $(".paperslist .list");
        let Pageli  = $(".page li");
        let nubmers = this.numbers -1;
        let ODGuid = object.eq(nubmers).attr("name");
        let etguid = object.eq(nubmers).attr("etguid");
        console.log(etguid)
        let MD5 = md5(this.userid + this.EPGuid + etguid + ODGuid + this.Chiose + md5Key);
        let getapi = "SaveExamOption|UserID=" + this.userid + "|EPGuid=" + this.EPGuid + "|ETGuid=" + etguid + "|ODGuid=" + ODGuid + "|Chiose=" + this.Chiose + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            let odguid = e.list[0].ODGuid;
            console.log(_this.numbers)
            let abc = object.eq(nubmers).attr("name", odguid);
            //$(".page li").eq(nubmers).attr("name",odguid);
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
      //查看题目
      dtqkclcik(index){
        $(".dtlist li").each(function (index) {
          $(".titelsreep .titels").eq(index).hide();
          $(".dtlist li").eq(index).removeClass("thisclass");
        })
        $(".titelsreep .titels").eq(index).show();
        $(".dtlist li").eq(index).addClass("thisclass");
      },
      xuanze(){
        this.chikeds()
      },
      //选择题目
      chikeds(){
        var el = event.target;
        let _this = this;
        let indexs = $(".paperslist .list").eq(this.numbers - 1).find(".xuanzhe");
        let states = $(".paperslist .list").eq(this.numbers - 1).find("#state").text();
        if (states == "单选") {
          //debugger;
          if ($(el).parents("li").find(".xuanzhe").hasClass("activeback")) {
            _this.flage = true;
          } else {
            _this.flage = false;
          }
          indexs.each(function (index) {
            indexs.eq(index).removeClass("activeback");
          })
          if (_this.flage == false) {
            let thisclick = $(el).parents("li").find(".xuanzhe").addClass("activeback");
            _this.Chiose = $(el).parents("li").find(".xuanzhe").attr("No");
          }
        } else {
          if ($(el).parents("li").find(".xuanzhe").hasClass("activeback")) {
            _this.flage = true;
          } else {
            _this.flage = false;
          }
          $(el).parents("li").find(".xuanzhe").addClass("activeback");
          let abc = []
          if (_this.flage == true) {
            $(el).parents("li").find(".xuanzhe").removeClass("activeback");

          }
        }
      },
      getkaoshi(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.EPGuid + md5Key);
        let getapi = "GetExaminationDetailsList|UserID=" + this.userid + "|EPGuid=" + this.EPGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list[0].Itemlist;
          var option = e.list[0].Itemlist.items;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.timu = list;
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
      //交卷
      Paper(){
        //结束考试
        MessageBox.confirm('确定交卷吗?').then(({value, action}) => {
          //alert(this.Eptime)
          //this.popupVisibleend = true;
          let EPGuid = this.EPGuid;
          let PMGuid = this.userid;
          let chat = $.connection.examinationHub;
          chat.connection.url = servertime
          chat.server.endExamination(EPGuid, PMGuid);
          this.$router.go(-1)
         // this.jiaojuan();
        });
      },
      //交卷
      jiaojuan(){
        let etguid = $(".paperslist .list").find(".xuanzhe");
        var resultArray = [];
        let questionLi = $(".paperslist .list");
        for (var i = 0; i < questionLi.length; i++) {
          var questionItem = {};
          questionItem.etguid = $(questionLi[i]).attr("etguid");
          var answerArray = [];
          var answerList = $(questionLi[i]).find(".activeback");
          for (var j = 0; j < answerList.length; j++) {
            answerArray.push($(answerList[j]).attr("No"));
          }
          resultArray.push({"etguid": $(questionLi[i]).attr("etguid"), "chiose": answerArray.join(',')});
        }
        var AnswerJson = JSON.stringify(resultArray);
        //提交
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.EPGuid + AnswerJson + 5 + md5Key);
        let getapi = "SaveExamination|UserID=" + this.userid + "|EPGuid=" + this.EPGuid + "|AnswerJson=" + AnswerJson + "|EOTime=" + 5 + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            Toast("提交成功");
            //history.back();

            $(".paperslist").hide();
            $(".page").hide();
            $(".jiaojuan span").hide();
            $(".dtreep").show();
            $(".title .kstitme").hide();

          }
          else {
            alert(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //倒计时
      Countdown(){
        let maxtime = this.Eptime * 60//一个小时，按秒计算，自己调整!
        let minutes = '';
        let seconds = '';
        let msg = '';
        let _this = this;

        function dsq() {
          if (maxtime >= 0) {
            minutes = Math.floor(maxtime / 60);
            seconds = Math.floor(maxtime);
            _this.Eptime = seconds;
            msg = "距离结束还有" + minutes + "分" + seconds + "秒";
            //document.all["timer"].innerHTML=msg;
            _this.timer = document.getElementById("timer").innerHTML = msg;
            //timer = $("#timer").text("msg");
            if (maxtime == 10 * 60) {
              _this.popupVisible = true;
            }
            --maxtime;
          }
          else {
            //alert("时间到，结束!");
            clearInterval(_this.timer);
          }
        }

        this.timer = setInterval(dsq, 1000);
      },
      //查看答题情况
      dtqk(){
        this.popupVisibleend = false;
        $(".paperslist").hide();
        $(".page").hide();
        $(".jiaojuan span").hide();
        $(".dtqk").show();
        $(".title .kstitme").hide();
        this.chickdaan();
      },
      //查看考试答案
      chickdaan(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.EPGuid + md5Key);
        let getapi = "GetMyExamination|UserID=" + this.userid + "|EPGuid=" + this.EPGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list[0].Itemlist;
          var option = e.list[0].Itemlist.items;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            let arry = [];
            for (var i = 0; i < list.length; i++) {
              let chkdsk = [] //正确答案
              let flage = 1;
              for (var j = 0; j < list[i].items.length; j++) {
                //我勾选的答案
                if (list[i].checkeditem.indexOf(list[i].items[j].No) > -1) {
                  list[i].items[j].IsChecked = 1;
                } else {
                  list[i].items[j].IsChecked = 0;
                }
                if (list[i].items[j].IsRight == 1) {
                  chkdsk.push(list[i].items[j].No);
                  //正确答案
                  if (list[i].checkeditem.indexOf(list[i].items[j].No) > -1) {
                  } else {
                    flage = 0;
                  }
                } else {
                  //错误答案
                  if (list[i].checkeditem.indexOf(list[i].items[j].No) > -1) {
                    flage = 0;
                  } else {

                  }
                }

              }
              arry.push({"IsTrue": flage});
              list[i].zqda = chkdsk.join(',');
            }
            _this.ksda = list;
            _this.list = arry;
            _this.ksdaoption = option;
            Indicator.close();  //关闭加载状态
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
  $(function(){
    // 页面倒计时
    chat.client.addContosoChatMessageToPage = function (varData, flag) {
      $("#timer").text(varData);
      if (flag == 1) {
        alert("距离考试只有10分钟了，请抓紧时间!")
      }
    };
  })
</script>

<style>
  .papersks {
    display: flex;
    height: 1.0rem;
    line-height: 1.0rem;
    border-bottom: 1px solid #ddd;
    padding: 0px 0.25rem;
  }
   .hasdone{
     background: #f5f5f5;
     color: #fff;
   }
  .papersks div {
    flex: 1;
  }

  .papersks .title {
    flex: 0 0 70%;
    text-align: center;
    font-size: 0.425rem;
  }

  .papersks .title span:first-child {
    padding-right: 0.575rem;
  }

  .papersks .title i {
    font-style: normal;
  }

  .papersks .title .one {
    color: #d73030;
  }

  .papersks .title .two {
    color: #666;
    font-size: 0.325rem;
  }

  .papersks .jiaojuan {
    font-size: 0.35rem;
    color: #ee6e27;
    text-align: right;

  }

  .papersks .icon-fanhui {
    line-height: 1.05rem;
  }

  .paperslist {
    padding: 0px 0.25rem;
    font-size: 0.35rem;
  }

  .paperslist ul li {
    margin-top: 0;
  }

  .paperslist .list > ul > li {
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

  .goin .resindex {
    border: 1px solid #ddd;
    color: #666;
    margin-right: 8%;
  }

  .goin button {
    border: 1px solid #f78905;
    background: #fff;
    font-size: 0.325rem;
    padding: 0.3rem 0.375rem;
    color: #f78905;
    border-radius: 0.075rem;
  }

  .dtqk {
    display: none;
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

  /*答题情况*/
  .dtreep {
    padding: 0.0rem 0.375rem;

  }

  .dtreep .dt {
    text-align: center;
    margin-top: 0.375rem;
    margin-bottom: 0.25rem;
  }

  .dtreep .dt span {
    color: #ee6e27;
  }

  .dtreep > ul {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
  }

  .dtreep > ul > li {
    text-align: center;
    flex: 0 0 10%;
    height: 0.875rem;
    background: #32cf39;
    color: #fff;
    border: 1px solid #fff;
    line-height: 0.875rem;
  }

  .dtreep .titels {
    margin-top: 1.125rem;
    display: none;
  }

  .titels:first-child {
    display: block;
  }

  .dtreep .titels p {
    font-size: 0.375rem;
    color: #333;

  }

  .dtreep .titels .youda {
    color: #d53131;
    padding-top: 0.25rem;
  }

  .dtreep .titels ul li span {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border: 1px solid #ddd;
    margin-right: 0.125rem;
    position: relative;
    top: 0.125rem;
  }

  .dtreep .titels ul li {
    font-size: 0.35rem;
    margin-top: 0.375rem;
    color: #666;
  }

  .error {
    background: url(../../assets/erryo.png) no-repeat;
    background-size: 100%;
  }

  .erryo {
    background: #d53131 !important;
  }

  .thisclass {
    background: #c5c4c3 !important;
  }

  .grren {
    color: #32cf39;
  }
</style>
