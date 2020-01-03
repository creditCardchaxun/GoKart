// pages/success/success.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   show:true,
   title:'',
  //  showOrder:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var status=options.status
    var title=options.title
    var product=''
    // var showOrder=''
    // if (options.product==1){
    //     showOrder=true
    // }else{
    //   product = ''
    //   showOrder = false
    // }
    if (status==2){
       that.setData({
         show:false,
         title: title
       })
    }
    that.setData({
      title: title,
    })
  },
  tolist:function(){
    // var that=this;
    // if(that.data.title=='活动报名成功'){
    //   wx.switchTab({
    //     url: '/pages/order/order',
    //   })
    // }else{
      wx.switchTab({
        url: '/pages/order/order',
      })
    // }

  },
  // tohome:function(){
  //   wx.switchTab({
  //     url: '/pages/index/index',
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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