//app.js
var http = require('utils/http.js')
App({
  address :'https://kart.yaocongkeji.com/',
  data:{
    user_id:'',
    openid:'',
    // 页面标题
    common_pages_title: {
      "find_list": "发现",
      "goods_search": "搜索",
      "find_detail": "详情",   
      "baoming-success": "报名",
      "confimInfor": '确认信息',
      "activeDetail": "活动详情",
      "chooseActity": "选择活动",
      "chooseActivexq": "活动详情",
      "announce": '活动发布',
      "order": '订单',
      "me": '我的',
      "personSave": '个人资料',
      "collect": "收藏",
      "message": "系统消息",
      "photosList": "相册",
      "safe":'安全协议',
      "activity": '活动协议',
      "date":"活动日期",
      "messageDetail": "系统消息详情"
    },
  },
  onLaunch: function () {
    var that=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
         var code=res.code;
         wx.request({
           url:that.address + 'api/onLogin',
           data: {code: code},
           success:function(res){
             console.log(res.data.user_id)
             that.user_id = res.data.user_id
             wx.setStorageSync('user_id', that.user_id);
             that.openid = res.data.info.openid;
             wx.setStorageSync('openid', that.openid);
             var access_token = res.data.info.session_key
             wx.request({
               url: that.address + 'api/getUserId',
               data: { openid: that.openid,access_token:access_token},
               method: 'POST',
               success: function (res) {
                  console.log('发送成功')
               }
             })
           }
         })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
                
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  //多张图片上传
  uploadimg: function (data,completes) {
    var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0,//上传失败的个数
    upsuccess = data.upsuccess ? data.upsuccess : 0,
    upfail = data.upfail ? data.upfail : 0,
    newpic = '';
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        if (JSON.parse(resp.data).status == 1){
          newpic = JSON.parse(resp.data).pic;
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        // console.log('fail:' + i + "fail:" + fail);
        wx.showToast({
          title: '图片上传失败',
        })
      },
      complete: () => {
           i++;//这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) {   //当图片传完时，停止调用          
          if (newpic !=""){
            http.postReq('api/members_photo', { pid: parseInt(that.user_id), pic: newpic, status: 1, disable: 0 }, function (res) {
            data.upsuccess++;
            data.upfail++;
            });
            return completes(data);
           }         
        } else {//若图片还没有传完，则继续调用函数                
          data.i = i;
          data.success = success;
          data.fail = fail;
          if (newpic != "") {
            http.postReq('api/members_photo', { pid: parseInt(that.user_id), pic: newpic, status: 1, disable: 0 }, function (res) {
              data.upsuccess++;
              data.upfail++;
            });
          }
          return that.uploadimg(data,completes);
        }
      }
    })
  }

})

