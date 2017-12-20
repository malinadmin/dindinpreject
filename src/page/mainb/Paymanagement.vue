<template>
  <div>
    <div class="headers papersks">
      <div>

      </div>
      <div class="title">
        <div class="navsbar">
          <mt-navbar v-model="selected">
            <mt-tab-item id="onetab"><span style="font-size:0.4rem;">未收记录</span></mt-tab-item>
            <mt-tab-item id="twotab"><span style="font-size:0.4rem;">收缴记录</span></mt-tab-item>
          </mt-navbar>
        </div>
      </div>
      <div class="">

      </div>
    </div>
    <div class="jfcontent">
      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="onetab">
          <div class="serach">
            <div><input type="text" placeholder="请输入名字查询" v-model="PMName"></div>
            <div>
              <button @click="seracrh">搜索</button>
            </div>
          </div>
          <div class="jflist">
            <ul>
              <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                           :auto-fill="false"
                           ref="loadmore">
                <li v-for="item in ment">
                  <div>
                    <span>{{item.pmname}}</span>
                    <span>{{item.sbyear}}年{{item.sbmonth}}月</span>
                    <span>{{item.sbdpayablemoney}}元</span>
                  </div>
                  <div>
                    <router-link :to="{path: '/managementdegist/',query:{SBDGuid:item.sbdguid}}">
                      <mt-button type="primary">登记</mt-button>
                    </router-link>
                  </div>
                </li>
                <li v-if="ment.length==''">
                  暂无数据.
                </li>
              </mt-loadmore>
            </ul>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="twotab">
          <div class="serach saixuan">
            <div>
              <input type="text" name="" placeholder="请选择开始时间" v-model="times" @click="timechick">
              <mt-datetime-picker
                ref="picker"
                type="date"
                v-model="pickerValue"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                @confirm="handleConfirm">
              </mt-datetime-picker>
            </div>
            <div>
              <!--<select v-model="types">
                <option value="">选择查询类型</option>
                <option value="" v-for="item in ItemNames" v-bind:value="item.ItemValue">{{item.ItemName}}</option>
              </select>-->
              <input type="text" name="" placeholder="请选择结束时间" v-model="SBDActualTime2" @click="timechick2">
              <mt-datetime-picker
                ref="picker2"
                type="date"
                v-model="pickerValue2"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                @confirm="handleConfirm2">
              </mt-datetime-picker>
            </div>
            <div><input type="text" name="" placeholder="姓名" v-model="names"></div>
          </div>
          <div class="serachbtn">
            <button @click="serachbtn">查询</button>
          </div>
          <div class="jflist">
            <ul>
              <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                           :auto-fill="false"
                           ref="loadmore1">
                <li v-for="item in capture">
                  <div style="flex: 1">
                    <span>{{item.PMName}}</span>
                    <span v-if="item.PMName==null">姓名跑火星去了</span>
                    <span>{{item.SBYear}}年{{item.SBMonth}}月</span>
                    <span>{{item.SBDActualMoney}}元</span>
                    <span>{{item.SBDActualTime.substring(0,10)}}</span>
                  </div>
                  <div>  </div>
                </li>
                <li v-if="capture.length==''">
                    暂无数据
                </li>
              </mt-loadmore>
            </ul>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
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
    data () {
      return {
        selected: 'onetab',
        times: '',
        types: '',
        EnCode: 'DFType', //数据字典标识
        ItemNames: '',
        names: '',
        PMName: '',
        pickerValue:  new Date(),
        pickerValue2:new Date(),
        PageIndex: 1,
        PageSize: 10,
        userid: localStorage.getItem("UserID"),
        ment: [],
        allLoaded: false,
        scrollMode: "auto",//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalCount: '',  //总条数
        capture: [],
        SBDActualTime2:''
      }
    },
    mounted(){

    },
    activated(){

      this.PageIndex = 1;
      this.ment = [];
      this.nonpayment()
    },
    watch: {
      PMName(){
        if (this.PMName.length == 0) {
          this.PageIndex = 1;
          this.ment = [];
          this.nonpayment()
        } else {
          this.PageIndex = 1;
          this.ment = [];
          let ab = this.PMName;
          this.nonpayment(ab);
        }
      },
      selected(val){
        if (val == "onetab") {
          this.PageIndex = 1;
          this.ment = [];
          this.nonpayment()
        } else {
          this.times='';
          this.SBDActualTime2='';
          this.PageIndex = 1;
          this.capture = [];
          this.capturelist();
          this.getselect();
        }
      },
    },
    methods: {
      //收缴选择时间
      timechick(){
        this.$refs.picker.open();
      },
      timechick2(){
        this.$refs.picker2.open();
      },
      //确认后的回调
      handleConfirm(){
        this.times = this.pickerValue.getFullYear() + '-' + ( this.pickerValue.getMonth() + 1) + '-' + this.pickerValue.getDate()
      },
      //确认后的回调
      handleConfirm2(){
        this.SBDActualTime2 = this.pickerValue2.getFullYear() + '-' + ( this.pickerValue2.getMonth() + 1) + '-' + this.pickerValue2.getDate()
      },
      //未缴纳例表
      nonpayment(anglarbaby){
        Indicator.open();  //加载状态
        let _this = this;
        let PMName = anglarbaby ? anglarbaby : '';
        let MD5 = md5(this.userid + PMName + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetStandingBookList|UserID=" + this.userid + "|PMName=" + PMName + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          let list = e.list;
          _this.totalCount = e.totalCount;  //总条数返回
          if (e.result == 1) {
            Indicator.close();  //关闭加载状态
            for (var i = 0; i < list.length; i++) {
              _this.ment.push(list[i])
            }
          }
          else {
            console.log(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          alert(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //已收缴记录
      capturelist(name, SBDActualTime2, time){
        Indicator.open();  //加载状态
        let _this = this;
        let PMName = name ? name : '';
        let SBDTypes = SBDActualTime2 ? SBDActualTime2 : '';
        let SBDActualTime = time ? time : '';
        let MD5 = md5(this.userid + PMName  + SBDActualTime + SBDTypes + "" + this.PageIndex + this.PageSize + md5Key);
        let getapi = "GetStandingBookPayList|UserID=" + this.userid + "|PMName=" + PMName+ "|SBDActualTime1=" + SBDActualTime + "|SBDActualTime2=" + SBDTypes+ "|SBDType=" + ""  + "|PageIndex=" + this.PageIndex + "|PageSize=" + this.PageSize + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          let list = e.list;
          _this.totalCount = e.totalCount;  //总条数返回
          if (e.result == 1) {
            Indicator.close();  //关闭加载状态
            for (var i = 0; i < list.length; i++) {
              _this.capture.push(list[i])
            }
          }
          else {
            console.log(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          alert(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      loadTop(){
        //刷新
        this.scrollMode = "touch";
        this.PageIndex = 1;
        let text = $(".mint-tab-item.is-selected span").text();  //获取当前nav文字用于重置刷新方法
        console.log(text)
        if (text.trim() == "未收记录") {
          this.ment = [];
          this.nonpayment()
          this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        } else if (text.trim() == "收缴记录") {
          this.capture = [];
          this.capturelist()
          this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      loadBottom(){
        this.PageIndex++;
        let text = $(".mint-tab-item.is-selected span").text();  //获取当前nav文字用于重置刷新方法
        if (text.trim() == "未收记录") {
          if (this.totalCount == this.ment.length) {
            Toast("没有更多数据了");
          } else {
            this.nonpayment();
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位

        } else if (text.trim() == "收缴记录") {
          if (this.totalCount == this.capture.length) {
            Toast("没有更多数据了");
          } else {
            this.capturelist()
          }
          this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },
      //搜索
      seracrh(){
        this.ment = [];
        this.PageIndex = 1;
        let ab = this.PMName;
        this.nonpayment(ab);
      },
      //请求数据字典
      getselect(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.EnCode + md5Key);
        let getapi = "GetGetDataItemListJson|UserID=" + this.userid + "|EnCode=" + this.EnCode + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          let list = e.list;
          if (e.result == 1) {
            Indicator.close();  //关闭加载状态
            _this.ItemNames = list;
          }
          else {
            console.log(e.message);
            Indicator.close();
          }
        };
        var error = function (e) {
          alert(e)
          Indicator.close();
        };
        Ajaxmethod(getapi, 'get', '', success, error);
      },
      //已缴纳例表查询
      serachbtn(){
          let time = this.times;
          let SBDActualTime2 = this.SBDActualTime2;
          let name = this.names;
          this.capture = [];
          this.PageIndex= 1;
          this.capturelist(name,SBDActualTime2, time)
      }
    }
  }
</script>

<style scoped>
  .mint-navbar .mint-tab-item {
    padding: 0.2rem 0.0rem;
    padding-top: 0.35rem;
  }

  .mint-popup-left {
    width: 95%;
    left: 0.25rem;
    top: 50%;
    border-radius: 0.125rem;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: none;

  }

  .jfcontent {
    margin-top: 0.375rem;
  }

  .mint-searchbar {
    background: #f5f5f5;
  }

  .mint-searchbar-inner {
    padding: 0;
    height: 0.5rem;
  }

  .serach {
    display: flex;
    justify-content: space-between;
    padding: 0px 0.375rem;
  }

  .serach div:first-child {
    flex: 0 0 85%;

  }

  .serach div:last-child {
    flex: 0 0 15%;

  }

  .serach input, .serach select {
    width: 98%;
    height: 0.875rem;
    border: 1px solid #f5f5f5;
    padding-left: 0.25rem;
    box-sizing: border-box;
    color: #333;
  }

  .serach select {
    padding-left: 0;
    color: #333;
  }

  input:focus {
    border: 1px solid #ddd;

  }

  .serach button {
    width: 100%;
    height: 0.875rem;
    background: #26a2ff;
    border: none;
    color: #fff;
  }

  .jflist {
    margin-top: 0.625rem;

  }

  .serachbtn {
    padding: 0px 0.375rem;
    margin-top: 0.375rem;
    text-align: center;
  }

  .serachbtn button {
    width: 60%;
    height: 0.875rem;
    color: #fff;
    border: 0;
    border-radius: 3px;
    background: #26a2ff;
  }

  .jflist li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f5f5;
    padding: 0.25rem 0.375rem;
    margin-bottom: 0.125rem;
    font-size: 0.35rem;
  }

  .jflist li > div {
    flex: 1;
  }

  .jflist li > div:first-child {
    flex: 0 0 80%;
  }

  .jflist li span {
    margin-right: 0.25rem;
  }

  .jflist li span:last-child {
    margin-right: 0;
  }

  .jflist li > div:last-child {
    text-align: right;
  }

  .saixuan div {
    flex: 0 0 30% !important;
  }

  .mint-button {
    height: 0.625rem;
    font-size: 0.35rem;
  }
</style>
