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
    const img = this.dataset.img;
    const j = this.dataset.joined;
    const joined = this.dataset.collectionjoin != null;
    //console.log(this.dataset)
    this.setData({
      resName:r,
      deadline:('0' + (d/60).toFixed(0)).slice(-2) + ':' + ('0' + (d%60).toFixed(0)).slice(-2),//TBC
      numOfPpl: j.length + "/" + n,
      id: id,
      cardImg:img,
      full: (parseInt(n) == j.length) || (n=="All" && j.length > 1),
      fromJoined: joined
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
    id:'',
    cardImg:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F17026bfe5d56794fff418a40195862b54c8f39ef46b2d-etk3LH_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626946341&t=f4a3beba6fc6a630f9a8eeca5b18ce03',
    show: true,
    full: false,
    fromJoined: false
  },

  /**
   * Component methods
   */
  methods: {
    
  }
})
