// components/Card_Main.js
Component({
  /**
   * Component properties
   */
  attached: function() {
    const r = this.dataset.restaurant;
    const d = this.dataset.deadline;
    const n = this.dataset.numberofpeople;
    const id = this.dataset.myid;
    // console.log(this.dataset)
    this.setData({
      resName:r,
      deadline:d,
      numOfPpl: n,
      id: id
    });
  },
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    resName:'',
    deadline:'',
    numOfPpl:'',
    id:''
  },

  /**
   * Component methods
   */
  methods: {

  }
})
