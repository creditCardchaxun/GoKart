//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModel:false,
    phone:'',
    photoList:[]
  },

  onLoad: function () {
   var that=this

    // http.getReq('api/my/album', { user_id:app.user_id, status: 1, disable: 1}, 
    //  function (res) {
    //   that.setData({
    //     photoList: res.data.data
    //   })
    // })
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg =='getUserInfo:ok'){
      app.globalData.userInfo = e.detail.userInfo;

      var nickname = app.globalData.userInfo.nickName;
      var avatar = app.globalData.userInfo.avatarUrl;
      http.postReq('api/members/' + app.user_id, {
        nickname: nickname,
        avatar: avatar,
      }, function (res) {
        // wx.showToast({
        //   title: '提交成功',
        // })
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
       })
      this.photosList()
    }else{
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
  
    // if (e.detail.userInfo) {
    //   wx.setStorageSync('nickname', e.detail.userInfo.nickName);
    //   wx.setStorageSync('avatar', e.detail.userInfo.avatarUrl);
    //  }
    
  },
  contactMessage:function(e){
    this.setData({
      showModel: true
    })
  },
  closeDialog:function(e){
    this.setData({
      showModel: false
    })
  },

  freeTell: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
    this.setData({
      showModel: false
    })
  },
 
 photosList:function(){
   var that = this;
   if (that.data.hasUserInfo == true) {
     wx.request({
       url: app.address + 'api/my/album',
       data: { user_id: app.user_id, status: 1,},
       method: 'GET',
       header: { 'content-type': 'application/x-www-form-urlencoded' },
       success: function (res) {
         that.setData({
           photoList: res.data.data,
         })
       }
     })
   }
   
 },
  
  tolikes:function(){
    if (app.globalData.userInfo){ 
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    }else{
      wx.showToast({
        title: '请登录授权查看',
        icon:'none'
      })
    }
  },


  onShow() {
    var that=this;
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.me });
    wx.request({
      url: app.address + 'api/notice/base/51',
      data: {},
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.setData({
          phone: res.data.data.desc,
        })
      }
    })
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.photosList();
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
})
