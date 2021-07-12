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
    alljoined:[],
    myPublish:[],
    starred: true,
    show: true,
    selected: 0,
    list: ['我发布的','我加入的','我的收藏', '推荐拼团'],
    openid:'',
    len:0,
    totalPublish:0
  },

  getCollections() {
    //1、引用数据库   
    //2、开始查询数据了  news对应的是集合的名称 
   
    // db.collection('collections').get({
    //   success: res => {
    //     console.log(res)
    //     this.setData({
    //       allCollections: res.data
    //     })
    //   }
    // })
    this.getOpenid()
    let that = this;

    db.collection('user_info').where({_openid: this.data.openid}).get({
      success: async res=>{
        const userdata = res.data.pop()
        let collections = userdata.taskid
        let copy = userdata.taskid.slice()
        console.log(copy)
        let display_col = []
        let ele = []
        let skip = false
        let new_col = []
        // var loop = 0
        while(collections.length > 0){
          // console.log('element is ' + collections[i])
          const element = collections.pop()
          console.log(collections)
          // console.log(copy)
          const p = new Promise((resolve, reject) => {
            db.collection('tasks').doc(element).get({
              success: res => {
                // console.log(res.data)
                resolve(res)
              },
              fail(res) { 
                reject(res)
              }
            })
          })
          console.log('processing')
          display_col.push(p)
          ele.push(element)
        }
        // await display_col[display_col.length-1]
        // display_col = display_col.slice(1)
        // console.log(display_col)
        let resolved_list = []
        while(display_col.length > 0) {
          await display_col[0].then(
            value => {
              console.log('added')
              // console.log(value.data)
              resolved_list.push(value.data)
              console.log(resolved_list)
            },
            reason=>{
              console.log('deleted')
              copy = copy.filter(item => item!= ele[0])
              console.log(copy)
              
            }
          )
          
          ele = ele.slice(1)
          display_col = display_col.slice(1)
          if (display_col.length == 0) {
                
            db.collection('user_info').where({_openid: that.data.openid}).update({
              data: {
                taskid: copy
              },
              success(res) {
                console.log(res)
              },
              fail(res) {
                console.log(res)
              }
            })
          }
        }
        // console.log(resolved_list)
        this.setData({
          allCollections: resolved_list
        })

      },
      fail: res => {
        console.log(res)
      }
    })
    // set mypublish
    let published = []
    Promise.all(this.getList()).then(value => {
      for (let i =  9; i >=0; i-=1) {
      published = published.concat(value[i].reverse())
    }
    that.setData({
      myPublish: published
    })

    })

    db.collection('user_info').where({_openid: this.data.openid}).get({
      success: async res=>{
        const userdata = res.data.pop()
        let collections = userdata.groupid //我加入的
        //console.log(collections)
        let copy = userdata.groupid.slice()
        //console.log(copy)
        let display_col = []
        let ele = []
        let skip = false
        let new_col = []
        // var loop = 0
        while(collections.length > 0){
          // console.log('element is ' + collections[i])
          const element = collections.pop()
          //console.log(collections)
          // console.log(copy)
          const p = new Promise((resolve, reject) => {
            db.collection('tasks').doc(element).get({
              success: res => {
                // console.log(res.data)
                resolve(res)
              },
              fail(res) { 
                reject(res)
              }
            })
          })
         // console.log('processing')
          display_col.push(p)
          ele.push(element)
        }
        // await display_col[display_col.length-1]
        //console.log("received")
        //console.log(display_col)
        // display_col = display_col.slice(1)
        // console.log(display_col)
        let resolved_list = []
        while(display_col.length > 0) {
          await display_col[0].then(
            value => {
              // console.log('added')
              // console.log(value.data)

              if ((value.data.joined.length == parseInt(value.data.numberOfPeople)) || (
                value.data.joined.length>1 && value.data.numberOfPeople == "All"
              )) {
                resolved_list.reverse();
                resolved_list.push(value.data);
                resolved_list.reverse();
    
              } else {
                resolved_list.push(value.data);
              }
              //console.log(resolved_list)
            },
            reason=>{
              //console.log('deleted')
              copy = copy.filter(item => item!= ele[0])
              //console.log(copy)
            }
          )
          
          ele = ele.slice(1)
          display_col = display_col.slice(1)
          if (display_col.length == 0) {
                
            db.collection('user_info').where({_openid: that.data.openid}).update({
              data: {
                groupid: copy
              },
              success(res) {
                console.log(res)
              },
              fail(res) {
                console.log(res)
              }
            })
          }
        }
        // console.log(resolved_list[0])
        let myPublish_id = this.data.myPublish.slice().map(item => item._id)
        // console.log(myPublish_id)

        resolved_list = resolved_list.filter(item => {
          const thisTask = this.data.myPublish[myPublish_id.indexOf(item._id)];
          var full;
          if (thisTask!=undefined){
           full = (thisTask.joined.length == parseInt(thisTask.numberOfPeople)) || (thisTask.numberOfPeople == "All" && thisTask.joined.length>1);
          }
          return (myPublish_id.includes(item._id) == false) || full;
      })
        // console.log(resolved_list)
        this.setData({
          alljoined: resolved_list
        })

      },
      fail: res => {
        console.log(res)
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
    const id = this.data.openid;
    db.collection('tasks').doc(my_id).get({
      success: function(res) {
        // res.data 包含该记录的数据
        const task = res.data
  //todo : included 检测自己是否加入了拼团
  //onlyMe: 团里只有我一个人
  //fromIndex: 判断点击是否来自于主页（就算只有自己一个人在拼团里，只有在我发布的页面可以更新删除，index点击进去只可以查阅；如果不是自己的拼团，index点击进去可以加入拼团和收藏）
  // mine: 是否是我发布的
  //disabled: 是不是不让编辑（更新）， 只要不在我发布的 页面就不可以更新
  //显示按钮的逻辑：主页：判断加入拼团/收藏拼团；如果是自己发布的，不可以收藏和加入
  //如果是自己发布的，且没有其他人加入，只可以查阅；如果自己发布的且有人加入，可以选择退出拼团，此时团长成为array第一个人
  //collection中我发布的：如果只有我一个人，有更新和删除按钮；如果有其他人加入，只可以退出拼团
  //我的收藏：（理论上不可以收藏自己发布的拼团），可以选择取消收藏/加入和退出拼团
        child.setData({
          onlyMe: false,
          included: false,
          fromIndex: false,
          mine: false,
          disabled: true,
          show: true,
          location: task.location,
          dLocation: task.dLocation,
          deadline: task.deadline,
          numOfPpl: task.joined.length + '/' + task.numberOfPeople,
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
  },

  handleunstar(){
    const my_id = wx.getStorageSync('current_card')
    const index=this.data.allCollections.map(a=>a._id).indexOf(my_id)
    // console.log("index is " + index)
    var oldcollection = this.data.allCollections
    // console.log("old collection")
    // console.log(oldcollection)
    oldcollection.splice(index,1)
    // console.log("new collection is")
    // var array = [1,2,3]
    // console.log(array.splice(0,1))
    this.setData({
      allCollections: oldcollection
    })

   

  },

  setShow(){
    this.setData({
      show: true
    })
    // console.log("now set")
    // console.log(this.data.myPublish)
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
    // console.log("shown")
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
    // console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    // console.log(index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else {
      if (index == 1) {
        that.setData({
          selected: 1
        })
      } else {
        if (index == 2) {
          that.setData({
            selected: 2
          })
        } else {
          that.setData({
            selected: 3
          })
        }
      }
    }
  },
  getOpenid: function() { 
   this.setData({
     openid: wx.getStorageSync('info').openid
   })
  },
   childDetail(e){
     let that = this;
      let childd = this.selectComponent(".popWindow");
       var my_id = e.currentTarget.dataset.myid
       console.log(my_id)
      const openID = wx.getStorageSync('info').openid;
    
      //  wx.setStorageSync('current_card', my_id) //存储当前点击卡片信息 供组件使用
       db.collection('tasks').doc(my_id).get({
         success: function(res) {
          const task = res.data;
          const mine = task._openid == openID;
          const onlyMe = mine && (task.joined.length == 1);
          const included = task.joined.includes(openID);
          //console.log(included)
          wx.setStorageSync('current_joined', task.joined);
          // res.data 包含该记录的数据
           const check = (task.joined.length > 1) || (!mine);
          childd.setData({
            included: included,
            peopleJoined:task.joined.length ,
            totalNeeded:task.numberOfPeople,
            fromIndex: false,
            show: true,
            mine: mine,
            onlyMe: onlyMe,
            disabled: check,
            location: task.location,
            dLocation: task.dLocation,
            deadline: task.deadline,
            numOfPpl: task.joined.length + '/' + task.numberOfPeople,
            num: task.numberOfPeople,
            price: ((task.price[0] + task.price[1] * 0.1 + task.price[2]*0.01)/task.numberOfPeople).toFixed(2),
            restaurant: task.restaurant,
            publishId:task._id
          })
        },
        fail(e) {
          console.log(e)
        }
       })
    },
    updateReload(){
      const that = this;
      let published = [];
    Promise.all(this.getList()).then(value => {
      for (let i = 9; i >=0; i-=1) {
      published = published.concat(value[i].reverse())
    }
    that.setData({
      myPublish: published,
      show: false
    })
    that.selectComponent('.popWindow').setData({
      show: false
    })
    that.onLoad()
    that.setShow() 

    })

    },
    createNew(e){
      this.selectComponent(".newCollection").setData({
        show: true
      })
    },
    getList() {
      let totalP = [];
      for (let i = 0; i < 10; i+=1){
        const p = new Promise((resolve, reject) => {
        db.collection('tasks').where({
          _openid: this.data.openid
        }).skip(i * 20).get({
        }).then(res => {
          //console.log(res)
          resolve(res.data)
          // this.setData({
          //   totalPublish: res.total
          // })
        }).catch(e => {
          resolve([])
        })
      })
      totalP.push(p)
    }
    return totalP;
    },
})