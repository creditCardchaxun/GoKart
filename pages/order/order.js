// pages/order/order.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require('../../utils/http.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabsNav: ["我发布过的活动","我参与过的活动"],
    tabs: ["全部", "可参加", "已成团", "未成团", "已退团"],
    activeIndexs:0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    showModel:false,
    list:[],
    countTime:'',
    tuiStatus:'退团',
    activeCom:'',
    activeTime:false,
    join:[],
    countTime2:'',
    textArr:[],
    tuiAll:'',
    disableds:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  toJoin:function(){
  },
  // 我发布过的活动倒计时
  forDate:function(){
   var that=this;
    that.data.timer = setInterval(function () {
      var allTimes = [];
      var allTime = '';
      for (var i in that.data.list) {
        if (that.data.list[i].complate_status == 2 || that.data.list[i].complate_status == -1) {
          allTime = '活动取消'  
        } else if (that.data.list[i].complate_status != 2 || that.data.list[i].complate_status != -1){
        var countTimes = that.data.list[i].start
        var create_time = parseInt(countTimes)
      var leftTime = (parseInt(create_time) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
      if (leftTime > 0) {
        var days = parseInt(leftTime / (1000 * 60 * 60 * 24)) < 10 ? '0' + parseInt(leftTime / (1000 * 60 * 60 * 24)) : parseInt(leftTime / (1000 * 60 * 60 * 24));
        var hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10) < 10 ? '0' + parseInt(leftTime / 1000 / 60 % 60, 10) : parseInt(leftTime / 1000 / 60 % 60, 10);
        // var seconds = parseInt(leftTime / 1000 % 60, 10);
          allTime ='剩余时间:'+ days+"天"+hours+"时"+ minutes + "分";
        // console.log(minutes)
      } else{
            allTime = '活动已结束'  
        } 
     
      // } 
     
     }
        allTimes[i] = allTime;
      }
      that.setData({
        countTime: allTimes,
      })
    }, 1000); 
  },

