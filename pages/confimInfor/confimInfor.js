// pages/confimInfor/confimInfor.js
var app=getApp()
var http = require('../../utils/http.js')
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择性别',"男", "女"],
    sexIndex: 0,
    blood: ['请选择血型', 'A型', 'B型', 'AB型', 'O型','其他'],
    bloodIndex:0,
    date:'',
    driver: ['请选择','是','否'],
    driverIndex:0,
    isAgree: false,
    allInfor:{},
    checked:true,
    id:'',
    price:'',
    showBlood:false,
    showModelCost:false

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var bloods = ''
    var datess=''
    http.getReq('api/members/' + app.user_id,{}, function (res) {
      if (res.blood == "A型") {
        bloods = 1
      } else if (res.blood == "B型") {
        bloods = 2
      } else if (res.blood == "AB型") {
        bloods = 3
      } else if (res.blood == "O型") {
        bloods = 4
      } else if (res.blood == "其他") {
        bloods = 5
        that.setData({
          showBlood: true
        })
      }
      if (res.date_of_birth == 'Null' || res.date_of_birth == 'undefined' || res.date_of_birth == '') {
        datess = ''
      } else {
        datess = res.date_of_birth
      } 

      var telss = ''
      if (res.tel == 'Null' || res.tel == 'undefined' || res.tel == '') {
        telss = ''
      } else { telss = res.tel }

      var heights = ''
      if (res.height == 'Null' || res.height == 'undefined' || res.height == '') {
        heights = ''
      } else { heights = res.height }
      
      that.setData({
        allInfor: res,
        sexIndex: res.sex,
        date: datess,
        driverIndex: res.is_first,
        bloodIndex: bloods,
        tels: telss,
        heights: heights,
        id: options.id,
        price: options.price
      })
    })

  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindSexChange:function(e){
    this.setData({
      sexIndex: e.detail.value
    })
  },
  bindBloodChange:function(e){
    var bloodst=''
    if (e.detail.value==5){
      bloodst ==true
    }else{
      bloodst == false
    }
    this.setData({
      bloodIndex: e.detail.value,
      showBlood:bloodst
    })
  },
  driverChange:function(e){
    this.setData({
      driverIndex:e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    console.log(e)
    if (e.detail.value.length > 0) {
      this.setData({
        checked: false
      });
    } else {
      this.setData({
        checked: true
      });
    }
    this.setData({
      isAgree: !!e.detail.value.length,
    });
  },

  formSubmit: function (e) {
    console.log('表单',e)
    var that = this;
    // 血型
    var bloodDetail = ''
    var otherblood=''
    if (e.detail.value.blood == 0) {
      wx.showToast({
        title: '血型不能为空',
      })
      return;
    }
    if (e.detail.value.blood == 1) {
      bloodDetail = 'A型'
    } else if (e.detail.value.blood == 2) {
      bloodDetail = 'B型'
    } else if (e.detail.value.blood == 3) {
      bloodDetail = 'AB型'
    } else if (e.detail.value.blood == 4) {
      bloodDetail = 'O型'
    } else if (e.detail.value.blood == 5) {
      bloodDetail = '其他'
      otherblood = e.detail.value.bloodss
    }
    //  性别
    var sexDetail = ''
    if (e.detail.value.sex == 0) {
      wx.showToast({
        title: '性别不能为空',
      })
      return;
    }
    else if (e.detail.value.sex == 1) {
      sexDetail = 1
    } else if (e.detail.value.sex == 2) {
      sexDetail = 2
    }
    // 是否驾驶
    var driver = '';
    if (e.detail.value.is_first == 0) {
      wx.showToast({
        title: '请选择是否驾驶过卡丁车',
      })
      return;
    }
    else if (e.detail.value.is_first == 1) {
      driver = 1
    } else if (e.detail.value.is_first == 2) {
      driver = 2
    }

    if (!(/^1[34578]\d{9}$/.test(e.detail.value.tel))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }

    var nickname = app.globalData.userInfo.nickName
    var avatar = app.globalData.userInfo.avatarUrl

    http.postReq('api/members/' + app.user_id, {
      name: e.detail.value.name,
      sex: sexDetail,
      date_of_birth: e.detail.value.date_of_birth,
      is_first: driver,
      blood: bloodDetail,
      otherblood:otherblood,
      tel: e.detail.value.tel,
      height: e.detail.value.height,
      nickname: nickname,
      avatar: avatar,
    }, function (res) {
       if(res.status==1){
         var datas = {
           status: 0,
           price: that.data.price,
           member_id: app.user_id,   //成员id
           exercise_id: that.data.id,        //活动id
           is_my: 2
         }
         http.postReq('api/orders/add', datas, function (res) {
         if(res.status==500){
              wx.showToast({
                title: res.msg,
                icon:'none'
              })
              return false;
            }else{
              var openid = wx.getStorageSync('openid');
              var id = res.data.id;
            wx.request({
             url: app.address + 'api/wxpay/index',
             data: { openid: openid, order_id: id },
             header: { 'content-type': 'application/x-www-form-urlencoded' },
             success: function (res) {
               var payData = res.data;
               utils.pay(payData, function (e) {
                 if (e.errMsg == 'requestPayment:ok'){
                     wx.navigateTo({
                       url: "/pages/success/success?status=1&title=活动报名成功",
                     })
                 }else{
                  // return false;
                  //  wx.showToast({
                  //    title: '结算失败，请重新结算',
                  //  })

                  that.setData({
                    showModelCost:true
                  })
                 }  
               })
              if(res.status==500){
                wx.navigateTo({
                  url: "/pages/success/success?status=2&title=活动报名失败",
                })
              }
             }
           })
          }
         })
       }
      // wx.showToast({
      //   title: '提交成功',
      // })


    })

  },
  closeDialog(){
    this.setData({
      showModelCost: false
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.confimInfor });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

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
  onShareAppMessage: function () {

  }
})