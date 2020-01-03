// components/buy/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideBuy: {
      type: Boolean,
      value: true
    },
    partData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideBuyView: function (e) {// 隐藏商品弹框
      if (e.target.dataset.target == 'self')
        this.setData({
          hideBuy: true
        })
    },
    getCount: function (e) {
      this.triggerEvent('onGetCount', e.detail)
    },
    buy: function () {
      this.setData({
        hideBuy: true
      })
      this.triggerEvent('buyEvent')
    }
  }
})
