// pages/activeDetail/activeDetail.js
var http = require('../../utils/http.js')
var WxParse = require('../wxParse/wxParse.js')
var utils = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'/pages/img/iphone.png',
    showModel:false,
    countTime:'',
    dayTime:'',
    hoursTime:'',
    minutesTime:'',
    showTime:false,
    activeDetail:{},
    tuanList:[],
    countdown:'',
    phone:'',
    showCost:false,
    baoming:false,
    checked:false,
    showModelTuan:false,
    userStatus:'',
    jiesuan:false,   //点我任性一把
    showModelCost:false , //结算剩余费用弹框
    is_user:true,
    timer:'',
    day:'',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    totalPerson:[],//判断是否本人参加

    markers: [],
    //当前定位位置
    latitude: '',
    longitude:  '',

    showModelPay:false  //支付弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this
    var orderStatus = options.status
    if(app.globalData.userInfo){

      this.setData({
        is_user:false
      })
    }
    // if (userStatus == 1){
      http.getReq("api/activityDetail/" + options.id+'?member_id='+app.user_id,{}, function (res) {
        var allDetail = res.data;
        var alllist = res.data.items
        var leftTimess = (parseInt(res.data.countdown.start) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
           res.data.countdown.day = leftTimess
        if (res.data.member_arr.indexOf(app.user_id) > -1) {
            if (res.data.complate_status == 0 && res.data.countdown.day > 0) {
              canjoin = true
              var canadd = '退团'
            } else if (res.data.complate_status == 0 && res.data.countdown.day <= 0
            ) {
              canjoin = false
              var canadd = '重新开团'
            } else if (res.data.complate_status == 1 && res.data.countdown.day > 0
            ) {
              // var canadd = '退团'
              var canadd = '已成团'
              that.setData({ checked: true })
            } else if (res.data.complate_status == 1 && res.data.countdown.day <= 0
            ) {
              var canadd = '重新开团'
            } else if (res.data.complate_status == -1) {
              var canadd = '重新开团'
            } else if (res.data.complate_status == 2) {
              var canadd = '重新开团'
            }
        } else{
          if (res.data.complate_status == 0) {
            var canjoin = true
            var canadd = '立即报名'
          } else if (res.data.complate_status == 1) {
            var canadd = '已成团'
            that.setData({ checked: true })
          } else if (res.data.complate_status == -1) {
            var canadd = '重新开团'
          } else if (res.data.complate_status == 2) {
            var canadd = '重新开团'
          }
        }
        var arr = [];
        var ab = {};
        ab.latitude = JSON.parse(res.data.address.y)
        ab.longitude = JSON.parse(res.data.address.x) 
        arr.push(ab)

        that.setData({
          activeDetail: allDetail,
          tuanList: alllist,
          countdown: res.data.countdown.start,
          phone: res.data.tel,
          showCost: canjoin,
          // baoming1: canadd,
          // baoming2: canadd,
          baoming: canadd,
          // userStatus: userStatus,
          markers: arr,
          totalPerson:res.data.member_arr,
          jiesuan:canjoin,
        })
        that.daojishi()
        WxParse.wxParse('article', 'html', res.data.content, that);
      })
    // }
    
    //  else if (userStatus == 2){
    // http.getReq("api/activityDetail/" + options.id+'?user_id='+app.user_id,{}, function (res) {
    //    var allDetail=res.data;
    //    var alllist = res.data.items
    //    var canjoin=""
    //    var leftTimess = (parseInt(res.data.countdown.start) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
    //   res.data.countdown.day = leftTimess
    //   if (res.data.complate_status == 0 && res.data.countdown.day > 0){
    //      canjoin=true
    //     var canadd='退团'
    //   } else if (res.data.complate_status == 0 && res.data.countdown.day <= 0
    //   ) {
    //      canjoin =false
    //     var canadd = '重新开团'
    //   } else if (res.data.complate_status == 1 && res.data.countdown.day>0
    //      ){
    //     var canadd = '退团'
    //     that.setData({ checked: true })
    //   } else if (res.data.complate_status == 1 && res.data.countdown.day <= 0
    //   ) {
    //     var canadd = '重新开团'
    //   } else if (res.data.complate_status == -1) {
    //     var canadd = '重新开团'
    //   } else if (res.data.complate_status == 2) {
    //     var canadd = '重新开团'
    //   } 
    // //  时间
    //   var daojishi=''
    //   if (res.data.countdown.day>0){
    //     daojishi = res.data.countdown.start
    //       that.daojishi()
    //   } else if (res.data.countdown.day < 0){
    //     that.setData({
    //       showTime: true
    //     })
    //     daojishi = ''
    //     clearInterval(that.data.timer);
    //     }
      
    //   var arr = [];
    //   var ab = {};
    //   ab.latitude = JSON.parse(res.data.address.y)
    //   ab.longitude = JSON.parse(res.data.address.x) 
    //   arr.push(ab)

    //   that.setData({
    //     activeDetail: allDetail,
    //     tuanList: alllist,
    //     countdown: daojishi,
    //     phone: res.data.tel,
    //     showCost: canjoin,    
    //     baoming: canadd,
    //     userStatus: userStatus,
    //     jiesuan: canjoin,
    //     day: res.data.countdown.day,
    //     markers: arr
    //   })
    //   WxParse.wxParse('article', 'html', res.data.content, that);
    //  })
    // }
    
  },

  // 时间倒计时
   daojishi:function(){
     var that=this;
     var newarr = [];
     that.data.timer = setInterval(function () {
       var create_time = parseInt(that.data.countdown)
       var leftTime = (parseInt(create_time) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
       if (leftTime > 0) {
         var days = parseInt(leftTime / (1000 * 60 * 60 * 24)) < 10 ? '0' + parseInt(leftTime / (1000 * 60 * 60 * 24)) : parseInt(leftTime / (1000 * 60 * 60 * 24));
         var hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         var minutes = parseInt(leftTime / 1000 / 60 % 60, 10) < 10 ? '0' + parseInt(leftTime / 1000 / 60 % 60, 10) : parseInt(leftTime / 1000 / 60 % 60, 10);
         var seconds = parseInt(leftTime / 1000 % 60, 10);
         // var allTime = days+"天"+hours+"时"+ minutes + "分" + seconds+"秒"
         // console.log(allTime)
         console.log(minutes)
       } else {
         that.setData({
           showTime: true
         })
       }
       // } 
       that.setData({
         // countTime: allTime,
         dayTime: days,
         hoursTime: hours,
         minutesTime: minutes
       })
     }, 1000);
   },



  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    var id = this.data.activeDetail.complate_status; //状态
    var ids = this.data.activeDetail.id;  //id值
    var price = this.data.activeDetail.price;  //价格
    var order = this.data.activeDetail.order.id;  //价格
    // var stss = this.data.userStatus;  //默认进入页面的id
    var leftTimeb = (parseInt(this.data.countdown) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
    if (e.detail.errMsg =='getUserInfo:fail auth deny'){
      this.setData({
        is_user: true
      })
      wx.showToast({
        title: '您需要确认授权才能进入报名',
        icon: 'none',
      })
      return ;
    }else{
    
    // 确认授权成功
      var nickname = app.globalData.userInfo.nickName;
      var avatar = app.globalData.userInfo.avatarUrl;
      http.postReq('api/members/' + app.user_id, {
        nickname: nickname,
        avatar: avatar,
      }, function (res) {
      })

      this.setData({
        is_user: false
      })
      if (id == 0 && leftTimeb > 0) {
      if (this.data.totalPerson.indexOf(app.user_id) > -1 ) {
        this.setData({
          showModelTuan: true
        })
      } else if (this.data.totalPerson.indexOf(app.user_id) == -1) {
         wx.navigateTo({
          url: '/pages/confimInfor/confimInfor?id=' + ids + '&price=' + price,
        })
       }
      } else if (id == 0 && leftTimeb <= 0) {
      // if (id == 0&&that.data.day>0) {
      //   this.setData({
      //     showModelTuan: true
      //   })
      // } else if (id == 0 && that.data.data <0){
          wx.switchTab({
            url: '/pages/announce/announce',
          })
      } else if (id == 1 && leftTimeb > 0){
        this.setData({
          showModelTuan: false,
          checked: true 
        })
      }
      else if (id == 1 && leftTimeb <= 0){
         wx.switchTab({
          url: '/pages/announce/announce',
         })
      }else if ( id == 2) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
      } else if (id == -1){
        // http.postReq('api/wxpay/refund', { order_id: order }, function (res) {
        //      if(res.status==1){
        //        wx.switchTab({
        //          url: '/pages/announce/announce',
        //        })
        //      }
        //  })
        wx.switchTab({
          url: '/pages/announce/announce',
        })
      }
     }
    
  },

  toDetailMain:function(e){
    var id = e.currentTarget.dataset.id; //状态
    var ids = e.currentTarget.dataset.ids;  //id值
    var price = e.currentTarget.dataset.price;  //价格
    // var stss = this.data.userStatus;  //默认进入页面的id
    var title = e.currentTarget.dataset.title; //标题
    var order = e.currentTarget.dataset.order; //订单id
    var leftTimeb = (parseInt(this.data.countdown) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
    if (id == 0 && leftTimeb > 0){
      if (this.data.totalPerson.indexOf(app.user_id) > -1){
          this.setData({
            showModelTuan: true
          })
      } 
      else if (this.data.totalPerson.indexOf(app.user_id) == -1){
         wx.navigateTo({
          url: '/pages/confimInfor/confimInfor?id=' + ids + '&price=' + price,
        })
      }
      
    } else if (id == 0 && leftTimeb<= 0){
      // if (id == 0 && this.data.day > 0) {
      //   this.setData({
      //     showModelTuan: true
      //   })
      // } else if (id == 0 && this.data.day < 0) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
    } else if (id == 1 && leftTimeb > 0) {
        this.setData({
          showModelTuan: false,
          checked: true 
        })
      }
    else if (id == 1 && leftTimeb <= 0) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
      } else if (id == 2) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
    } else if (id == -1) {
      // http.postReq('api/wxpay/refund', { order_id: order }, function (res) {
      //   if (res.status == 1) {
      //     wx.showToast({
      //       title: '退款已成功',
      //     })
      //     wx.switchTab({
      //       url: '/pages/announce/announce',
      //     })
      //   }
      // })
      wx.switchTab({
        url: '/pages/announce/announce',
      })
    }
    // }
 
  },

  onUnload: function () {
    clearInterval(this.data.timer);
  },

  number:function(){
   this.setData({
     showModel: true
   })
  },
  closeDialog: function (e) {
    this.setData({
      showModel: false,
      showModelTuan: false,
      showModelCost: false,
      showModelPay: false
    })
  },
