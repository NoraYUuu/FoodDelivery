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
    totalTasks:''
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
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
  
  const db = wx.cloud.database({
    //这个是环境ID不是环境名称     
    env: 'cloud1-1gcwirla84b05897'
  })

  that.getListCount().then(res => {
    let count = res;
    that.setData({
      allTask:[]
    })
    for (let i = 0; i < count ; i += 20) {
        that.getListIndexSkip(i).then(res2 => {
          //dunno y the data is not set properly
          if (that.data.allTask.length < count-1) {
          that.setData({
              allTask: that.data.allTask.reverse().concat(res2.data).reverse()
            })
            console.log(that.data.allTask.length)
            
          } else {

          }
          }).catch(e => {
            console.error(e)
            reject("查询失败")
          })
          
      }
      console.log(that.data.allTaskStored)

    }).catch(e => {
      reject("failed")

    })
  
  
  //2、开始查询数据了  news对应的是集合的名称   
},
onPullDownRefresh(){
  this.getTask();
},

showDetail(e){
  var my_id = e.currentTarget.dataset.myid
  wx.setStorageSync('current_card', my_id)
  db.collection('collections').where({master_id: my_id}).get({
    success: res => {
      console.log(res.data.length)
      if (res.data.length != 0) {
        // console.log('exists')
        this.setData({
          starred: true
        })
      }
      else {
        this.setData({
          starred: false
        })
      }
    }
  })

  db.collection('tasks').doc(my_id).get({
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
  
      wx.setStorageSync('task', task)
    }

    
  })
  const child = this.selectComponent(".popWindow")
  // console.log(this.data.starred)
},

handleclick(){
  console.log("clicked")
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
  this.getTask()
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
getListIndexSkip(skip) {
  return new Promise((resolve, reject) => {
    let selectPromise;	
    if (skip > 0) {
      selectPromise = db.collection('tasks').skip(skip).get()
    } else {
      //skip值为0时，会报错
      selectPromise = db.collection('tasks').get()
    }
    selectPromise.then(res => {
      resolve(res);
    }).catch(e => {
      console.error(e)
      reject("查询失败!")
    })
  })
}
})