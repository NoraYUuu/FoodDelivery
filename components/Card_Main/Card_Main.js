// components/Card_Main.js
Component({
  /**
   * Component properties
   */
  attached: function() {
    const r = this.dataset.restaurant;
    const d = this.dataset.deadline;
    const n = this.dataset.numberofpeople;
    this.setData({
      resName:r,
      deadline:d,
      numOfPpl: n
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
    numOfPpl:''
  },

  /**
   * Component methods
   */
  methods: {

  }
})
