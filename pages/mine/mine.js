// pages/mine/mine.js
Page({
  data: {
    userinfo: {}
  },

  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    /* 后期需将userinfo改为全局globalData */
    this.setData({ userinfo })
  }

})