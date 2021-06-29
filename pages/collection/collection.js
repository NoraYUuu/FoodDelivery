// pages/collection/collection.js

const db = wx.cloud.database({});
Page({

  /**
   * Page initial data
   */
  data: {
    allCollections: []
  },
  
  getCollections() {
    //1、引用数据库   
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称     
      env: 'cloud1-1gcwirla84b05897'
    })
    //2、开始查询数据了  news对应的是集合的名称 
    db.collection('collections').get({
      //如果查询成功的话    
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        console.log("what")
        this.setData({
          allCollections: res.data
        })
      }
    })
  },

  onPullDownRefresh(){
    this.getCollections();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getCollections();
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
  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})