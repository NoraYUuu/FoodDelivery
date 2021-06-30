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
    deadline:'',
    location:'',
    dLocation:'',
    price:'',
    numOfPpl:'',
    contact:''
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
    },

    star: function () {

      // console.log(this.restaurant)
      try {
        var value = wx.getStorageSync('task')
        if (value) {
          console.log(value)
          const db = wx.cloud.database()
          db.collection('collections').add({
          data:{
            restaurant: value.restaurant,
            dLocation: value.dLocation,
            price: value.price,
            contact: value.contact,
            numberOfPeople: value.numOfPpl,
            location: value.location,
            deadline: value.deadline,
            //in progress: -1, in progress: 0, complete: 1, not completed but expired: 2;
            state: -1,
            joined:[]
          }
      })
        }
      } catch (e) {
        console.log(error)
      }
      
    }
  
  }
})
