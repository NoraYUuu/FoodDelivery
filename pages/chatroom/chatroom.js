// pages/chat/chat.js
/* var websocket = require('../../utils/websocket.js');
var utils = require('../../utils/util.js'); */

let app = getApp();
let DB = wx.cloud.database().collection("messages");
let goEasy = app.globalData.goEasy;
let pubSub = goEasy.pubsub;

Page({

  //删除消息
  remove_msg(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    DB.doc(id).remove({
      success(res) {
        console.log("删除成功", res)
        self.onLoad()
      }
    })
  },


  /**
   * 页面的初始数据
   */
  data: {
    newslist: [{ "date": "16:14 30/06/01", "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132", "nickName": "微信用户", "type": "text", "content": "现在可以发出来信息了！！！但是我不知道怎么同时开两个窗口来调试！！！等我下午再下载一个软件！！！" },
    { "date": "16:17 30/06/01", "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132", "nickName": "123", "type": "text", "content": "呜呜呜好难" }],
    userInfo: {},
    scrollTop: 0,
    increase: false,//图片添加区域隐藏
    aniStyle: true,//动画效果
    previewImgList: [],

    message: "",
    //to store the most updated msg
    messages: [] // used in goEasy

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    const userinfo = wx.getStorageSync("userinfo")
    this.setData({
      userInfo: userinfo
    })
  },

  onLoad: function () {
    var self = this;


    //调通接口
    pubSub.subscribe({
      channel: "my_channel",
      onMessage: function (msg) {
        //console.log(msg);
        self.unshiftMessage(msg.content);
      },
      onSuccess: function () {
        //self.unshiftMessage('订阅成功。');
        console.log("订阅成功");
      },
      onFailed: function (err) {
        self.unshiftMessage('{ "content": "订阅失败，错误编码 ' + err.code + " 错误信息: " + err.content + '", "date": "' + app.formatDate(new Date()) + '","type":"text", "nickName": "' + self.data.userInfo.nickName + '", "avatarUrl": "' + self.data.userInfo.avatarUrl + '" }');
        console.log("订阅失败，错误编码：" + err.code + "错误信息：" + err.content);
      }
    });
  },
  //GoEasy

  sendMessage: function () {
    var self = this;
    var content = self.data.message;
    if (content.trim() != '') {
      //发送消息
      var newMsg = '{ "content": "' + content + '", "date": "' + app.formatDate(new Date()) + '","type":"text", "nickName": "' + self.data.userInfo.nickName + '", "avatarUrl": "' + self.data.userInfo.avatarUrl + '" }';

      pubSub.publish({
        channel: "my_channel",
        message: newMsg,

        onSuccess: function () {
          console.log('message sent: ' + newMsg);
          console.log("send message success");
        },
        onFailed: function (err) {
          self.unshiftMessage('{ "content": "消息发送失败，错误编码"' + err.code + " 错误信息: " + err.content + '", "date": "' + app.formatDate(new Date()) + '","type":"text", "nickName": "' + self.data.userInfo.nickName + '", "avatarUrl": "' + self.data.userInfo.avatarUrl + '" }');
        }
      })
    } else {
      wx.showToast({
        title: '消息不能为空哦~',
        duration: 2000
      })
    }
  },

  unshiftMessage(content) {
    //var message = formattedTime + " " + content;
    var messages = this.data.newslist;
    messages.push(JSON.parse(content));
    this.setData({
      newslist: messages
    })
  },

  //监听input值的改变
  bindChange(res) {
    this.setData({
      message: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
  },
  increase() {
    this.setData({
      increase: true,
      aniStyle: true
    })
  },
  //点击空白隐藏message下选框
  outbtn() {
    this.setData({
      increase: false,
      aniStyle: true
    })
  },
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        wx.uploadFile({
          url: 'http://192.168.137.91/index/index/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: {
            'Content-Type': 'form-data'
          },
          success: function (res) {
            if (res.data) {
              that.setData({
                increase: false
              })
              websocket.send('{"images":"' + res.data + '","date":"' + utils.formatTime(new Date()) + '","type":"image","nickName":"' + this.data.userInfo.nickName + '","avatarUrl":"' + this.data.userInfo.avatarUrl + '"}')
              that.bottom()
            }
          }
        })

      }
    })
  },
  //图片预览
  previewImg(e) {
    var that = this
    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
    var res = e.target.dataset.src
    var list = this.data.previewImgList //页面的图片集合数组

    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
    if (list.indexOf(res) == -1) {
      this.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res, // 当前显示图片的http链接
      urls: that.data.previewImgList // 需要预览的图片http链接列表
    })

  },
  //聊天消息始终显示最底端
  bottom: function () {
    var query = wx.createSelectorQuery()
    query.select('#flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].bottom  // #the-id节点的下边界坐标  
      })
      res[1].scrollTop // 显示区域的竖直滚动位置  
    })
  },
})