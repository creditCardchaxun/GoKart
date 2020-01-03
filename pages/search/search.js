// pages/search/search.js
var http = require('../../utils/http.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    lists:[],
    showModel:false,
    hotReach:[],
    historyReach:[],
    toFail:false,
    titleMain:'搜索'
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
    
    });
  },
  reachInput:function(){
    var that=this;
    if (that.data.titleMain=='搜索'){
      that.allList(that.data.inputVal)
      that.setData({
        titleMain: '取消'
      })
    } else if (that.data.titleMain == '取消'){
      that.setData({
        inputVal: "",
        inputShowed: false,
        titleMain: '搜索'
      });
    }
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that=this;
    this.setData({
      inputVal: e.detail.value
    });
    
    //  wx.request({
    //    url: app.address + 'api/activity/search',
    //    data: { name: that.data.inputVal, user_id:app.user_id},
    //    header: { 'content-type': 'application/x-www-form-urlencoded'},
    //    method:'GET',
    //    success:function(res){
    //     that.setData({
    //       lists: res.data.data
    //     })
    //     console.log(res.data.data)
    //    }
    //  })
  },
  toChange: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id
    var like = e.currentTarget.dataset.like
    wx.request({
      url: app.address + 'api/collection',
      data: { pid: id, status: like, create_by: app.user_id, type: 1 },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.allList(that.data.inputVal)
        if (like == 1) {
          that.setData({
            showModel: true
          })
        }
        if (like == 2) {
          wx.showToast({
            title: '取消收藏成功',
          })
        }
      }
    })
  },

// 公共搜索接口
  allList:function(str){
   var that=this;
    that.setData({
      lists:[]
    })
    wx.request({
      url: app.address + 'api/activity/search',
      data: { name: str, user_id: app.user_id },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'GET',
      success: function (res) {
        console.log(res.data.status)
        if (res.data.msg =='success' ){
        that.setData({
          lists: res.data.data,
          toFail: false
        })
        } else if (res.data.msg =='error'){
          that.setData({
            toFail: true
          })
        }
      },

    })
  },
  closeDialog:function(){
    this.setData({
      showModel: false
    })
  },
  // 清除全部
  toDeleteAll:function(){
    var that = this;
    http.postReq('api/histoy/keywords/deleteall', { user_id: app.user_id }, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: '清空成功',
        })
      }
      that.onLoad()
    }) 
  },

// 删除单个
  toDelete: function (e) {
    var that = this;
    var id=e.currentTarget.dataset.id
    http.postReq('api/histoy/keywords/delete/' + id, { user_id: app.user_id} ,function (res) {
       if(res.status==1){
         wx.showToast({
           title: '删除成功',
         })
       }
       that.onLoad()
    })
  },
  // 热门搜索点击搜索
  hotToReach:function(e){
    var that=this;
    var name=e.currentTarget.dataset.name;
     that.setData({
      inputVal:name,
      inputShowed:true,
       titleMain:'取消'
    })
    that.allList(that.data.inputVal)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that=this;
    http.getReq('api/hot/keywords',{}, function (res) {
      that.setData({
        hotReach: res.data
      })
      console.log(res.data)
    })

    wx.request({
      url: app.address + 'api/histoy/keywords',
      data: { user_id: app.user_id },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        that.setData({
          historyReach: res.data.data
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
  onShow() {
    var that=this;
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.goods_search });
    that.allList(that.data.inputVal)
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