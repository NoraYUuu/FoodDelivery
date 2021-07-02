// pages/collection/collection.js

const db = wx.cloud.database({
  //这个是环境ID不是环境名称     
  env: 'cloud1-1gcwirla84b05897'
})
Page({

  /**
   * Page initial data
   */
  data: {
    allCollections: [],
    starred: true,
    show: true
  },
  
  getCollections() {
    //1、引用数据库   
    //2、开始查询数据了  news对应的是集合的名称 
    db.collection('collections').get({
      //如果查询成功的话    
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          allCollections: res.data
        })
        console.log("updated collections")
        console.log(res.data)
      }
    })
    
  },

  showDetail(e){
    // console.log(e.currentTarget)
    // this.setData({
    //   show: false
    // }) //
    var my_id = e.currentTarget.dataset.myid
    // console.log(e.currentTarget)
    wx.setStorageSync('current_card', my_id) //存储当前点击卡片信息 供组件使用
    // console.log(my_id)
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
    this.onLoad()
  },

  handleclose(){
    this.getCollections()
    this.setData({
      starred: true,
      show: false
    })
    this.setShow()
    this.onLoad()
    console.log("closed")
    console.log(this.data.allCollections)
    
  },

  handleunstar(){
    // this.setData({
    //   show: false
    // })
    // this.setShow()
    console.log("unstar")
    console.log("pressing unstar")
    var max_time = 6
    var len = this.data.allCollections.length
    console.log(len)
    while (max_time > 0 && len-1 != this.data.allCollections.length)
    {
      console.log("length:")
      console.log(this.data.allCollections.length)
      this.onLoad()
      max_time -= 1
    }
    // console.log(this.data.allCollections)
    
    
    
  },

  setShow(){
    this.setData({
      show: true
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
    this.getCollections()
    console.log("onLoad")
    this.setData({
      show: true
    })

    // const child = this.selectComponent(".a")
    // console.log(child)
    // child.setData({
    //   show: false
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    // console.log("onready")
    // this.setData({
    //   show:true
    // })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("shown")
    this.getCollections();
    // this.setData({
    //   show: true
    // })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    // this.getCollections();
    // this.selectComponent(".card").setData({
    //   show: false
    // })
    // this.setData({
    //   show: false
    // })
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    // const child = this.selectComponent(".card")
    // child.setData({
    //   show: false
    // })
    // this.setData({
    //   show: false
    // })
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