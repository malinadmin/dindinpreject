<template>
  <div>
    <!--生日快乐弹出界面-->
    <mt-popup
      v-model="popupVisible"
      position="right"
      popup-transition="popup-fade">
      <div class="berastay">
        <img src="../../assets/berstay.png">
        <div class="berastaytop">
                <span>
                    <i class="icon-music" @click="autio()"></i>
                  <!-- <i class="icon-jinyin"></i>-->
                </span>
          <span class="claose">
                  <button @click="colse()">关闭</button>
                </span>
          <audio controls="controls" style="display: none" id="autio">
            <source id="music" src="../../mp3/happyberstay.mp3" type="audio/mpeg"/>
          </audio>
        </div>
      </div>
    </mt-popup>
    <!--入党生日-->
    <mt-popup
      v-model="popupVisibledang"
      position="right"
      popup-transition="popup-fade">
      <div class="berastay">
        <p class="bytext">
          {{Yeaers}}年前的今天，您光荣加入中国共产党，在此代表党组织，祝您工作顺利、身体健康、家庭幸福!
          <br>
          &nbsp &nbsp &nbsp 希望您不忘初心，牢记使命！
        </p>
        <img src="../../assets/zzsr.png">
        <div class="berastaytop">
                <span>
                    <i class="icon-music" @click="autiord()"></i>
                  <!-- <i class="icon-jinyin"></i>-->
                </span>
          <span class="claose">
                  <button @click="colserd()">关闭</button>
                </span>
          <audio controls="controls" style="display: none" id="autiord">
            <source id="music" src="../../mp3/gcdsr.mp3" type="audio/mpeg"/>
          </audio>
        </div>
      </div>
    </mt-popup>
    <div class="header">
      <div class="lefticon"></div>
      <div class="navtab" id="navtabs">
        <mt-navbar v-model="active">
          <mt-tab-item id="xuexi"><img src="../../assets/dh.png"><i><em>学习</em></i></mt-tab-item>
          <mt-tab-item id="kaoshi"><i> <em>考试</em> <span class="ksdalong"></span></i></mt-tab-item>
          <mt-tab-item id="tongzhi"><i> <em>通知</em> <span class="infodalong"></span></i></mt-tab-item>
        </mt-navbar>
      </div>
      <div class="righticon"></div>
    </div>
    <div class="contents">

      <mt-tab-container v-model="active">
        <!--学习-->
        <mt-tab-container-item id="xuexi">
          <div class="banner">
            <mt-swipe :auto="4000" :show-indicators="false">
              <mt-swipe-item v-for="(item,index) in lunbo" :key="item">
                <router-link :to="{path: '/xuexidegist/',query:{edguid:item.id}}">
                  <img src="../../assets/banner.png" v-if="item.imgurl==''">
                  <img :src="item.imgurl">
                  <div class="bannertext">
                    <p>{{item.title}}</p>
                    <p><span class="active">{{index + 1}}</span>/<span class="zts">{{lunbo.length}}</span></p>
                  </div>
                </router-link>
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <div class="list">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                         :auto-fill="false"
                         ref="loadmore">
              <ul>
                <li v-for="(item,index) in xuexi">
                  <router-link :to="{path: '/xuexidegist/',query:{edguid:item.edguid}}">
                    <div class="meadetext">
                      <p>
                        {{item.edname}}
                      </p>
                      <div class="imsg" v-if="index==3">
                        <img src="../../assets/noimg.jpg" alt="" v-if="item.imgurl.length==''">
                        <img :src="Address + item.imgurl" v-if="item.imgurl.length!=''">
                      </div>
                      <div class="bottomtext">
                        <p>
                          <span>{{item.commentcounts}}评</span>
                          <span>{{item.createdate}}</span>
                        </p>
                        <p class="state">
                          <span class="yx" v-if="item.studycount=='1'">已学</span>
                          <span class="noyx" v-if="item.studycount=='0'">未学</span>
                        </p>
                      </div>
                    </div>
                    <div class="meadeimg">
                      <img src="../../assets/noimg.jpg" alt="" v-if="item.imgurl.length==''">
                      <img :src="Address + item.imgurl" v-if="item.imgurl.length!=''">
                    </div>
                  </router-link>
                </li>
              </ul>
              <div id="nodata" v-if="xuexi.length==''"> 暂无数据.. </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="kaoshi">
          <!--考试-->
          <div class="kaosilist">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                         :auto-fill="false"
                         ref="loadmore1">
              <ul>
                <li v-for="item in exam">
                  <div class="leftlist">
                    <p class="title">{{item.epname}}</p>
                  <!--  <p class="time">{{item.epsdate}}</p>-->
                    <p class="time">
                      <span><span>{{item.epsdate}}</span> ~ <span>{{item.epedate}}</span></span>
                      <p style="margin-top: 5px">共{{item.eptime}}分钟</p>
                    </p>
                  </div>
                  <div class="rightlist">
                  <!--  <router-link :to="{path: '/papers/',query:{epguid:item.epguid,eptime:item.eptime,type:0}}" >-->
                      <button class="ks" v-if="item.eoscore=='-1'" @click="cjks(item)">参加考试</button>
                  <!--  </router-link>-->
                    <router-link :to="{path: '/papers/',query:{epguid:item.epguid,eptime:item.eptime,type:1}}">
                      <button class="jg" v-if="item.eoscore!='-1'">查看结果</button>
                    </router-link>
                  </div>
                </li>
              </ul>
              <div id="nodata" v-if="exam.length==''"> 暂无数据.. </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="tongzhi">
          <!--通知-->
          <div class="togzhilist">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                         :auto-fill="false"
                         ref="loadmore2">
              <ul>
                <li v-for="item in list" v-if="list.length!=''">
                  <router-link :to="{path: '/newsdegist/',query:{guid:item.nguid}}">
                    <p :class="{ bckfff:item.isread!=0 }"><span style="color:red;position: relative;top: -5px" v-if="item.isread==0">.</span> {{item.ntitle}}</p>
                    <div class="bottomtext">
                      <span>{{item.departmentname}}</span>
                      <span>{{item.ndate}}</span>
                    </div>
                  </router-link>
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
    name: 'hello',
    components: {
      footers
    },
    data () {
      return {
        value: '',
        active: 'xuexi',
        PageIndex: 1,
        PageSize: 10,
        list: [],  //通知列表数据
        exam: [], //考试列表数据
        xuexi: [], //学习列表数据
        lunbo: [], //轮播数据
        allLoaded: false,
        scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalCount: '',  //总条数
        popupVisible: false,
        popupVisibledang: false,
        dduserid: localStorage.getItem("dduserid"),
        music: true,
        gerenbirthday: localStorage.getItem("BirthDate"), //个人生日
        dangebirthday: localStorage.getItem("CheckInDate"), //入党日期
        thisbirthday: '', //当前时间
        userid: localStorage.getItem("UserID"),
        Address: '', // 服务器地址
        Yeaers: '', //入党年份
        kaoshiloding: '', // 考试状态
        agentId: '',
        Url: '',
        corpid: '',
        AStause: false,  //状态
      }
    },
    props: ['logo'],
    watch: {
      active(val){
        if (val == "xuexi") {
          this.PageIndex = 1;
          this.xuexi = [];
          this.getlistxuexi();
          this.lunbo = [];
          this.getlistlnubo();
        } else if (val == "kaoshi") {
          this.PageIndex = 1;
          this.exam = [];
          this.getlistexam();
        } else if (val == "tongzhi") {
          this.PageIndex = 1;
          this.list = [];
          this.getlistinfo();
        }
      },
    },
    activated(){
      if (!this.userid) {
        this.$router.push({path: '/regedist/'});
      } else {
        this.PageIndex = 1;
        this.xuexi = [];
        this.lunbo = [];
        this.exam = [];
        this.list = [];
        this.getlistxuexi();
        this.getlistlnubo();
        this.getlistexam();
        this.getlistinfo();
      }
    },
    created(){
      this.agentId = this.$route.query.AgentID;
      if(!this.$route.query.kaoshi){
        this.active= 'xuexi'
      }else{
        this.active= 'kaoshi'
      }
    },
    mounted(){
      //localStorage.setItem("dduserid", "06216307091252011");
     //localStorage.setItem("UserID", "4a633d71-1785-4dba-9737-c5af9c8a04eb")
      this.getdd();
      this.birthday();
      //对比个人生日
      if (this.gerenbirthday == this.thisbirthday) {
        localStorage.setItem("music", '');
        var top = $(".header").height();
        $(".mint-popup-right").css('margin-top', top)
        this.popupVisible = true;
        let myVid = $("#autio");
        myVid[0].play(); //播放
      } else {
        let myVid = $("#autio");
        myVid[0].pause(); //暂停音乐
      }
      if (localStorage.getItem("music") == "close") {
        let myVid = $("#autio");
        myVid[0].pause(); //暂停音乐
        this.popupVisible = false;
      }
      //对比入党日期
      if (this.dangebirthday == this.thisbirthday) {
        let rdrq = parseInt(localStorage.getItem("CheckInDaterd"));  //获取入党年份
        let myDate = new Date();
        let yeaer = parseInt(myDate.getFullYear()); // 获取当前年
        this.Yeaers = yeaer - rdrq;
        localStorage.setItem("musicrd", '')
        var top = $(".header").height();
        $(".mint-popup-right").css('margin-top', top);
        this.popupVisibledang = true;
        let myVid = $("#autiord");
        myVid[0].play(); //播放
        if (localStorage.getItem("musicrd") == "close") {
          let myVid = $("#autiord");
          myVid[0].pause(); //暂停音乐
          this.popupVisibledang = false;
        }
      }
    },
    methods: {
      //通知列表
      getlistinfo(){
        Indicator.open();  //加载状态
        let _this = this;
        var flage = 0;
        let MD5 = md5(this.userid + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetNewsList|UserID=" + this.userid + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
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
              if (list[i].isread == 0) {
                flage = 1
              }
            }
            if (flage == 0 || list == '') {
              $(".infodalong").hide()
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
      //请求考试列表信息
      getlistexam(){
        Indicator.open();  //加载状态
        let _this = this;
        var flage = 0;
        let MD5 = md5(this.userid + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetExaminationList|UserID=" + this.userid + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.totalCount = totalCounts;
            for (var i = 0; i < list.length; i++) {
              _this.exam.push(list[i]);
              if (list[i].eoscore == -1) {
                flage = 1;
              }
            }
            if (flage == 0 || list == '') {
              $(".ksdalong").hide();
            }
          }
          else {
            Toast(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          console.log(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //请求学习列表
      getlistxuexi(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetStudyList|UserID=" + this.userid + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.totalCount = totalCounts;
            _this.Address = e.address;
            for (var i = 0; i < list.length; i++) {
              _this.xuexi.push(list[i]);
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
      //请求轮播图数据
      getlistlnubo(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + 5 + md5Key);
        let getapi = "GetStudyImgList|UserID=" + this.userid + "|Top=" + 5 + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          var list = e.list;
          var totalCounts = e.totalCount;  //总条数返回
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.totalCount = totalCounts;
            for (var i = 0; i < list.length; i++) {
              _this.lunbo.push(list[i]);
            }
            if (totalCounts < _this.PageSize) {
              _this.allLoaded = true;
            }
          } else if (e.list == '') {
            Toast("没有更多数据了");
            _this.allLoaded = true;
            Indicator.close();
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
        this.scrollMode = "touch";
        this.PageIndex = 1;
        this.allLoaded = false;
        let text = $(" #navtabs .mint-navbar .mint-tab-item.is-selected em").text();  //获取当前nav文字用于重置刷新方法
        console.log(text)
        if (text.trim() == "学习") {
          this.xuexi = [];
          this.getlistxuexi();
          this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "考试") {
          this.exam = [];
          this.getlistexam();
          this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "通知") {
          this.list = [];
          this.getlistinfo();
          this.$refs.loadmore2.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      loadBottom(){
        this.PageIndex++;
        let text = $(" #navtabs .mint-navbar .mint-tab-item.is-selected em").text();  //获取当前nav文字用于重置刷新方法
        console.log(text)
        if (text.trim() == "学习") {

          if (this.totalCount == this.xuexi.length) {
            Toast("没有更多数据了");
          } else {
            this.getlistxuexi();
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "考试") {

          if (this.totalCount == this.exam.length) {
            Toast("没有更多数据了");
          } else {
            this.getlistexam();
          }
          this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "通知") {
          if (this.totalCount == this.list.length) {
            Toast("没有更多数据了");
          } else {
            this.getlistinfo();
          }
          this.$refs.loadmore2.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      colse(){
        localStorage.setItem("music", "close");
        this.popupVisible = false;
        var myVid = $("#autio");
        myVid[0].pause(); //暂停音乐
        console.log(localStorage.getItem("music"));
      },
      colserd(){
        localStorage.setItem("musicrd", "close");
        this.popupVisibledang = false;
        var myVid = $("#autiord");
        myVid[0].pause(); //暂停音乐
      },
      //静音音乐
      autio(){
        if (this.music) {
          $(".berastaytop i").removeClass("icon-music");
          $(".berastaytop i").addClass("icon-jinyin");
          var myVid = $("#autio");
          myVid[0].muted = true;
          this.music = false;
        } else {
          $(".berastaytop i").removeClass("icon-jinyin");
          $(".berastaytop i").addClass("icon-music");
          var myVid = $("#autio");
          myVid[0].muted = false;
          this.music = true;
        }
      },
      //静音党员musice
      autiord(){
        if (this.music) {
          $(".berastaytop i").removeClass("icon-music");
          $(".berastaytop i").addClass("icon-jinyin");
          var myVid = $("#autiord");
          myVid[0].muted = true;
          this.music = false;
        } else {
          $(".berastaytop i").removeClass("icon-jinyin");
          $(".berastaytop i").addClass("icon-music");
          var myVid = $("#autiord");
          myVid[0].muted = false;
          this.music = true;
        }
      },
      //获取当前时间对比服务端返回时间决定是否显示生日界面
      birthday(){
        let myDate = new Date();
        let yeaer = myDate.getFullYear(); // 获取年
        let month = myDate.getMonth() + 1;  //获取月
        let datas = myDate.getDate(); //获取日
        this.thisbirthday = month + '-' + datas;
      },
      messgesbox(){
        MessageBox({
          title: '提示',
          message: '当前帐号未绑定钉钉是否前往绑定?',
          showCancelButton: true,
          closeOnClickModal: false,
        });
      },
      //获取钉钉userid
      getdd(){
        this.Url = window.location.href;  // window.location.href //http://192.168.1.130:8080/x5/home
        let MD5 = md5(this.agentId + this.Url + md5Key);
        let getapi = "GetDingDingJsskdinfo|AgentId=" + this.agentId + "|Url=" + this.Url + "|MD5=" + MD5;
        //alert(getapi)
        var _this = this;
        var success = function (e) {
          //alert(JSON.stringify(e));
          if (e.result == 1) {
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
            dd.error(function (error) {
              /**
               {
                  message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
                  errorCode:"错误码"
               }
               **/
              alert('dd error: ' + JSON.stringify(error));
            });
            dd.ready(function () {
              //alert("进入拉取用户一步")
              dd.runtime.permission.requestAuthCode({
                corpId: js.corpid,
                onSuccess: function (result) {
                  // alert(JSON.stringify(result));
                  let Code = result.code;
                  let MD5 = md5(Code + md5Key);
                  let getapi = "GetDingDingUserInfoByCode|Code=" + Code + "|MD5=" + MD5;
                  var success = function (e) {
                    //alert(JSON.stringify(e));
                    if (e.result == 1) {
                      //如果成功拉取用户
                      //alert(e.list[0].UserID);
                      localStorage.setItem("dduserid", e.list[0].UserID);
                      //获取用户基本信息
                      Indicator.open();  //加载状态
                      let MD5 = md5(e.list[0].UserID + md5Key);
                      let that = this;
                      let getapi = "GetUserInfoByCode|DingdingUserId=" + e.list[0].UserID + "|MD5=" + MD5;
                      // 创建请求
                      var success = function (e) {
                        //alert(JSON.stringify(e))
                        Indicator.close();
                        if (e.result == 1) {
                          //请求成功
                          //alert("成功")
                          localStorage.setItem("UserID", e.list[0].UserID)  //缓存用户信息
                          //alert(e.list[0].UserID);
                          localStorage.setItem("UserName", e.list[0].UserName)  //缓存用户姓名
                          localStorage.setItem("DepartmentPost", e.list[0].DepartmentPost) //缓存职务信息
                          localStorage.setItem("Photo", e.list[0].Photo) //缓存用户头像
                          localStorage.setItem("BirthDate", e.list[0].BirthDate.substring(5)); //缓存个人生日
                          localStorage.setItem("CheckInDate", e.list[0].CheckInDate.substring(5)); //缓存入党生日
                          localStorage.setItem("CheckInDaterd", e.list[0].CheckInDate.substring(0, 4)); //缓存入党生日
                          _this.AStause = true;
                        } else if (e.result == 4) {
                          Toast('未绑定钉钉');
                          //前往绑定页面
                          localStorage.setItem("UserID", '')  //缓存用户信息
                          _this.$router.push({path: '/regedist/'});
                        }
                        else {
                          //打印错误信息
                          alert(e.message)
                        }
                      };
                      var error = function (e) {
                        alert(JSON.stringify(e))
                        Indicator.close();
                      };
                      Ajaxmethod(getapi, 'get', '', success, error);
                    } else {
                      alert(JSON.stringify(e))
                    }
                  };
                  var error = function (e) {
                    alert(JSON.stringify(e));
                  };
                  Ajaxmethod(getapi, 'get', false, success, error);
                },
                onFail: function (err) {
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
      //参加考试
      cjks(item){
        Indicator.open();  //加载状态
        let _this = this;
        let EPGuid = item.epguid;
        let MD5 = md5(this.userid + EPGuid + md5Key);
        let getapi = "ProgressExam|UserID=" + this.userid + "|EPGuid=" + EPGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          var succice = e.result;
          if (succice == 1) {
            Indicator.close();  //关闭加载状态
            _this.$router.push({path: '/papers/',query:{epguid:item.epguid,eptime:item.eptime,type:0}})
          } else if(succice == 4){
              alert(e.message)
            Indicator.close();
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
      }
    },
  }
</script>

<style scoped>
  .header {
    display: flex;
    padding: 0px 0.25rem;
    border-bottom: 1px solid #eee;
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
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 100%;
    background: #d61515;
    position: absolute;
    right: -0.15rem;
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
    border-bottom: 0;
  }

  .mint-navbar .mint-tab-item.is-selected i {
    color: #333;
    border-bottom: 0;
  }

  .mint-navbar .mint-tab-item.is-selected:after {
    content: ''; /*CSS伪类用法*/
    position: absolute; /*定位背景横线的位置*/
    bottom: 0.1rem;
    left: 0.675rem;
    background: #d61515; /*宽和高做出来的背景横线*/
    width: 0.5rem;
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
    flex: 0 0 75%
  }

  .list .meadeimg {
    flex: 0 0 25%;
    background: #e5e5e5;
  }

  .list .meadetext > p {
    font-size: 0.4rem;
    color: #333;
    padding-right: 10px;
    font-weight: bold;
    height: 1.075rem;
    overflow: hidden;
  }

  .list .bottomtext {
    display: flex;
    justify-content: space-between;
    margin-top: 0.125rem;
  }

  .list .bottomtext p {
    font-size: 0.35rem;
    font-weight: normal;
  }

  .list .bottomtext p span {
    color: #999;
  }

  .list .bottomtext p span:first-child {
    padding-right: 0.25rem;
  }

  .list .bottomtext .state .yx {
    color: #2ae217
  }

  .list .bottomtext .state .noyx {
    color: #eaa12f;
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
    font-size: 0.4rem;
    display: flex;
    justify-content: space-between;
    padding: 0px 0.25rem;
    color: #fff;
    box-sizing: border-box;
  }

  .banner .bannertext .active {
    color: #d61515;
    font-size: 0.45rem;
  }

  .kaosilist {
    margin-top: 0.25rem;
    padding-bottom: 1.25rem;
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

  .togzhilist ul li {
    border-bottom: 1px solid #ddd;
    padding: 0.25rem 0.375rem;;
  }

  .togzhilist ul li p {
    font-size: 0.375rem;
    color: #333;
    font-weight: 600;
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

  /*.berastay img {
    margin-top: 1.0rem;
  }*/

  .berastay .berastaytop {
    width: 92%;
    display: flex;
    justify-content: space-between;
    padding: 0px 0.375rem;
    position: absolute;
    top: 0.5rem;
  }

  .berastay .berastaytop span {
    flex: 1;
  }

  .berastay .berastaytop i {
    font-size: 0.625rem;
    color: #fff;
    display: inline-block;
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 1s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 1s;
    -webkit-animation: rotate 3s linear infinite;
    -moz-animation: rotate 3s linear infinite;
    -o-animation: rotate 3s linear infinite;
    animation: rotate 3s linear infinite;
  }

  .berastay .berastaytop .claose {
    text-align: right;
  }

  .berastay .berastaytop .claose button {
    display: inline-block;
    border: 1px solid #fff;
    padding: 0.05rem 0.125rem;
    font-size: 0.325rem;
    color: #fff;
    background: none;
  }

  .mint-swipe-items-wrap > div.is-active {
    position: relative;
  }

  @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

  @-moz-keyframes rotate {
    from {
      -moz-transform: rotate(0deg)
    }
    to {
      -moz-transform: rotate(359deg)
    }
  }

  @-o-keyframes rotate {
    from {
      -o-transform: rotate(0deg)
    }
    to {
      -o-transform: rotate(359deg)
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(359deg)
    }
  }

  .bytext {
    color: #f3d274;
    position: absolute;
    padding: 0.0rem 1.25rem;
    font-size: 0.4rem;
    text-indent: 2em;
    line-height: 1.8em;
    margin-top: 80%;
  }

  .bckfff {
    color: #777 !important;
  }
</style>
