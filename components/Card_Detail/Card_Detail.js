// components/Card_Detail/Card_Detail.js
Component({
  /**
   * Component properties
   */
  properties: {
    collected: {
      type: Boolean,
      value:true
    },
    pos: {
      type: String,
      value: 'index'
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
      this.triggerEvent("close")
    },

    unstar: function (){
      if (this.data.pos=='index') {
        var value = wx.getStorageSync('task')
        console.log(this.data.pos)
        const db = wx.cloud.database()
        db.collection('collections').where({master_id:value._id}).remove({
          success: function(res) {
            // console.log(value._id)
            console.log('deleted')
            console.log(res.data)
          }
        })

        this.setData({
          collected: false
        })
        wx.setStorageSync('collected', false)
        
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none',
          duration: 1000,
          mask:true
        })
        this.triggerEvent("unstar")
    
      }
      else {
        var value = wx.getStorageSync('current_card') //获取当前点击卡片 
        console.log(this.data.pos)
        const db = wx.cloud.database()
        db.collection('collections').doc(value).remove({
          success: function(res) {
            // console.log(value._id)
            console.log('deleted')
            console.log(res.data)
          }
        }),
        this.setData({
          collected: false
        })
        
        wx.setStorageSync('collected', false)
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none',
          duration: 1000,
          mask:true
        })
        this.triggerEvent("unstar")
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
              image: value.image,
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
        this.triggerEvent("click")
        this.setData({
          collected: true
        })
        wx.setStorageSync('collected', true)
      } catch (e) {
        console.log(error)
      }
      
    }
  
  }
})
