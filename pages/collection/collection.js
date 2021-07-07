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
    list: ['我发布的', '我的收藏', '推荐拼团'],
    openid:'',
    len:0
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
      success: res=>{
        const userdata = res.data.pop()
        const collections = userdata.taskid
        let newCol = collections;
        var display_col = []
        var i = 0;
        let final=[];
        let newCollectionId=[];
        that.recGetCol(0, collections).then(res => 
          { for (let j = 0; j < res.length; j+=1) {
                  const pos = newCol.indexOf(res[j].data._id)
                  final[pos] = res[j].data
                  console.log(final[pos])
                  newCollectionId[pos] = res[j].data._id
                }
                console.log(final)
                final.filter(e => e != undefined)
                newCollectionId.filter(e => e != undefined)
                that.setData({
                  allCollections: final
                })
                db.collection('user_info').where({_openid: that.data.openid}).update({
                      data: {
                        taskid: newCollectionId
                      },
                      success(res) {
                        console.log(res)
                      },
                      fail(res) {
                        console.log(res)
                      }
                    })
              })
    //   let final = [];
    //   (async () => {
    //     const p = await pro;
    //     console.log("hello")
    //     console.log(p);
    //     for (let j = 0; j < display_col.length; j+=1) {
    //       const pos = newCol.indexOf(display_col[i].data._id)
    //       final[pos] = display_col[j]
    //     }
    //     final.filter(Boolean)
    //     console.log(final)
    // })();

 
        
      //   if (proceed) {
      //   db.collection('user_info').where({_openid: that.data.openid}).update({
      //     data: {
      //       taskid: collections
      //     },
      //     success(res) {
      //       console.log(res)
      //     },
      //     fail(res) {
      //       console.log(res)
      //     }
      //   })
      // }
        // console.log(display_col)
        // console.log(ele)
        // var col_data = []
        // Promise.all(display_col).then((values) => {
        //   // console.log(values)
        //   for (let i = 0; i < display_col.length; i++){
        //     col_data.push(values[i].data)
        //   }
        //   this.setData({
        //     allCollections: col_data
        //   })
        // }). catch (res => console.log(res))
      
      }
    })




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
        that.setData({
          selected: 2
        })
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

      db.collection('tasks').where({
        _openid: this.data.openid
      }).get({
      }).then(res => {
  
      (async () => {
        let p = await new Promise((resolve) => {
          this.setData({
            myPublish: res.data,
            show: false
          })
          resolve(this.setData({
            myPublish: res.data,
            show: false
          }))
        });
        this.selectComponent('.popWindow').setData({
          show: false
        })
        this.onLoad()
        this.setShow() 
    })();
    //   p.then(res => {
    //     this.selectComponent('.popWindow').setData({
    //       show: false
    //     })
    //     this.onLoad()
    //     this.setShow() 
    //   })
    })

    },
    createNew(e){
      this.selectComponent(".newCollection").setData({
        show: true
      })
    },
    recGetCol(pos, collections) {
      if (pos == collections.length - 1) {
        const p = new Promise((resolve, reject) => 
        db.collection('tasks').doc(collections[pos]).get({
          success: res => {
            const arr = [];
            arr.push(res)
            resolve(arr)
          },
          fail(res) {
            resolve([])
            console.log(res)
          }
        })
      )
      return p;
      } else {
      const p = new Promise((resolve, reject) => 
      this.recGetCol(pos + 1, collections).then (res2 => {
        db.collection('tasks').doc(collections[pos]).get({
          success: res => {
            res2.push(res)
            console.log("he")
            resolve(res2)
          },
          fail(res) {
            resolve(res2)
            console.log(res)
          }
        })
      })
      )
      return p;
    }
  }
})