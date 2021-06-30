// pages/mine/mine.js
let app = getApp();


Page({
  data: {
    userinfo: {}
  },

  onShow() {
    const userinfo = wx.getStorageSync("userinfo")
    this.setData({
      userinfo: userinfo
    })
  }

})