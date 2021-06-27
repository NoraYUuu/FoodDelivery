// index.js
// 获取应用实例
const app = getApp()

import { request } from "../../request/index.js";
const db = wx.cloud.database({});
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    allTask: []
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
    
    this.getSwiperList();
    // this.getCateList();
    // this.getFloorList();
    this.getTask();
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
  const db = wx.cloud.database({
    //这个是环境ID不是环境名称     
    env: 'cloud1-1gcwirla84b05897'
  })
  //2、开始查询数据了  news对应的是集合的名称   
  db.collection('tasks').get({
    //如果查询成功的话    
    success: res => {
      //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
      this.setData({
        allTask: res.data
      })
    }
  })
},
onPullDownRefresh(){
  this.getTask();
}
})