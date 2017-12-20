<template>
      <div>
        <div class="headers papersks">
          <div>

          </div>
          <div class="title">
              全部评论
          </div>
          <div class="">

          </div>
        </div>
        <div class="allcomment">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                       :auto-fill="false"
                       ref="loadmore">
             <ul>
                <li v-for="item in list">
                    <p class="name">{{item.PMName}}</p>
                    <p class="times">{{item.ECDateTime}}</p>
                    <p class="contentpl">
                      {{item.ECContents}}
                    </p>
                </li>
             </ul>
            <div id="nodata" v-if="list.length==''"> 暂无数据.. </div>
          </mt-loadmore>
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
              allLoaded:false,
              edguid:'',
              PageIndex:1,
              PageSize:10,
              userid: localStorage.getItem("UserID"),
              totalCount: '',  //总条数
              list:[],
            }
        },
        mounted(){

        },
        activated (){
          this.edguid = this.$route.query.guid;
          this.list =[];
          this.getlist();
        },

        methods: {
            getlist(){
              Indicator.open();  //加载状态
              let _this = this;
              let MD5 = md5(this.userid + this.edguid + this.PageIndex + this.PageSize + md5Key);
              let getapi = "GetStudyCommentList|UserID=" + this.userid + "|EDGuid=" + this.edguid + "|PageIndex=" + this.PageIndex+ "|PageSize=" + this.PageSize + "|MD5=" + MD5;
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
            this.list = [];
            this.getlist();
            this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
          },
          loadBottom(){
            this.PageIndex++;
            if (this.totalCount < this.PageIndex) {
              Toast("没有更多数据了");
              this.allLoaded = true;
            } else {
              this.getlist();
              this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            }
          },
        }
    }
</script>

<style>
  .allcomment{
      background: #f4f4f4;
  }
 .allcomment ul li{
     background: #fff;
     padding: 0.375rem;
     margin-bottom: 0.25rem;
     font-size: 0.25rem;
     color: #333;
  }
  .allcomment .name{
    padding-bottom: 0.375rem;
  }
  .allcomment .times{
    color: #999;
    padding-bottom: 0.375rem;
  }
</style>
