// pages/collect/collect.js
var app=getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  collectList:[],
  starHover: false,
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  toChange: function (e) {
    console.log(e)
    this.setData({
      starHover: !this.data.starHover
    })
  },
  toChangeStar:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    var isLike = e.currentTarget.dataset.islike
    console.log(e.currentTarget.dataset.islike)
    var that=this;
    wx.request({
      url: app.address + 'api/collection',
      data: { pid: id, status: isLike , create_by: app.user_id, type:1 },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.collectlist()
        wx.showToast({
          title: '取消收藏成功',
        })
      }
    })
  },

  collectlist:function(){
    var that = this;
    wx.request({
      url: app.address + 'api/my/collection',
      data: { user_id: app.user_id },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // that.onLoad()
        that.setData({
          collectList: res.data.data
        })
        console.log(res.data)
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
  onShow() {
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.collect });
    this.collectlist()
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