// index.js
// 获取应用实例
const app = getApp()

import { request } from "../../request/index.js";
const db = wx.cloud.database({});

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    allTask: [],
    starred: false,
    totalTasks:'',
    change: 0,
    sticky: false
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    let that = this;
    // // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    // wx.request({
    //   url: 'https://haoyusimon.github.io/Data/index_banner.json',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList()
    // this.getCateList();
    // this.getFloorList();
    this.getTask()
    db.collection('tasks').where({
      state:-1
    }).watch({
      onChange: function (snapshot) {
        //监控数据发生变化时触发
        const changes = that.checkUpdate(snapshot.docChanges);
        that.setData({
          change: changes + that.data.change
        })      
      },
      onError:(err) => {
        console.error(err)
      }
    })
    
  },

  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/Data/index_banner.json" })
    .then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取 分类导航数据
getTask() {
  //1、引用数据库   
  var that = this;
  that.setData({
    change: 0
  })

  that.getListCount().then(res => {
    let count = res;
    let list = [];
    // that.setData({
    //   allTask:[]
    // });
    // let i = 0;
    // while (i > count) {
    //     that.getListIndexSkip(i).then(res2 => {
    //       //dunno y the data is not set properly
    //       list = list.reverse().concat(res2.data).reverse()
    //       // console.log(list.length)
    //       // console.log(count)
    //       if (list.length == count) {
    //       that.setData({
    //           allTask: list
    //         })
    //         console.log("all tasks")
    //         console.log(this.data.allTask)    
    //       } else {
    //       }
    //       i += 20;
    //       }).catch(e => {
    //         console.error(e)
    //         i+=20;
    //         reject("查询失败")
    //       }).finally(f => {
    //         i+=20
    //       })
    //       // i+=20
    //   }
    this.recGetList(0, count).then(res => {
      list = res
      that.setData({
        allTask: []
      })
      that.setData({
        allTask: list.reverse()
      })
      that.selectComponent(".myCard").setData({
        mine: false
      })
    });
    

    }).catch(e => {
      console.log(e);
      reject("failed")
    }).catch(e => {})
  
  
  //2、开始查询数据了  news对应的是集合的名称   
},
onPullDownRefresh(){
  this.getTask();
  setTimeout(() => wx.stopPullDownRefresh({
    success: (res) => {},
  }), 500)
},

showDetail(e){
  var my_id = e.currentTarget.dataset.myid
  wx.setStorageSync('current_card', my_id)
  var user_id = wx.getStorageSync('userinfo')
  db.collection('user_info').where({_openid: user_id.openid}).get({
    success: res => {
      var userdata = res.data.pop()
      const collections = userdata.taskid
      const included = collections.includes(my_id)
      if (included) {
        console.log('res')
        this.setData({
          starred: true
        })
      }
      else {
        this.setData({
          starred: false
        })
      }
    },
    fail: res => {
      console.log(res)
    }
  })
  db.collection('tasks').doc(my_id).get({
    success: function(res) {
      // res.data 包含该记录的数据
      
      const openID = wx.getStorageSync('info').openid;
      const task = res.data;
      const mine = task.manager == openID;
      console.log("mine")
      console.log(mine)
      const onlyMe = mine && (task.joined.length == 1);
      const included = task.joined.includes(openID);
      wx.setStorageSync('current_joined', task.joined);

      child.setData({
        peopleJoined:task.joined.length ,
        totalNeeded:task.numberOfPeople,
        fromIndex: true,
        show: true,
        included: included,
        mine: mine,
        onlyMe: onlyMe,
        location: task.location,
        dLocation: task.dLocation,
        deadline: task.deadline,
        numOfPpl: task.joined.length + '/' + task.numberOfPeople,
        price: ((task.price[0] + task.price[1] * 0.1 + task.price[2]*0.01)/task.numberOfPeople).toFixed(2),
        restaurant: task.restaurant,
        publishId: task._id
      })
  
      wx.setStorageSync('task', task)
    },
    fail(e) {
      console.log(e)
    }

    
  })
  const child = this.selectComponent(".popWindow")
  // console.log(this.data.starred)
},

handleclick(){
  // const currentTask = wx.getStorageSync('task')
  // const child = this.selectComponent(".popWindow")
  // child.setData({
  //   show: true,
  //   location: currentTask.location,
  //   dLocation: currentTask.dLocation,
  //   deadline: currentTask.deadline,
  //   numOfPpl: currentTask.joined.length + 1 + '/' + currentTask.numberOfPeople,
  //   price: ((currentTask.price[0] + currentTask.price[1] * 0.1 + currentTask.price[2]*0.01)/currentTask.numberOfPeople).toFixed(2),
  //   restaurant: currentTask.restaurant
  // })
 
},
onShow() {
  // this.getTask()
},

/**
 * Lifecycle function--Called when page unload
 */
onUnload: function () {
  this.getTask()
},
getListCount() {
  return new Promise((resolve, reject) => {
    db.collection('tasks').count().then(res => {
      resolve(res.total)
      this.setData({
        totalTasks: res.total
      })
    }).catch(e => {
      console.log(e)
      reject("查询失败")
    })
  })
},

recGetList(skip, count){
  let selectPromise;
  if (skip == 0) {
    let list = [];
    selectPromise = new Promise((resolve, reject) => {this.recGetList(20, count).then(res => {
      db.collection('tasks').get().then(res2 => {
        list = res2.data.concat(res);
        resolve(list)
      }).catch(res => {
        reject(res);
      })
    }).catch (res => {
      reject(res)
    })
  })

  return selectPromise;
  } else if (count - skip <= 20) {
    let list = [];
    selectPromise = new Promise((resolve, reject) => {db.collection('tasks').skip(skip).get().then(res => {
      list = res.data;
      resolve(list);
    }).catch(res => {
      reject(res)
    })});

    return selectPromise;
  } else {
    let list = [];
    selectPromise = new Promise((resolve, reject) => {this.recGetList(skip + 20, count).then(res => {
      db.collection('tasks').skip(skip).get().then(res2 => {
        list = res2.data.concat(res);
        resolve(list)
      }).catch(res => {
        reject(res);
      })
    }).catch (res => {
      reject(res)
    })
  });
    return selectPromise;
  }
},
   // 获取滚动条当前位置
   onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true,
      });
     
    } else {
      this.setData({
        floorstatus: false
      });
    }
    const query = wx.createSelectorQuery().in(this);
    query.select('.alertChange').boundingClientRect();
    query.selectViewport().scrollOffset();
    const that = this;
    query.exec(function (res) {
      // console.log(res[0])
      if (res[0].top <= 0) {
        that.setData({
          sticky: true
        })
      } 
      if (res[1].scrollTop < 188) {
        that.setData({
          sticky: false
        })
      }
    })
  },
  goTop: function (e) {  
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.getTask();
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  checkUpdate(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i+=1) {
      if (arr[i].dataType == "remove" || arr[i].dataType == "add") {
        total +=1;
      }
    }
    return total;
  }


// getListIndexSkip(skip) {
//   return new Promise((resolve, reject) => {
//     let selectPromise;	
//     if (skip > 0) {
//       selectPromise = db.collection('tasks').skip(skip).get()
//     } else {
//       //skip值为0时，会报错
//       selectPromise = db.collection('tasks').get()
//     }
//     selectPromise.then(res => {
//       resolve(res);
//     }).catch(e => {
//       console.error(e)
//       reject("查询失败!")
//     })
//   })
// }
})