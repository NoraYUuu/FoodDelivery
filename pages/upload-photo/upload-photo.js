// pages/upload-photo/upload-photo.js
Page({

  /**
   * Page initial data
   */
  data: {
    groupId: '',
    openId: '',
    isManager: false,
    paid: false,
    uploaded: ["../../images/features/photo.png", "../../images/features/users.png"]//, "../../images/features/adduser.png"]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  uploadPic: function () {
    var that = this;
    if (this.data.uploaded.length == 3) {
      wx.showToast({
        title: '不能上传超过三张图片哦～',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.cloud.uploadFile({
            cloudPath: 'img/' + new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
            filePath: res.tempFilePaths[0],
            success: function (uploadres) {
              console.log("上传成功", uploadres)
              var photos = that.data.uploaded;
              photos.push(uploadres.fieldID);
              this.setData({
                uploaded: photos
              })
              wx.showLoading({
                title: "图片上传中",
                mask: true,
                success: function () {
                  wx.hideLoading()
                }
              });
            },
            fail: (err) => {
              console.log("上传失败", err)
            }
          })
        },
        fail: (err) => {
          console.log("选择失败", err)
        }
      })
    }


  }
})