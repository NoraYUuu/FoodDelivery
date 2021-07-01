// components/Card_Detail/Card_Detail.js
Component({
  /**
   * Component properties
   */
  properties: {
    collected: {
      type: Boolean,
      value:true
    }
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
    // starred:false
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
    unstar: function (){
      try {
        var value = wx.getStorageSync('task')
        if (value) {
          const db = wx.cloud.database()
          db.collection('collections').where({master_id:value._id}).remove({
            success: function(res) {
              console.log(res.data)
            }
          })
          
        }
      } catch (e) {
        console.log(error)
      }
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
              numberOfPeople: value.numberOfPeople,
              location: value.location,
              deadline: value.deadline,
              //in progress: -1, in progress: 0, complete: 1, not completed but expired: 2;
              state: -1,
              joined:[],
              master_id: value._id
            }
          })
        }
      } catch (e) {
        console.log(error)
      }
      
    }
  
  }
})
