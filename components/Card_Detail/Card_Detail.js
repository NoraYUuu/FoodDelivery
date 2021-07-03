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
    contact:'',
    num:'',
    mine: false,
    disabled: true,
    canBeUpdated: true
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
      
    },
    inputDdl(e) {
      const comma = e.detail.value.substring(2,3);
      const hours = parseInt(e.detail.value.substring(0, 2));
      const min = parseInt(e.detail.value.substring(3, 5));
      if (e.detail.value.length==5 && (comma == ":") && hours >= 0 && hours <= 24 && min>=0 && min<=59) {
      this.setData({
        deadline: e.detail.value,
        canBeUpdated: true
      })
    } else {
      console.log(comma)
      console.log(hours)
      console.log(min)
      this.toastMsg("请输入如23:45的时间格式")
      this.setData({
        canBeUpdated: false
      })
    }
    },
    inputPpl(e) {
      if (parseInt(e.detail.value) >= 2 && parseInt(e.detail.value) <= 6) {
      this.setData({
        numOfPpl: e.detail.value
      })
      console.log(this.data.numOfPpl)
    } else {
      this.toastMsg("请输入2-6的整数")
    }
    },
    inputLoc(e){
      this.setData({
        location: e.detail.value
      })
    },
    inputDLoc(e){
      this.setData({
        dLocation:e.detail.value
      })
    },
    bindUpdate() {
      if (this.data.canBeUpdated && this.data.numOfPpl == (this.data.num || '')) {
        this.update(0);
      } else if (this.data.canBeUpdated && parseInt((this.data.numOfPpl.substring(0, 1))) >= 2 && parseInt((this.data.numOfPpl.substring(0, 1))) <= 6 ) {
        this.update(1);
      } else {
      this.toastMsg("update failed")
      }
    },
    toastMsg(msg) {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000,
        mask:true
      })
    },
    update(i){
      var value = wx.getStorageSync('current_card');
      const db = wx.cloud.database();
      if (i == 1) {
        const p = new Promise(resolve => {
          db.collection('tasks').doc(value).update({
            data: {
              numberOfPeople: this.data.numOfPpl,
              deadline: this.data.deadline,
              location: this.data.location,
              dLocation: this.data.dLocation
            },
            success: function(res) {
              resolve(res)
            }
          })
        });
      p.then(res =>   {
        this.triggerEvent("update", this.data.inputValue)
      })
    } else {
        const p = new Promise(resolve => {
          db.collection('tasks').doc(value).update({
            data: {
              deadline: this.data.deadline,
              location: this.data.location,
              dLocation: this.data.dLocation
            },
            success: function(res) {
              resolve(res)
            }
          })
        });
      p.then(res =>  {
        this.triggerEvent("update", this.data.inputValue)
      })
    }
    },
    bindDelete(e){
      var value = wx.getStorageSync('current_card');
        const db = wx.cloud.database();
        const p = new Promise(resolve => {
            db.collection('tasks').doc(value).remove({
              success(res) {
                resolve(res);
                console.log("deleted");
              }
            })});
        p.then(res => {this.triggerEvent("delete", this.data.inputValue)})
  },
}
})


