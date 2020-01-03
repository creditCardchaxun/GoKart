//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
Page({
  data: {
    imgList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration:1000,
    showModel:false,
    activityAll:[],
    statusAll:'',
    showIcon:false,
    showIcon2:false,
    showIcon3:false,
    inputValue:'',
    ids:''
  },

  onLoad: function (options){
   var that=this;
    http.getReq('api/home/banner',{}, function(res){
      that.setData({
        imgList: res.data
      })
    })
 },
  showModel(){
  this.setData({
    showModel: true
   })
  },
  closeDialog(){
    this.setData({
      showModel: false
    })
  },
  toDetail:function(e){
    var id = e.currentTarget.dataset.id
    var password = e.currentTarget.dataset.password
    var that=this;
    if (password!=''){
         that.setData({
           showModel:true,
           ids:id,
           inputValue:''
         })
    }else{
      wx.navigateTo({
        url: '/pages/activeDetail/activeDetail?id=' + id+'&userStatus=1',
        })
     }
  },
  confimDialog:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id
     that.data.activityAll.forEach((item,index)=>{
        if(item.id==id){
          if (that.data.inputValue==item.password){
           wx.navigateTo({
             url: '/pages/activeDetail/activeDetail?id=' + id + '&userStatus=1',
           })
            that.setData({
              showModel: false,
              inputValue:''
            })
          }else{
            wx.showToast({
              title: '密码不正确',
            })
          }
        }    
     })
  },
  bindKeyInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  onShow(){
    var that=this;
    http.getReq('api/home/activity', {}, function (res) {
      that.setData({
        activityAll: res.data,
      })
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
     }
    return {
      title: Red1karting,
      path: 'pages/index/index',
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
