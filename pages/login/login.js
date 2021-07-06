// pages/login/login.js
let app = getApp();
const DB = wx.cloud.database().collection("user_info");

Page({
  data: {
    added: false
  },

  //点击登陆 
  handleGetUserInfo(e) {
    //console.log(e)
    const userInfo = e.detail.userInfo; // or just e.detail
    const openid = wx.getStorageSync("info").openid;
    console.log(openid);
    //app.globalData.userInfo = e.detail.userInfo;
    //console.log(app.globalData.userInfo);
    if (userInfo) {
      DB.where({ _openid: openid }).get().then(res => {
        if (res.data.length == 0) {
          console.log("查询到用户未注册,即将为用户产生注册操作")
          DB.add({
            data: {
              taskid: [], // to store pintuan in collection
              groupid: [], //to store ongoing pintuan / for groups
              userinfo: userInfo
            },
            complete: res => {
              console.log(res)
              console.log("用户注册成功,即将产生登陆操作")
              wx.setStorageSync('userDetails', res.data[0])
              wx.showToast({
                title: '登陆成功'
              })
              //store all the information about the user
            }
          })
        } else if (res.data.length != 0) {
          console.log(res)
          console.log("查询到用户已经授权注册,数据库查询到信息,即将直接产生登陆操作")
          wx.setStorageSync('userDetails', res.data[0])
          wx.showToast({
            title: '登陆成功'
          })
        } else {
          wx.showToast({
            title: "登陆异常"
          })
        }
      }).catch(err => { console.log(err) })
      //console.log(res)
    }

    /* DB.add({
      data: {
        taskid: [],
        userinfo: userInfo,
      },
      success: res => {
        console.log("插入成功");
      }
    }) */

    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})