// 我参与过的活动倒计时
  forDate2: function () {
    var that = this;
    var alltimes2=[];
    that.data.timer2 = setInterval(function () {
      for (var i in that.data.join) {
        var allTimecan = ''
        if (that.data.join[i].complate_status == 2 || that.data.join[i].complate_status == -1) {
          allTimecan = '活动取消'
        } else if (that.data.join[i].complate_status != 2 || that.data.join[i].complate_status != -1) {
        var countTimes = that.data.join[i].start
        var create_time = parseInt(countTimes)
        var leftTime = (parseInt(create_time) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
        if (leftTime > 0) {
          var days = parseInt(leftTime / (1000 * 60 * 60 * 24)) < 10 ? '0' + parseInt(leftTime / (1000 * 60 * 60 * 24)) : parseInt(leftTime / (1000 * 60 * 60 * 24));
          var hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10) < 10 ? '0' + parseInt(leftTime / 1000 / 60 % 60, 10) : parseInt(leftTime / 1000 / 60 % 60, 10);
          // var seconds = parseInt(leftTime / 1000 % 60, 10);
          allTimecan ='剩余时间:' +days + "天" + hours + "时" + minutes + "分";
          // console.log('参与活动倒计时',allTime)
          // console.log(minutes)
        } else{
          allTimecan = '活动已结束'
         }
        }
        alltimes2[i] = allTimecan
        // } 
      }
      that.setData({
        countTime2: alltimes2,
      })
    }, 1000);
  },

  tabClick: function (e) {
    var that=this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      list:[],
      join:[]
    });
    if (that.data.activeIndexs==0){
      that.fabu()
    } else if (that.data.activeIndexs == 1){
      that.canyu()
    }
    // that.setData({
    //   activeCom: activequ,
    //   activeTime: activeTime,
    // })
  },
  
  // 我发布过的活动  
  fabu:function(){
    var that = this;
    var status = ''
    var activequ = ''
    var activeTime = ''
    var disabled=[];
    var data = {}
    if (that.data.activeIndex == 0) {
      activeTime = false
    } else if (that.data.activeIndex == 1) {
      data.status = 0
      activeTime = false

    } else if (that.data.activeIndex == 2) {
      data.status = 1
     
      activeTime = false

    } else if (that.data.activeIndex == 3) {
      data.status = -1
      activequ = '活动取消',
      activeTime = true

    } else if (that.data.activeIndex == 4) {
      data.status = 2
      activequ = '活动取消'
      activeTime = true
    }
    wx.request({
      url: app.address + 'api/wfb/' + app.user_id,
      data,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // console.log('订单列表1', res.data.data)
        var fabulist = '';
        if (res.data.status == 1) {
          fabulist = res.data.data
          fabulist.forEach((item, index) => {
            var leftTimes = (parseInt(item.start) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
            if (leftTimes> 0) {
              var textArr = [];
              textArr[0] = '退团';
              textArr[1] = '退团';
              textArr[-1] = '重新开团';
              textArr[2] = '重新开团';
              fabulist[index].status = textArr[item.complate_status];
              
              if (item.complate_status==1){
                  disabled.push(true)
              }else{
                  disabled.push(false) 
                }
            } else if (leftTimes<=0) {
              var textArr = [];
              textArr[0] = '重新开团';
              textArr[1] = '重新开团';
              textArr[-1] = '重新开团';
              textArr[2] = '重新开团';
              fabulist[index].status = textArr[item.complate_status];
              disabled.push(false)
          }
          // res.data.data[index].status = textArr[item.complate_status];
         })
        }else{
           fabulist=''
         } 
        that.setData({
          list: fabulist,
          disableds: disabled
          // activeCom: activequ,
          // activeTime: activeTime, 
        })
      }
    })
  },

  // 我参与过的活动
  canyu:function(){
    var that = this;
    var status = ''
    var activequ = ''
    var activeTime = ''
    var data = {}
    var disabled=[]
    if (that.data.activeIndex == 0) {
      activeTime = false
    } else if (that.data.activeIndex == 1) {
      data.status = 0
      activeTime = false

    } else if (that.data.activeIndex == 2) {
      data.status = 1
      activeTime = false

    } else if (that.data.activeIndex == 3) {
      data.status = -1
      activequ = '活动取消',
      activeTime = true

    } else if (that.data.activeIndex == 4) {
      data.status = 2
      activequ = '活动取消'
      activeTime = true
    }
    wx.request({
      url: app.address + 'api/wcy/' + app.user_id,
      data,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
         var canyulist = ''
        if (res.data.status == 1) {
         canyulist = res.data.data
         canyulist.forEach((item, index) => {
           var leftTimess = (parseInt(item.start) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
           if (leftTimess > 0) {
            var textArr = [];
            textArr[0] = '退团';
            textArr[1] = '退团';
            textArr[-1] = '重新开团';
            textArr[2] = '重新开团';
            canyulist[index].status = textArr[item.complate_status];
             if (item.complate_status==1){
               disabled.push(true)
             }else{
               disabled.push(false)
             }
 
           } else if (leftTimess <= 0) {
            var textArr = [];
            textArr[0] = '重新开团';
            textArr[1] = '重新开团';
            textArr[-1] = '重新开团';
            textArr[2] = '重新开团';
            canyulist[index].status = textArr[item.complate_status];
             disabled.push(false)
          }
          // res.data.data[index].status = textArr[item.complate_status];
         })
        }else{
          canyulist=''
        }
        that.setData({
          join: canyulist,
          disableds: disabled
          // activeCom: activequ,
          // activeTime: activeTime,
        })
   
      }
    })
  },






  tabClickNav:function(e){
    this.setData({
      // sliderOffset: e.currentTarget.offsetLeft,
      activeIndexs: e.currentTarget.id
    });
    var that=this;
    if (e.currentTarget.id == 0) {
      //  我发布过的
      this.fabu()
    } else if (e.currentTarget.id == 1){
      this.canyu()
    }
  },

  returnTuan:function(e){
    var wss=''
    var id=e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.allstatus
    var day = e.currentTarget.dataset.day
    var totalTime = (parseInt(day) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
    if (status == 2){
      wx.switchTab({
        url: '/pages/announce/announce',
      })
      wss=false
    } else if (status == -1){
      http.postReq('api/wxpay/refund', { order_id: id }, function (res) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
      })
    } else if (status == 0 && totalTime<=0){
      wss = false
      wx.switchTab({
        url: '/pages/announce/announce',
      })
    } else if (status == 1 && totalTime<= 0) {
      wss = false
      wx.switchTab({
        url: '/pages/announce/announce',
      })
    }
    else{
      wss =true
    }
    this.setData({
      showModel: wss,
      ids: id,
      tuiAll: status
    })

  },
   
  returnTuan2:function(e){
    var wss = ''
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.allstatus
    var day = e.currentTarget.dataset.day
    var totalTime2 = (parseInt(day) * 1000 + 30 * 60 * 1000) - (new Date().getTime());
    if (status == 2) {
      wx.switchTab({
        url: '/pages/announce/announce',
      })
      wss = false
    } else if (status == -1) {
      http.postReq('api/wxpay/refund', { order_id:id}, function (res) {
        wx.switchTab({
          url: '/pages/announce/announce',
        })
      })
    } else if (status == 0 && totalTime2 <= 0) {
      wss = false
      wx.switchTab({
        url: '/pages/announce/announce',
      })
    } else if (status == 1 && totalTime2 <= 0) {
      wss = false
      wx.switchTab({
        url: '/pages/announce/announce',
      })
    }else {
      wss = true
    }
    this.setData({
      showModel: wss,
      ids: id,
      tuiAll: status
    })

  },

// 确认退团
  showReturn:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
  if(that.data.activeIndexs==1){ 
    if (status == 0){
      http.postReq('api/wxpay/refund', { order_id: id},function (res) {
        that.setData({
          showModel: false,
        })
        that.canyu() 
  
      })
    }
  } else if (that.data.activeIndexs == 0){
    if (status == 0) {
      http.postReq('api/wxpay/refund', { order_id: id }, function (res) {
        that.setData({
          showModel: false,
        })
         that.fabu() 
      })
    }
   }  
  },
  closeDialog:function(e){
    this.setData({
      showModel: false
    })
  },

  deleteTuan:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    http.postReq('api/delete/order/' + id,{user_id:app.user_id}, function (res) {
       if(res.status!=1){
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
      } else if (res.status == 1) {
        wx.showToast({
          title: res.msg,
        })

         if (that.data.activeIndexs == 0) {
           that.fabu()
         } else if (that.data.activeIndexs == 1) {
           that.canyu()
         }
      }
     })
   },

  onUnload: function (){
    clearInterval(this.data.timer);
    clearInterval(this.data.timer2);
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.order });
   var that=this;
    that.fabu()
    that.canyu()
    // 倒计时
    that.forDate()
    that.forDate2()
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
  onShareAppMessage: function () {

  }
})