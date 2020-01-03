
function goRouter(_url,_option){
    wx.navigateTo({
        url: _url + _option
    })
}
function successModel(_msg){
    wx.showToast({
        title: _msg,
        duration: 2000,
        mask: true,  
        icon: 'success',   
        success: function () { },
        fail: function () { },    
        complete: function () { }
    })
}
function failModel(_msg){
    wx.showToast({
        title: _msg,
        duration: 2000,
        mask: true,  
        icon: 'none',   
        success: function () { },
        fail: function () { },    
        complete: function () { }
    })
}
function isLoginStorage(){
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;
    var _url = ""
    for (var i = 0; i < url.split("/").length - 2;i++){
        _url += "../"
    }
    if(!wx.getStorageSync("uuid") || !wx.getStorageSync("userInfo")){
        console.log(url)
        wx.navigateTo({
            url: _url + 'login/login',
        })
    }
}

function pay(res,cb){
    wx.requestPayment({
        'timeStamp':res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
         return typeof cb == "function" && cb(res)
        },
        'fail': function (res) {
          return typeof cb == "function" && cb(res)
        }
    })
}

function isLoginOver() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;
    var _url = ""
    console.log(url.split("/").length - 2)
    for (var i = 0; i < url.split("/").length - 2; i++) {
        _url += "../"
    }

    wx.navigateTo({
        url: _url + 'login/login',
    })
}

function overLogin(res){
    if (res.uuid == 10001) {
        isLoginOver()
    } else {
       failModel(res.message)
    }  
}
function locationUpload(cb) {
    wx.chooseImage({
        sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'],
        success: function (res) {
            console.log(res)
            return typeof cb == "function" && cb(res)
        }
    })
}
module.exports = {
    goRouter: goRouter,
    successModel: successModel,
    failModel: failModel,
    isLoginStorage: isLoginStorage,
    overLogin: overLogin,
    locationUpload: locationUpload,
    pay:pay
}

