// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    if (!wx.cloud) {
      console.error('cloud not working')
    } else {
      wx.cloud.init({
        env: 'cloud1-1gcwirla84b05897',
        traceUser: true
      })
    }
    this.globalData = {}
    // 云环境id
  },

  /* globalData: {
    userInfo: null
  }, 
  to test cloud environment
  */


})
