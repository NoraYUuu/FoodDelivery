// app.js

App({
  globalData: {
    userInfo: null
  },
  //新增globalData

  onLaunch: function () {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //console.log(res.code);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: "GET", //'post',
            data: {
              appid: 'wx95bf8e473873b65d',
              secret: '05e4eefc3c4f9601b0f6c44558b70300',
              js_code: res.code,
              grant_type: 'authorization_code',
              //req_id: 'TIbdqvXWf-RuhOpa'
            },
            header: {
              'Content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data);
              //wx.setStorageSync('sessionKey', response.data.data.session_key); //存储sessionKey在storage
              wx.setStorageSync('info', res.data);
            }
          })
        } else {
          console.log("登录失败");
        }
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
    //this.globalData = {}
    // 云环境id
  },

  /* globalData: {
    userInfo: null
  }, 
  to test cloud environment
  */
  formatDate: function (time) {
    const date = new Date(time);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber).join(':');
  },
  formatNumber: function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

})