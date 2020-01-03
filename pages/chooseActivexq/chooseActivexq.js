// pages/chooseActivexq/chooseActivexq.js
var app=getApp()
var http = require('../../utils/http.js')
var WxParse = require('../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgLists:[],
    chooseDetail:{},
    address:[],
    markers: [],
    //当前定位位置
    latitude: '',
    longitude: '',
    nodes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      http.getReq('api/publish/activity/info?id='+options.id,{}, function (res) {
         var arr = [];
         var ab = {};
        ab.latitude = res.data.address[0].y
        ab.longitude = res.data.address[0].x
        arr.push(ab)

        that.setData({
          chooseDetail: res.data,
          nodes: res.data.desc,
          imgLists:res.data.pics,
          address: res.data.address,
          markers:arr

        })
        // WxParse.wxParse('content', 'html', res.data.desc, that);
        // console.log(des);
        WxParse.wxParse('article', 'html', res.data.content, that);
      })

    },

   toMap: function () {
      // wx.getLocation({
      //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      //   success: function (res) {
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //     wx.openLocation({
      //       latitude: latitude,
      //       longitude: longitude,
      //       scale: 28
      //     })
      //   }
      // })
     var that = this;
     wx.getLocation({
       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
       success: function (res) {
         console.log(res)
         var latitude = res.latitude
         var longitude = res.longitude
         wx.openLocation({
           latitude: JSON.parse(that.data.markers[0].latitude) ,
           longitude: JSON.parse(that.data.markers[0].longitude),
           name: 'Red1karting',
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.chooseActivexq });
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