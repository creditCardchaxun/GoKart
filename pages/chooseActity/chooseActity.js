// pages/chooseActity/chooseActity.js
var app=getApp();
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   chooseActive:[],
    dates:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    http.getReq('api/publish/activity',{}, function (res) {
      var list = {};
      // res.data.forEach((item,index) => {
      //     console.log(item)
      //   for (var key in item.exercise_time){
      //     console.log(key)
      //     var start = that.timestampToTime(item.exercise_time[key].start_time)
      //     var end = that.timestampToTime(item.exercise_time[key].end_time)
      //     var allTime = start + "-" + end
      //        list[key] = allTime
      //   }
      // })
      that.setData({
        chooseActive: res.data,
        dates: JSON.stringify(res.data.exercise_time) 
       })

    })
  },


  toactivity:function(e){
    //  var id = e.currentTarget.dataset.id
    //  var title = e.currentTarget.dataset.title
    //  var imgs = e.currentTarget.dataset.img
    http.getReq('api/publish/activity/time?id=' + e.currentTarget.dataset.id,{}, function (res) {
      var date=''
      if (res.date != 'undefined' || res.date!=''){
          date = res.date
       }else{
        date = ''
       }
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        inputValue: e.currentTarget.dataset.title,
        inputValueId: e.currentTarget.dataset.id,
        covers: e.currentTarget.dataset.img,
        timesCan: date,
        coverStatus: true,
        timeValue:'',
        accounts: '',
        accountChuo: ''
      })
      wx.navigateBack({
        delta: 1,
      })
      // console.log(e.currentTarget.dataset.title, e.currentTarget.dataset.id, e.currentTarget.dataset.img, res.date)
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.chooseActity });
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