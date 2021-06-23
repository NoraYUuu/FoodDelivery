// pages/login/login.js
Page({
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    const db = wx.cloud.database()
    db.collection('testDatabase').add({
      data: {
        userinfo: userInfo
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