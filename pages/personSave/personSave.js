// pages/confimInfor/confimInfor.js
var app = getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择性别',"男", "女"],
    sexIndex: 0,
    blood: ['请选择血型', 'A型', 'B型', 'AB型', 'O型','其他'],
    bloodIndex: 0,
    date: '',
    driver: ['请选择是否驾驶','是', '否'],
    driverIndex: 0,
    isAgree: false,
    names:'',
    tels:'',
    heights:'',
    nicknames:'',
    avatars:'',
    allInfor:[],
    showBlood:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that=this
     var bloods=''
    http.getReq('api/members/' + app.user_id, {},function(res){
      console.log(res)
      if (res.blood=="A型"){
        bloods=1
      } else if (res.blood == "B型"){
        bloods = 2
      } else if (res.blood == "AB型") {
        bloods = 3
      } else if (res.blood == "O型") {
        bloods = 4
      } else if (res.blood=='其他') {
        bloods = 5
        that.setData({
          showBlood: true
        })
      } 
      var birth='' 
      if (res.date_of_birth == 'Null' || res.date_of_birth == 'undefined' || res.date_of_birth == ''){
        birth=''
      } else { birth = res.date_of_birth}

      var telss = ''
      if (res.tel == 'Null' || res.tel == 'undefined' || res.tel == '') {
        telss = ''
      } else { telss = res.tel }

      var heights = ''
      if (res.height == 'Null' || res.height == 'undefined' || res.height == '') {
        heights = ''
      } else { heights = res.height }

      that.setData({
        allInfor:res,
        sexIndex: res.sex,
        date: birth,
        driverIndex: res.is_first,
        bloodIndex: bloods,
        tels: telss,
        heights: heights,
        nicknames: res.nickname,
        avatars: res.avatar,
      })
    })
  },
  bindDateChange: function (e) {
    var others=e.detail.value
    this.setData({
      date: e.detail.value,
      // date: others
    })
  },
  bindSexChange: function (e) {
    var others = e.detail.value
    this.setData({
      sexIndex: e.detail.value,
      // sexs: others
    })
    console.log('性别', e.detail.value)
  },
  bindBloodChange: function (e) {
    var others = e.detail.value
    this.setData({
      bloodIndex: e.detail.value,
      // bloods: others
    })
    if (e.detail.value == 5) {
      this.setData({
        showBlood: true
      })
    }else{
      this.setData({
        showBlood: false
      })
    }
  },
  driverChange: function (e) {
    var others = e.detail.value
    this.setData({
      driverIndex: e.detail.value,
      is_firsts: others
    })
    console.log('是否驾驶', e.detail.value)
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  formSubmit:function(e){
    var that=this;
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
    } else if (e.detail.value.blood == 5){
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
    } else if (e.detail.value.sex  == 2) {
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
    // var nickname= wx.getStorageSync('nickname');
    // var avatar= wx.getStorageSync('avatar');
    var nickname = app.globalData.userInfo.nickName
    var avatar = app.globalData.userInfo.avatarUrl
    
    var username=''
    if (e.detail.value.name == '' || e.detail.value.name=='undefined'){
        wx.showToast({
          title: '姓名不能为空',
        })
       username = ''
        return;
     }else{
      username = e.detail.value.name
     }
     var phone=''
    if (e.detail.value.tel == '' || e.detail.value.tel == 'undefined') {
      wx.showToast({
        title: '手机号不能为空',
      })
      phone=''
      return false;
    }else{
      if (!(/^1[34578]\d{9}$/.test(e.detail.value.tel))) {
        wx.showToast({
          title: '手机号码有误',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }else{
        phone = e.detail.value.tel
      }
    } 


    http.postReq('api/members/'+app.user_id,{
      name: username,
      sex: sexDetail,
      date_of_birth: e.detail.value.date_of_birth,
      is_first: driver,
      blood: bloodDetail,
      otherblood: otherblood,
      tel: phone,
      height: e.detail.value.height,
      nickname: nickname,
      avatar: avatar,
    }, function (res) {
        wx.showToast({
          title: '提交成功',
        })
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.personSave });
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