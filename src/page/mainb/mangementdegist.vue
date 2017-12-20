<template>
  <div>
    <div class="froms">
      <ul>
        <li>
          <span>{{degist.PMName}}</span>
          <span>{{degist.SBDDate}}</span>
          <span>{{degist.SBDPayableMoney}}元</span>
        </li>
        <li>
          缴纳时间:
          <input type="text" name="" placeholder="请选择时间" @click="jltimes" v-model="SBDActualTime">
          <mt-datetime-picker
            ref="picker"
            type="date"
            v-model="pickerValue"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleConfirm">
          </mt-datetime-picker>
        </li>
        <li>
          缴纳方式:
          <select v-model="SBDType">
            <option disabled value="">请选择</option>
            <option v-for="item in ItemNames" v-bind:value="item.ItemValue">{{item.ItemName}}</option>
          </select>
        </li>
        <li style="text-align:center">
          <mt-button type="primary" class="qudding" @click="btnok">确定</mt-button>
        </li>
      </ul>
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
        pickerValue:new Date(),
        SBDActualTime: '',
        SBDGuid: '', // 台帐GUID
        userid: localStorage.getItem("UserID"),
        degist: '',
        ItemNames: '',
        SBDType:'',
        EnCode: 'DFType', //字典标识
        SBDActualMoney:'', //缴纳金额
      }
    },
    mounted(){

    },
    activated(){
      this.SBDGuid = this.$route.query.SBDGuid;
      this.getlist();
      this.getselect();
      this.SBDActualTime = '';
    },
    methods: {
      jltimes(){
        this.$refs.picker.open();
      },
      //确认后的回调
      handleConfirm(){
        this.SBDActualTime = this.pickerValue.getFullYear() + '-' + ( this.pickerValue.getMonth() + 1) + '-' + this.pickerValue.getDate()
      },
      getlist(){
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.SBDGuid + md5Key);
        let getapi = "GetStandingBookDetails|UserID=" + this.userid + "|SBDGuid=" + this.SBDGuid + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          let list = e.list;
          if (e.result == 1) {
            Indicator.close();  //关闭加载状态
            _this.degist = list[0];
            _this.SBDActualMoney = list[0].SBDPayableMoney;
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
      //获取数据字典
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
      //提交
      btnok(){
          if(this.SBDActualTime==''){
            alert("日期不能为空");
            return
          }else if(this.SBDType==''){
            alert("缴纳方式不能为空");
            return
          }
        Indicator.open();  //加载状态
        let _this = this;
        let MD5 = md5(this.userid + this.SBDGuid + this.SBDType + this.SBDActualMoney + this.SBDActualTime + md5Key);
        let getapi = "SaveStandingBook|UserID=" + this.userid + "|SBDGuid=" + this.SBDGuid+ "|SBDType=" + this.SBDType+ "|SBDActualMoney=" + this.SBDActualMoney+ "|SBDActualTime=" + this.SBDActualTime + "|MD5=" + MD5;
        // 创建请求
        var success = function (e) {
          let list = e.list;
          if (e.result == 1) {
            Indicator.close();  //关闭加载状态
            Toast("登记成功");
            history.back(-1);
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
    }
  }
</script>

<style scoped>
  .froms {
    padding: 0.375rem;
    font-size: 0.4rem;
  }

  .froms ul li {
    margin-bottom: 0.375rem;
  }

  .froms ul li span {
    margin-right: 0.25rem;
  }

  .froms ul li input {
    margin-left: 0.25rem;
    border: 1px solid #ddd;
    padding-left: 0.25rem;
    height: 0.875rem;
  }

  .froms ul li select {
    margin-left: 0.25rem;
  }

  .qudding {
    width: 60%;
    margin-top: 0.875rem;
    height: 0.875rem;
  }
</style>
