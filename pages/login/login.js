// pages/login/login.js
let app = getApp();

Page({
  /*   data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }, */

  /* 监听页面加载 */

  /*   onLoad: function (options) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                var app = getApp();
                app.globalData.userInfo = res.userInfo;
              }
            })
          }
        },
      });
    }, */

  handleGetUserInfo(e) {
    //console.log(e)
    const { userInfo } = e.detail; // or just e.detail
    //console.log(e);
    //console.log(userInfo);
    //app.globalData.userInfo = e.detail.userInfo;
    //console.log(app.globalData.userInfo);
    const db = wx.cloud.database()
    db.collection('testDatabase').add({
      data: {
        userinfo: userInfo,
      },
      success: res => {
        console.log("插入成功");
      }
    })
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})