//  结算剩余费用
  toCostPay:function(e){
    var that=this;
    that.setData({
      showModelCost:true
    })
  },
  // 去结算
  toPay:function(e){
    var that = this;
    that.setData({
      showModelCost: false,
      showModelPay: false
    })
    var id = e.currentTarget.dataset.id
    var openid = wx.getStorageSync('openid');
    http.postReq('api/wxpay/paytherest', { exercise_id: id, members_id:app.user_id, openid: openid }, function (res) {
      var payData = res;
      utils.pay(payData, function (e) {
        if (e.errMsg == 'requestPayment:ok') {
          wx.navigateTo({
            url: "/pages/success/success?status=1&title=活动已成团",
          })
    
        } else {
          that.setData({
            showModelPay:true
           })

        }
      })

    })
  },

  // 退团
  showReturn:function(e){
    var that=this;
    var id=e.currentTarget.dataset.id
    http.postReq('api/wxpay/refund', { order_id: id }, function (res) {
       wx.showToast({
         title: '退款成功',
       })
        that.setData({
          showModelTuan: false
        })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      // prevPage.setData({
      //   timeValue: allDate,
      //   accounts: allmin,
      //   accountChuo: allmin2
      // })
      that.onLoad()
      wx.navigateBack({
        delta: 1,
      })
    })

  },
  callNumber:function(){
  var that=this;
  wx.makePhoneCall({
    phoneNumber: that.data.phone,
  })
    that.setData({
      showModel: false
    })
  },
  toMap:function(){
    var that=this;
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
           console.log(res)
          var latitude = res.latitude
          var longitude = res.longitude
          wx.openLocation({
            latitude: that.data.markers[0].latitude,
            longitude: that.data.markers[0].longitude,
            name:'Red1karting',
            scale: 18
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.activeDetail });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function () {

  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: res.target.dataset.name,
      path: '/pages/activeDetail/activeDetail?id=' + res.target.dataset.id + '&userStatus=' + this.data.userStatus,
     success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  }
})