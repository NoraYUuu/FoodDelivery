// index.js
// 获取应用实例
const app = getApp()

import { request } from "../../request/index.js";

Page({
  data: {
    // 轮播图数组
    swiperList: [],
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
      
  },

  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/Data/index_banner.json" })
    .then(result => {
      this.setData({
        swiperList: result
      })
    })
  }
  // 获取 分类导航数据
})