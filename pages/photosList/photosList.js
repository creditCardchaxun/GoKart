// pages/photosList/photosList.js
var app=getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    shows:false,
    edit:'编辑',
    checkboxItems: [
      // { src: '/pages/img/user_right01.jpg', value: '0'},
      // { src: '/pages/img/user_right01.jpg', value: '1' }
    ],
    values:[],
    parentId:'',
    allImg:'',
    showModel:false,
    pics:[],
    showsbtn:false,
    showtitle:true
  },
  
  // chooseImage: function () {
  //   var that = this;
  //   wx.chooseImage({
  //     // count: this.data.count[this.data.countIndex],
  //     success: function (res) {
  //       //缓存下 
  //       wx.showToast({
  //         title: '正在上传...',
  //         icon: 'loading',
  //         mask: true,
  //         duration: 2000,
  //         success: function (ress) {
  //           console.log('成功加载动画');
  //         }
  //       })
  //       console.log(res)
  //       that.setData({
  //         imageList: res.tempFilePaths
  //       })
  //       //获取第一张图片地址 
  //       var filep = res.tempFilePaths[0]
  //       //向服务器端上传图片 
  //       // getApp().data.servsers,这是在app.js文件里定义的后端服务器地址 
  //       wx.uploadFile({
  //         url: app.address +'api/banner/webuploaders',
  //         filePath: filep,
  //         name: 'file',
  //         success: function (res) {
  //           var address = JSON.parse(res.data)
  //           var pic = address.pic
  //           http.postReq('api/members_photo', { pid: parseInt(app.user_id), pic:pic, status: 1, disable:0},function (res) {
  //              wx.showToast({
  //                title: '上传成功',
  //              })

  //             that.onLoad('')
  //           })

  //          }, fail: function (err) {
  //           console.log(err)
  //         }
  //       });
  //     }
  //   })
  // },
  chooseImage: function () {
    var that = this,
      pics = that.data.pics;
    console.log('1',that.data.pics)
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
        that.uploadimg()
      },
      fail: function () {
        // fail      
      },
      complete: function () {
        // complete      
      }
    })

  },
   
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    var that = this;
   app.uploadimg({
      url: app.address + 'api/banner/webuploaders',//这里是你图片上传的接口
      path: pics,//这里是选取的图片的地址数组    
    },function(res){
      that.data.pics = [];
      that.onLoad('');
    });
  },

  previewImage: function (e) {
    var id = e.currentTarget.dataset.id
    var url = e.currentTarget.dataset.url
    var previewImgArr = [];
    for (var i in this.data.checkboxItems){
      if (id ==this.data.checkboxItems[i].id){
        previewImgArr.push(this.data.checkboxItems[i].pic);
      }
    }
    wx.previewImage({
      current: url,
      urls: previewImgArr
    })
  },
  edit:function(e){
    if (this.data.parentId){
      if (this.data.edit == '编辑') {
        this.setData({
          shows:true,
          showsbtn: true,
          edit: '取消'
        })
      } else if (this.data.edit == '取消') {
        var checkboxItems = this.data.checkboxItems
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false;
        }
        this.setData({
          shows: true,
          edit: '编辑',
          showsbtn: false,
          checkboxItems: checkboxItems,
        })
      }
    }else{
    if (this.data.edit =='编辑'){
      this.setData({
        shows: !this.data.shows,
        showsbtn: true,
        edit:'取消'
      })
    } else if (this.data.edit == '取消'){
      var checkboxItems = this.data.checkboxItems
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;
      } 
       this.setData({
        shows: !this.data.shows,
         edit:'编辑',
         showsbtn: false,
         checkboxItems: checkboxItems,
      })
    }
    }
  },

  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    // if (this.data.edit == '编辑'){
    //   this.previewImage()
        
    // } else if (this.data.edit == '取消') {
       for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          if (checkboxItems[i].checked ==true){
            var tu = checkboxItems[i].pic
          }
          break;
         }
       }
      }
      this.setData({
        checkboxItems: checkboxItems,
        values: values,
        allImg: tu
      });
    // }
  
    if (this.data.parentId){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        covers: this.data.allImg
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  toDelete:function(){
    var that=this;
    if(that.data.values.length!=0){
      that.setData({
        showModel: true
      })
    }else{
      wx.showToast({
        title: '请选择图片',
      })
    }
  
  },
  closeDialog:function(){
   var that=this;
    that.setData({
      showModel:false
    })
  },
  toDeleteDetail:function(){
    var that = this;
    wx.request({
      url: app.address + 'api/members_photo_delete/' + app.user_id,
      data: { ids: that.data.values},
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status==1){
          that.setData({
            showModel: false,
            shows: !that.data.shows,
            showsbtn:false,
            edit: '编辑',
           })
          wx.showToast({
            title: '删除成功',
          })
          that.onLoad('')
       }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var parentId = options.posts_id
    if (parentId){
      that.setData({
        parentId: parentId,
        shows: !that.data.shows,
        showsbtn:false,
        // edit: '编辑',
        showtitle:false
      })
      this.listPhotos(parentId)
    } else { 
     this.listPhotos('')
    }

    // var pages = getCurrentPages();//获取页面栈
    // if (pages.length > 1) {
    //   //上一个页面实例对象
    //   var prePage = pages[pages.length - 2];
    //   //调用上一个页面的onLoad方法
    //   prePage.onLoad()
    // } 
  },
   listPhotos: function (parentId){
     var that = this;
     var data={};
     if (that.data.parentId){
       data.user_id = app.user_id
       data.status = 1;
       data.posts_id = that.data.parentId
       data.is_check=1
     }else{
       data.user_id = app.user_id
       data.status = 1;
     }
     wx.request({
       url: app.address + 'api/my/album',
       data,
       method: 'GET',
       header: { 'content-type': 'application/x-www-form-urlencoded' },
       success: function (res) {
         console.log(res)
         that.setData({
           checkboxItems: res.data.data,
           parentId: parentId
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
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.photosList });

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