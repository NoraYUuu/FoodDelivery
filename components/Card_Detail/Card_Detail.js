// components/Card_Detail/Card_Detail.js
const db = wx.cloud.database();
Component({
  /**
   * Component properties
   */
  properties: {
    collected: {
      type: Boolean,
      value: true
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
    show: false,
    totalNeeded: '',
    restaurant: '',
    deadline: '',
    location: '',
    dLocation: '',
    price: '',
    numOfPpl: '',
    contact: '',
    fromIndex: '',
    num: '',
    mine: false,
    disabled: true,
    onlyMe: false,
    canBeUpdated: true,
    publishId: '',
    peopleJoined: '',
    included: false
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

    unstar: function () {
      var value = wx.getStorageSync('info')
      var cur_task = wx.getStorageSync('current_card')
      db.collection('user_info').where({ _openid: value.openid }).get({
        success: res => {
          const collections = res.data[0].taskid
          console.log(collections)
          const new_col = collections.filter(task => task != cur_task)
          console.log(new_col)
          db.collection('user_info').where({ _openid: value.openid }).update({
            data: {
              taskid: new_col
            }
          })
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
        mask: true
      })
      this.triggerEvent("unstar")

    },

    star: function () {
      // console.log(this.restaurant)
      try {
        var value = wx.getStorageSync('task')
        var my_id = wx.getStorageSync('info').openid
        if (value) {
          console.log(value)
          const db = wx.cloud.database()
          const p = new Promise(resolve => {
            db.collection('user_info').where({ _openid: my_id }).get({
              success: function (res) {
                resolve(res)
                console.log(res)
              }
            }
            )
          })
          p.then(res => {

            var userdata = res.data.pop()
            console.log(userdata)
            const col = userdata.taskid
            console.log(col)
            col.push(value._id)
            console.log(col)
            const p = new Promise(resolve => {
              db.collection('user_info').where({ _openid: my_id }).update({
                data: {
                  taskid: col
                },
                success: function (res) {
                  console.log(res)
                  resolve(res)
                }
              })
            })
            p.then(res => {
              console.log("updated")
            })

          })
        }
        this.triggerEvent("click")
        this.setData({
          collected: true
        })
        wx.setStorageSync('collected', true)
      } catch (e) {

      }

    },
    inputDdl(e) {
      const comma = e.detail.value.substring(2, 3);
      const hours = parseInt(e.detail.value.substring(0, 2));
      const min = parseInt(e.detail.value.substring(3, 5));
      if (e.detail.value.length == 5 && (comma == ":") && hours >= 0 && hours <= 24 && min >= 0 && min <= 59) {
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
          totalNeeded: e.detail.value
        })
      } else {
        // this.toastMsg("请输入2-6的整数")
      }
    },
    inputLoc(e) {
      this.setData({
        location: e.detail.value
      })
    },
    inputDLoc(e) {
      this.setData({
        dLocation: e.detail.value
      })
    },
    bindUpdate(e) {
      console.log('clicked')
      console.log(e)
      if (this.data.canBeUpdated && this.data.totalNeeded == (this.data.num || '')) {
        this.update(0);
      } else if (this.data.canBeUpdated && parseInt(this.data.totalNeeded) >= 2 && parseInt(this.data.totalNeeded) <= 6) {
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
        mask: true
      })
    },
    update(i) {
      const db = wx.cloud.database();
      if (i == 1) {
        const p = new Promise(resolve => {
          db.collection('tasks').doc(this.data.publishId).update({
            data: {
              numberOfPeople: this.data.totalNeeded,
              deadline: this.data.deadline,
              location: this.data.location,
              dLocation: this.data.dLocation
            },
            success: function (res) {
              resolve(res)
            }
          })
        });
        p.then(res => {
          this.triggerEvent("update", this.data.inputValue)
        })
      } else {
        const p = new Promise(resolve => {
          db.collection('tasks').doc(this.data.publishId).update({
            data: {
              deadline: this.data.deadline,
              location: this.data.location,
              dLocation: this.data.dLocation
            },
            success: function (res) {
              resolve(res)
            }
          })
        });
        p.then(res => {
          this.triggerEvent("update", this.data.inputValue)
        })
      }
    },
    bindDelete(e) {
      let self = this;
      const db = wx.cloud.database();
      const p = new Promise(resolve => {
        db.collection('tasks').doc(this.data.publishId).remove({
          success(res) {
            resolve(res);
            console.log(res);
            console.log("deleted");
            const _ = db.command;
            const openid = wx.getStorageSync('info').openid
            db.collection('user_info').where({ _openid: openid }).update({
              data: {
                'groupid': _.pullAll([self.data.publishId,])
              },
              success: res => { console.log(res) },
              fail: err => { console.log(err) }
            })
          }
        })
      });
      p.then(res => {
        this.triggerEvent("delete", this.data.inputValue);
      })
    },
    joinGrp(e) {
      let that = this;

      const p = new Promise(resolve => {
        const join = wx.getStorageSync('current_joined');
        join.push(wx.getStorageSync('info').openid)
        console.log("join")
        console.log(join)
        db.collection('tasks').doc(this.data.publishId).update({
          data: {
            joined: join
          },
          success: function (res) {
            that.setData({
              included: true
            })
            wx.setStorageSync('current_joined', join)
            resolve(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      });
      p.then(res => {
        db.collection('tasks').doc(this.data.publishId).get().then(res2 => {
          console.log(res2)
          const _ = db.command;
          const openid = wx.getStorageSync('info').openid
          db.collection('user_info').where({ _openid: openid }).update({
            data: {
              'groupid': _.push(res2.data._id)
            },
            success: res => { console.log(res) },
            fail: err => { console.log(err) }
          })
        })
      })

    },
    leaveGrp(e) {
      let that = this;

      const p = new Promise(resolve => {
        const join = wx.getStorageSync('current_joined');
        join.splice(join.indexOf(wx.getStorageSync('info').openid), 1);

        if (that.data.mine) {
          db.collection('tasks').doc(this.data.publishId).update({
            data: {
              joined: join,
              _openid: join[0]
            },
            success: function (res) {
              resolve(res);
              that.setData({
                included: false
              });
              that.triggerEvent('leaveGrp', wx.getStorageSync('current_card'));

              const _ = db.command;
              const openid = wx.getStorageSync('info').openid
              db.collection('user_info').where({ _openid: openid }).update({
                data: {
                  'groupid': _.pull(that.data.publishId)
                },
                success: res => { console.log(res) },
                fail: err => { console.log(err) }
              })

            },
            fail(res) {
              console.log(res)
            }
          })
        } else {
          db.collection('tasks').doc(this.data.publishId).update({
            data: {
              joined: join,
            },
            success: function (res) {
              that.setData({
                included: false
              })
              resolve(res)
            },
            fail(res) {
              console.log(res)
            }
          })
        }
      });
      p.then(res => {
        db.collection('tasks').doc(this.data.publishId).get().then(res2 => { console.log(res2) })
      })

    }

  }
})


