// pages/chat/chat.js
/* var websocket = require('../../utils/websocket.js');
var utils = require('../../utils/util.js'); */

const app = getApp()
// 获取数据库
const DB = wx.cloud.database().collection("messages"); // 

Page({
  // 删除消息
  remove_msg(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id
    DB.doc(id).remove({
      success(res) {
        console.log("删除成功", res)
        _this.onLoad()
      }
    })
  },

  // 修改数据函数模板
  /* xiugai() {
    DB.doc(id).update({
      data: {
        name: '小明',
        age: 12
      },
      success(res) {
        console.log(res)
      }
    })
  }, */
  /**
   * 页面的初始数据
   */
  data: {
    isTabs: '',
    isOn: false,
    scrollTop: 0,
    //isIphoneX: '',
    //into: '',
    Height: '',
    info: {}, //自己的openid
    user_value: '',
    info_list: [],
    groupId: '',
    emoji_list: [{
      name: '[微笑]',
      imgSrc: '../../images/emoji/1.png'
    }, {
      name: '[大哭]',
      imgSrc: '../../images/emoji/2.png'
    }, {
      name: '[开心]',
      imgSrc: '../../images/emoji/3.png'
    }, {
      name: '[可爱]',
      imgSrc: '../../images/emoji/4.png'
    }, {
      name: '[面无表情]',
      imgSrc: '../../images/emoji/5.png'
    }, {
      name: '[难过]',
      imgSrc: '../../images/emoji/6.png'
    }, {
      name: '[蛇]',
      imgSrc: '../../images/emoji/7.png'
    }, {
      name: '[狐狸]',
      imgSrc: '../../images/emoji/8.png'
    }, {
      name: '[老虎]',
      imgSrc: '../../images/emoji/9.png'
    }, {
      name: '[蜜蜂]',
      imgSrc: '../../images/emoji/10.png'
    }, {
      name: '[狮子]',
      imgSrc: '../../images/emoji/11.png'
    }, {
      name: '[长颈鹿]',
      imgSrc: '../../images/emoji/12.png'
    }, {
      name: '[树叶]',
      imgSrc: '../../images/emoji/13.png'
    }, {
      name: '[植物]',
      imgSrc: '../../images/emoji/14.png'
    },]
  },
  // 输入事件
  input_value(e) {
    //console.log(e.detail.value);
    this.setData({
      user_value: e.detail.value
    })
  },
  // 发送事件
  sned111() {
    var _this = this;
    if (!this.data.user_value) {
      return false;
    }
    // 拿缓存数据
    var userInfo = wx.getStorageSync('userinfo');
    console.log(userInfo);
    DB.add({
      data: {
        avatarUrl: userInfo.avatarUrl, //头像
        nickName: userInfo.nickName, //昵称
        value: _this.data.user_value, //消息内容
        groupid: _this.data.groupId
      },
      success(res) {
        console.log(res)
        _this.setData({
          user_value: ''
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //var info = wx.getStorageSync('userinfo');
    var _info = wx.getStorageSync('info'); //store openId
    //console.log(_info);
    _this.setData({
      info: _info,
      groupId: options.groupId
    })
    //console.log(this.data.groupId);
    const query = wx.createSelectorQuery()
    query.select('.page2').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        Height: res[1].scrollHeight,
        //info: _info
      })

    })
    //console.log(_this.data.info);

    //适配iPhoneX
    /* let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    }) */
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    DB.watch({
      onChange: (res) => {
        //遍历res.docs来找到所有当下groupid的消息
        //console.log(res.docs)
        let allMsg = res.docs;
        let groupid = _this.data.groupId
        let list = []
        for (var i = 0, len = allMsg.length; i < len; i++) {
          if (allMsg[i].groupid == groupid) {
            list.push(allMsg[i])
          }
        }
        _this.setData({
          info_list: list,
          //into: res.docs[res.docs.length - 1]._id
        })
      },
      onError(err) {
        console.log("失败")
      }
    })
  },


  // 发送表情包
  sendEmoji(e) {
    console.log(e);
    var src = e.currentTarget.dataset.src;
    var _this = this;
    // 拿缓存数据
    var userInfo = wx.getStorageSync('userinfo');
    DB.add({
      data: {
        avatarUrl: userInfo.avatarUrl, //头像
        nickName: userInfo.nickName, //昵称
        emoji: src, //消息内容
        groupid: _this.data.groupId
      },
      success(res) {

      }
    })

  },
  // 关闭所有tab框
  offEmoji() {
    if (this.data.isOn == true) {
      this.setData({
        isOn: false,
        Height: this.data.Height + 130
      })
      this.onReady()
    }
  },



  // 点击表情包区域
  onEmoji() {
    if (this.data.isOn == false) {
      this.setData({
        isTabs: 'emoji',
        isOn: true,
        Height: this.data.Height - 130
      })
      this.onReady()
    } else if (this.data.isOn) {
      if (this.data.isTabs == "features") {
        this.setData({
          isTabs: 'emoji',
        })
        this.onReady()
      } else {
        this.setData({
          isOn: false,
          Height: this.data.Height + 130
        })
        this.onReady()
      }
    }

  },

  // 打开+号功能框
  onFeatures() {
    if (this.data.isOn == false) {
      this.setData({
        isTabs: "features",
        isOn: true,
        Height: this.data.Height - 130
      })
      this.onReady()

    } else if (this.data.isOn) {
      if (this.data.isTabs == 'emoji') {
        this.setData({
          isTabs: 'features',
        })
        this.onReady()
      } else {
        this.setData({
          isOn: false,
          Height: this.data.Height + 130
        })
        this.onReady()
      }

    }
  },

  // 查看用户
  toAddUser() {
    wx.navigateTo({
      url: '../userList/index',
    })
  }

})