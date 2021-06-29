// components/Card_Detail/Card_Detail.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    show:false,
    restaurant: '',
    location:'',
    dLocation:'',
    price:'',
    numOfPpl:''
  },

  /**
   * Component methods
   */
  methods: {
    btn: function () {
      this.setData({
        show: true
      })
    },
  
    // 禁止屏幕滚动
    preventTouchMove: function () {
    },
  
    // 弹出层里面的弹窗
    ok: function () {
      this.setData({
        show: false
      })
    }
  
  }
})
