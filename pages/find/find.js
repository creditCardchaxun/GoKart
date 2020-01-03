// pages/find/find.js
var app=getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    id:'',
    navbarActiveIndex:0,
    navbarTitle: [
      //  "全部",
      //  "卡丁车",
       ],
    starHover:false,
    allList:[],
    otherList:[],
    red:1,
    showModel: false, 
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  toReach:function(){
    wx.navigateTo({
      url: '/pages/search/search',
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
    * 点击导航栏
    */
   onNavBarTap: function (event) {
        var that = this;

       // 获取点击的navbar的index
     let navbarTapIndex = event.currentTarget.dataset.navbarIndex
      this.data.id = event.currentTarget.dataset.id
     console.log(this.data.id)

     // 设置data属性中的navbarActiveIndex为当前点击的navbar
       this.setData({
         navbarActiveIndex: navbarTapIndex ,
         allList:[]     
         })
     http.getReq("api/find/activity?pid="+this.data.id+'&user_id='+app.user_id, {},function (res) {
        console.log(res)
       that.setData({
         allList: res.data
       })
      })

     if (navbarTapIndex==0){
       http.getReq('api/find?user_id='+app.user_id,{}, function (res) {
         that.setData({
           allList: res.data
         })
         console.log('列表', res.data)
       })
     }

  },

   onBindAnimationFinish: function({ detail }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
     this.setData({
      navbarActiveIndex: detail.current
    })

  },
  toChange:function(e){
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
        that.onShow()
        if (like==1){
          that.setData({
            showModel:true
          })
        }
        if (like == 2){
          wx.showToast({
            title: '取消收藏成功',
          })
        }
       }
    }) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this;
    // http.getReq('/api/find?user_id='+app.user_id,{}, function (res) {
    //   that.setData({
    //     allList: res.data    //全部
    //   })
    // })

    // http.getReq('api/find', function (res) {
    //   that.setData({
    //     allList: res.data    //全部
    //   })
    //   console.log('quanbu',res.data)
    // })

    // http.getReq('api/find/column', function (res) {
    //   that.setData({
    //     navbarTitle: res.data
    //   })
    //   console.log(res.data)
    // })



    // http.getReq('api/find/all',{user_id:app.user_id}, function (res) {
    //   that.setData({
    //     navbarTitle: res.data
    //   })
    // })
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.find_list });
    var that = this;
    http.getReq('/api/find?user_id=' + app.user_id, {}, function (res) {
      that.setData({
        allList: res.data    //全部
      })
    })

    http.getReq('api/find/all', { user_id: app.user_id }, function (res) {
      that.setData({
        navbarTitle: res.data
      })
    })
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