// pages/collection/collection.js

const db = wx.cloud.database({});
Page({

  /**
   * Page initial data
   */
  data: {
    allCollections: [],
    myPublish:[],
    starred: true,
    show: false,
    selected: 0,
    list: ['我发布的', '我的收藏'],
    openid:''
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
        this.setData({
          allCollections: res.data
        })
      }
    });
    this.getOpenid();
    console.log(this.data.openid)
    console.log('here')
    db.collection('tasks').where({
      _openid: this.data.openid
    }).get({
      //如果查询成功的话    
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          myPublish: res.data
        })
        console.log(this.data.myPublish)
      }
    })
    
  },

  showDetail(e){
    console.log(e.currentTarget)
    var my_id = e.currentTarget.dataset.myid
    wx.setStorageSync('current_card', my_id)
    console.log(my_id)
    db.collection('collections').doc(my_id).get({
      success: function(res) {
        // res.data 包含该记录的数据
        const task = res.data
        child.setData({
          show: true,
          location: task.location,
          dLocation: task.dLocation,
          deadline: task.deadline,
          numOfPpl: task.joined.length + 1 + '/' + task.numberOfPeople,
          price: ((task.price[0] + task.price[1] * 0.1 + task.price[2]*0.01)/task.numberOfPeople).toFixed(2),
          restaurant: task.restaurant
        })
        // console.log(task)
      }
  
      
    })
    
    const child = this.selectComponent(".popWindow")
    // console.log(this.data.starred)
    
   
  
  
    
  },
  onPullDownRefresh(){
    this.getCollections()
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
    this.getCollections()
    this.setData({
      show: true
    })
    var that = this;
    /** 
     * 获取系统信息,系统宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    this.getCollections();
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.getCollections();
    this.setData({
      show: true
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    this.getCollections();
    // this.selectComponent(".card").setData({
    //   show: false
    // })
    this.setData({
      show: false
    })
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    // const child = this.selectComponent(".card")
    // child.setData({
    //   show: false
    // })
    this.setData({
      show: false
    })
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

  },
  selected: function (e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else {
      that.setData({
        selected: 1
      })
    }
  },
  getOpenid: function() { 
    let that = this;  
    wx.login({success: function(res) { 
      wx.request({     
        url: 'https://norayuuu.github.io/',     
        data: {appid: 'wx95bf8e473873b65d', 
        secret: '05e4eefc3c4f9601b0f6c44558b70300', code: res.code},     
        success: function(response) { 
          console.log(response.data)
          var openid = response.data.openid;      
          console.log('请求获取openid:' + openid);      //可以把openid存到本地，方便以后调用
          wx.setStorageSync('openid', openid);
          that.setData({       
            openid: openid
        })
       },
       fail(response) {
         console.log(response)
       } 
      })
     }
    })
   }
})