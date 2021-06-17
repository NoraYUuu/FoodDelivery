// pages/mine/mine.js
Page({
  data: {
    userinfo: {}
  },

  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({ userinfo })
  }

})