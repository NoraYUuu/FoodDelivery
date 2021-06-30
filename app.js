// app.js
import GoEasy from './utils/goeasy-2.0.12.min.js';

App({
  globalData: {
    goEasy: GoEasy.getInstance({
      host: "singapore.goeasy.io", //所在区域
      appkey: "BC-e125f5620d5940659c206dc83fde9872", //common key
      modules: ['pubsub']
    }),
    userInfo: ''
  },
  //新增globalData

  onLaunch: function () {
    //this.extendDateFormat();
    //建立连接
    this.globalData.goEasy.connect({
      onSuccess: function () {
        console.log("GoEasy connect successfully.")
      },
      onFailed: function (err) {
        console.log("Failed to connect to GoEasy, code: " + err.code + ", error:" + err.content);
        wx.showModal({
          icon: "none",
          title: err.code.toString(),
          content: err.content,
          showCancel: false,
          duration: 6000
        });
      },
      onProgress: function (attemps) {
        console.log("GoEasy is connecting", attemps);
      }
    });
    //连接GoEasy

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