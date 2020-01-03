var rootDocment = 'https://kart.yaocongkeji.com/';
var header = {
    // 'Accept': 'application/json',
    // 'content-type': 'application/json',
    'content-type':'application/x-www-form-urlencoded',
    'Authorization': null,
}
/*
 *  get
 */
function getReq(url,data,cb) {
    wx.request({
        url: rootDocment + url,
        method: 'GET',
        data: data,
        header: header,
        success: function (res) {
            return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
            failModel()
            return typeof cb == "function" && cb(false)
        }
    })
}
/*
 * post
 */
function postReq(url, data, cb) {
        wx.request({
            url: rootDocment + url,
            header: header,
            data: data,
            method: 'POST',
            success: function (res) {
                return typeof cb == "function" && cb(res.data)
            },
            fail: function () {
                failModel()
                return typeof cb == "function" && cb(false)
            }
        })
    }
function postReqSB(url,  cb) {
    wx.request({
        url: rootDocment + url,
        header: header,
        method: 'POST',
        success: function (res) {
            return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
            failModel()
            return typeof cb == "function" && cb(false)
        }
    })
}

/*
 * del
 */
function delReq(url, data, cb) {
    wx.request({
        url: rootDocment + url,
        header: header,
        data: data,
        method: 'DELETE',
        success: function (res) {
            return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
            failModel()
            return typeof cb == "function" && cb(false)
        }
    })

}
/*
 * upload
 */
function upload(url, filePath, cb,type,_data) {
    let _type = type || 'image';
    wx.uploadFile({
        url: rootDocment + url,
        filePath: filePath,
        name: _type,
        method:"POST",
        formData:_data,
        header: {
          'content-type': 'Content-type:text/html;multipart/form-data'
        }, // 设置请求的 header
        success: function (res) {
            return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
            failModel()
            return typeof cb == "function" && cb(false)
        }
    })
}
/*
 * 
 */
function failModel(){
    wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
    })
}
/*
 * 
 */
module.exports = {
    getReq: getReq,
    postReq: postReq,
    delReq: delReq,
    upload: upload,
    header: header,
    postReqSB: postReqSB
}
