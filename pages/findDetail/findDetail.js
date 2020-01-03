// pages/findDetail/findDetail.js
var app=getApp()
var http = require('../../utils/http.js')
var WxParse = require('../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   findDetail:{},
   red:1,
   showModel: false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var pages = getCurrentPages();//获取页面栈
    // if (pages.length > 1) {
    //   //上一个页面实例对象
    //   var prePage = pages[pages.length - 2];
    //   //调用上一个页面的onLoad方法
    //    prePage.allList()
    // } 

     var that=this;
    http.getReq("api/find/info?id=" + options.id +'&user_id='+app.user_id,{}, function (res) {
      that.setData({
        findDetail: res.data,
        red: res.data.red
       })
       WxParse.wxParse('article', 'html', res.data.content, that);
      })
  }, 

  toStatus:function(e){
    var id = e.currentTarget.dataset.id
    var like = e.currentTarget.dataset.like
    // var flike=''
    // if (like==1){
    //   flike=2
    // } else if (like == 2){
    //   flike = 1
    // }
    var that = this;
    wx.request({
      url: app.address + 'api/collection',
      data: { pid: id, status: like, create_by: app.user_id, type: 1 },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
          if(like==2){
          wx.showToast({
            title: '取消收藏成功',
            })
          } else if (like == 1){
            that.setData({
              showModel: true
            })
          }
         var d={id:id}
         that.onLoad(d)
        // that.setData({
        //   red:flike
        // })
      }
    })

  },

  showModel() {
    this.setData({
      showModel: true
    })
  },

  closeDialog() {
    this.setData({
      showModel: false
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
  onShow() {
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.find_detail });
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