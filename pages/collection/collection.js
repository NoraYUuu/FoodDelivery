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
    myPublish:[],
    starred: true,
    show: true,
    selected: 0,
    list: ['我发布的', '我的收藏'],
    openid:'oD-hi5UYfoqVSFfiyQhlwiQu6p0Y',
    len:0
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
    });
    this.getOpenid();
 
    db.collection('tasks').where({
      _openid: this.data.openid
    }).get({
      //如果查询成功的话    
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          myPublish: res.data
        })
      
      }
    })
    
  },

  showDetail(e){
   
    // console.log(this.allCollections.indexOf(e.currentTarget.dataset))
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
    // console.log("unstar")
    // console.log("pressing unstar")
    // var max_time = 6
    // var len = this.data.allCollections.length
    // console.log(len)
    const my_id = wx.getStorageSync('current_card')
    const index=this.data.allCollections.map(a=>a._id).indexOf(my_id)
    // console.log("index is " + index)
    var oldcollection = this.data.allCollections
    // console.log("old collection")
    // console.log(oldcollection)
    oldcollection.splice(index,1)
    // console.log("new collection is")
    console.log(oldcollection)
    // var array = [1,2,3]
    // console.log(array.splice(0,1))
    this.setData({
      allCollections: oldcollection
    })
    // while (max_time > 0 && len-1 != this.data.allCollections.length)
    // {
    //   console.log("length:")
    //   console.log(this.data.allCollections.length)
    //   this.setData({
    //     len: this.data.allCollections.length
    //   })
    //   this.onLoad()
    //   max_time -= 1
    // }
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
        url: 'https://norayuuu.github.io',     
        data: {appid: 'wx95bf8e473873b65d', 
        secret: '05e4eefc3c4f9601b0f6c44558b70300', code: res.code},     
        success: function(response) { 
        
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