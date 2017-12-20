/**
 * Created by Administrator on 2017/11/5 0005.
 */
var httpUrl = "http://dj.sbdsoft.com/";
var servertime = "http://192.168.1.113:8056/signalr";  //服务器计时地址
var url = httpUrl + "apiMD5/index?parameters=Function=";
let Ajaxmethod =(params, type, data, success, error, async, complete) =>{
  $.ajax({
    url: url + params,
    type: type,
    data: data ? data : '',
    dataType: "json",
    async: async ? async : 'true',
    timeout: 30000, // 超时时间设置，单位毫秒
    success: function (e) {
      if (success) {
        success(e);
      }
    },
    error: function (e) {
      if (error) {
        error(e);
        alert("网络错误或参数出错!")
      }

    },
    complete: function (e) {

    }
  })
};
export {Ajaxmethod,servertime}
