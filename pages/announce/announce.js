// pages/announce/announce.js
var http = require('../../utils/http.js')
var utils = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    time: "",
    imageList:[],
    sex: ['请选择', "男", "女"],
    sexIndex: 0,
    blood: ['请选择', 'A型', 'B型', 'AB型', 'O型','其他'],
    bloodIndex: 0,
    dates:'',
    driver: ['请选择','是', '否'],
    driverIndex: 0,
    isAgree: false,
    checked:true,
    inputValue:'',
    covers:{},
    inputValueId:'',
    coverStatus:false,
    checkeds:true,
    timesCan:"",
    timeValue:'',
    passchecked:false,
    allInfor:{},
    accounts: [],
    accountIndex: 0,
    accountChuo:'',
    accountChuoIndex:0,
    userName:'',
    toShowModel:true,  //授权信息弹框
    showBlood:false,
    showModelCost:false

  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  toDate:function(e){
    console.log(this.data.timesCan)
    var that=this;
    var timescan=''
    if (that.data.inputValue != ''){
      if (that.data.timesCan!=''){
        timescan = JSON.stringify(that.data.timesCan)
        wx.navigateTo({
          url: '/pages/date/date?time=' + timescan + '&name=' + that.data.inputValue,
        })
      }else{
        wx.showToast({
          title: '该赛事暂无活动时间，请选择其他活动',
          icon:'none'
        })
      }
     }else{
      wx.showToast({
        title: '请选择活动类型',
        icon: 'none'
      })
    }
  },

  bindAccountChange: function (e) {
    var that=this;
    this.setData({
      accountIndex: e.detail.value,
      accountChuoIndex: e.detail.value
    })
  },
  toBindType:function(e){
    var that=this
   wx.navigateTo({
     url: '/pages/chooseActity/chooseActity',
   })
  },

  chooseImage: function () {
    var that = this;
    console.log('aaaaaaaaaaaaaaaaaaaa')
    wx.chooseImage({
      // count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log('ssssssssssssssssssssssssss')
        //缓存下 
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000,
          success: function (ress) {
            console.log('成功加载动画');
          }
        })
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
        //获取第一张图片地址 
        var filep = res.tempFilePaths[0]
        //向服务器端上传图片 
        // getApp().data.servsers,这是在app.js文件里定义的后端服务器地址 
        wx.uploadFile({
          // url: getApp().data.servsers + '/weixin/wx_upload.do',
          url:'',
          filePath: filep,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var sss = JSON.parse(res.data)
            var dizhi = sss.dizhi;
            //输出图片地址 
            console.log(dizhi);
            that.setData({
              "dizhi": dizhi
            })

            //do something  
          }, fail: function (err) {
            console.log(err)
          }
        });
      }
    })
  },
  // previewImage: function (e) {
  //   var current = e.target.dataset.src
  //   wx.previewImage({
  //     current: current,
  //     urls: this.data.imageList
  //   })
  // },
  
  bindChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  bindSexChange: function (e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  bindBloodChange: function (e) {
    var that = this;
    this.setData({
      bloodIndex: e.detail.value
    })
    if (e.detail.value == 5) {
      that.setData({
        showBlood: true
      })
    } else {
      this.setData({
        showBlood: false
      })
    }
  },
  driverChange: function (e) {
    this.setData({
      driverIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    if (e.detail.value.length>0) {
      this.setData({
        checked: false
      });
    }else{
      this.setData({
        checked: true
      });
    }
    this.setData({
      isAgree: !!e.detail.value.length,
    });
  },
  showTopTips:function(e){
  },

  toPhotos:function(e){
    var that=this
     wx.navigateTo({
       url: '/pages/photosList/photosList?posts_id=' + that.data.inputValueId,
     })
  },

  switchChange:function(e){
   var that=this
   that.setData({
     passchecked: !that.data.passchecked
   })
  },
  switchChangeTwo:function(){
    var that = this
    that.setData({
      checkeds: !that.data.checkeds
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        toShowModel: false
      })
    }
  },
  getUserInfo: function (e) {
    var that=this;
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == 'getUserInfo:fail auth deny'){
       wx.showToast({
         title: '您需要确认授权才能发布活动哦',
         icon:'none',
       })
      that.setData({
        toShowModel: true
      })
    }else{
      var nickname = app.globalData.userInfo.nickName;
      var avatar = app.globalData.userInfo.avatarUrl;
      http.postReq('api/members/' + app.user_id, {
        nickname: nickname,
        avatar: avatar,
      }, function (res) {
        that.setData({
          toShowModel: false
        })
      })
     // that.formSubmit(e)

    }
  },

  formSubmit(e) {
    var that=this;
    that.setData({
      
    })
    var is_my='';
    var pass='';
    //  血型
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
    } else if (e.detail.value.blood == 5) {
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
    } else if (e.detail.value.sex == 2) {
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

    // 活动类型
    var postsId=''
    if (that.data.inputValueId == '' || that.data.inputValueId==undefined){
        wx.showToast({
          title: '请填写活动类型',
        })
        return; 
    }else{
      postsId = that.data.inputValueId
    }
    //日期
    var timeDate=''
    if (that.data.accountChuo[that.data.accountChuoIndex] == '') {
      wx.showToast({
        title: '时间不能为空',
      })
      return;
    }else{
      timeDate = that.data.accountChuo[that.data.accountChuoIndex]
    }

    //活动名称
    var nameAll=''
    if (e.detail.value.name == '' || e.detail.value.name == undefined) {
      wx.showToast({
        title: '请填写活动名称',
      })
      return;
    }else{
      nameAll = e.detail.value.name
    }

    //  封面
    var coverStatus = ''
    if (that.data.coverStatus == false) {
      wx.showToast({
        title: '封面图不能为空',
      })
      return;
    } else {
      coverStatus = that.data.covers
    }

    //密码
  var passwords=''
    if (that.data.passchecked==true){
      passwords = e.detail.value.password
    }else{
      passwords = ''
    }

// 头像昵称
    var nickname = app.globalData.userInfo.nickName
    var avatar = app.globalData.userInfo.avatarUrl

    if (that.data.checkeds == false) { 
       is_my = 2;
      var data = {
        posts_id: postsId,
        name: nameAll,
        pic: coverStatus,
        password: passwords,
        is_my: is_my,
        time: timeDate,
        create_by: app.user_id,
        // nickname: nickname,
        // avatar: avatar,
        // user_name: e.detail.value.user_name,
        // date_of_birth: e.detail.value.date_of_birth,
        // sex: sexDetail,
        // blood: bloodDetail,
        // height: e.detail.value.height,
        // tel: e.detail.value.tel,
        // is_first: driver
      }
      //  console.log('data', data)
      http.postReq('api/exercise', data, function (res) {
        console.log(res)
        // var isMy = res.data.create_by
        // if (isMy == app.user_id) {
         if(res.status==1){
            wx.showToast({
              title: res.msg,
            })
           wx.navigateTo({
              url: "/pages/success/success?status=1&title=活动创建成功&product=1",
            })
             that.setData({
                 inputValue: '',
                 timeValue: '',
                 accountIndex: '',
                 userName: '',
                 coverStatus: false,
                 checked: true,
                 isAgree: false,
               })
           }else if(res.status==500){
              wx.showToast({
                title: res.msg,
                icon:'none'
              })
           }
        //  }
      })
  
    } else if(that.data.checkeds == true) {
      if (!(/^1[34578]\d{9}$/.test(e.detail.value.tel))) {
        wx.showToast({
          title: '手机号码有误',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
        is_my = 1
        var data = {
        posts_id: postsId,
        name: nameAll,
        pic: coverStatus,
        password: passwords,
        is_my: is_my,
        time: timeDate,
        create_by: app.user_id,
        user_name: e.detail.value.user_name,
        date_of_birth: e.detail.value.date_of_birth,
        sex: sexDetail,
        blood: bloodDetail,
        otherblood: otherblood,  //其他血型
        height: e.detail.value.height,
        tel: e.detail.value.tel,
        is_first: driver,
        nickname: nickname,
        avatar: avatar,

      }
      http.postReq('api/exercise/all', data, function (res) {
        var openid = wx.getStorageSync('openid');
        var id = res.data.order_id;

        wx.request({
          url: app.address +'api/wxpay/index',
          data: { openid: openid, order_id: id},
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success:function(res){
            if (res.data.status=='500'){
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
              return false;
            }else{
           var payData=res.data;
            utils.pay(payData,function(e){
              that.setData({
                // inputValue: '',
                // timeValue: '',
                // accountIndex: '',
                // userName: '',
                // coverStatus:false,
                // checked: true,
                // isAgree: false,
              })
            if (e.errMsg == 'requestPayment:ok') {
              that.setData({
                inputValue: '',
                timeValue: '',
                accountIndex: '',
                userName: '',
                coverStatus:false,
                checked: true,
                isAgree: false,
                showModelCost: false,
              })
               wx.navigateTo({
                 url: "/pages/success/success?status=1&title=活动发布成功",
               })
             }else{
              that.setData({
                showModelCost:true
               })
             } 
            })
            }
          }
        })
      })
    } 
  },

  closeDialog(){
   this.setData({
     showModelCost: false,
       inputValue: '',
       timeValue: '',
       accountIndex: '',
       userName: '',
       coverStatus: false,
       checked: true,
       isAgree: false,

    })

  },
  // toPay(e){

  //   console.log(e)
  //   this.setData({
  //     showModelCost: false
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
  onShow() {
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.announce });
    if (app.globalData.userInfo){
    var that = this;
    var bloods = '';
    var datess = ''
    http.getReq('api/members/' + app.user_id,{}, function (res) {
      if (res.blood == "A型") {
        bloods = 1
      } else if (res.blood == "B型") {
        bloods = 2
      } else if (res.blood == "AB型") {
        bloods = 3
      } else if (res.blood == "O型") {
        bloods = 4
      } else if (res.blood == "其他" ){
         bloods=5
         that.setData({
           showBlood:true
         })
        //  blood[bloodIndex] = res.blood
      } 
      else if (res.blood == "Null" || res.blood == "undefined") {
        bloods = ''
      }
      if (res.date_of_birth == 'Null' || res.date_of_birth == 'undefined' || res.date_of_birth == '') {
        datess = ''
      } else {
        datess = res.date_of_birth
      }
      var telss = ''
      if (res.tel == 'Null' || res.tel == 'undefined' || res.tel == '') {
        telss = ''
      } else { telss = res.tel }

      var heights = ''
      if (res.height == 'Null' || res.height == 'undefined' || res.height == '') {
        heights = ''
      } else { heights = res.height }
      that.setData({
        allInfor: res,
        sexIndex: res.sex,
        dates: datess,
        driverIndex: res.is_first,
        bloodIndex: bloods,
        tels: telss,
        heights: heights,

      })
     })
    }
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