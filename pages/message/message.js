
const db = wx.cloud.database()

Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		yourname: "",
		openId: "",
		//unReadSpotNum: 0,
		//unReadNoticeNum: 0,
		//messageNum: 0,
		//unReadTotalNotNum: 0,
		groupId: [],
		show_clear: false,
		groupName: {}
	},

	onShow() {
		let self = this;
		let userInfo = wx.getStorageSync('userinfo');
		let openid = wx.getStorageSync('info').openid;
		db.collection("user_info").where({ _openid: openid }).get().then(res => {
			this.setData({
				groupId: res.data[0].groupid
			})
		}).catch(err => { console.log(err) })
		//let groupid = wx.getStorageSync('userDetails').groupid;
		//console.log(groupid);
		if (!userInfo) {
			wx.showToast({
				title: '请先登录',
				duration: 1000,
			})
		} else {
			self.setData({
				yourname: userInfo.nickName,
				openId: openid,
			})
		}
	},

	openSearch: function () {
		this.setData({
			search_btn: false,
			search_chats: true,
			gotop: true
		});
	},


	cancel: function () {
		/* this.getChatList() */
		this.setData({
			search_btn: true,
			search_chats: false,
			//arr: this.getChatList(),
			/* unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum, */
			gotop: false
		});
	},

	clearInput: function () {
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	close_mask: function () {
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		});
	},

	chooseExcel() {
		let that = this
		wx.chooseMessageFile({
			count: 1,
			type: 'file',
			success(res) {
				let path = res.tempFiles[0].path;
				console.log("成功" + path)
				that.uploadExcel(path);
			}
		})
	},

	uploadExcel(path) {
		let that = thiswx.cloudwx.uploadFile({
			cloudPath: new Date().getTime() + '.xls',
			filePath: path,
			success: res => {
				console.log("uploaded", res.fileID)
				that.jiexi(res.fileID)
			},
			fail: err => {
				console.log("failed", err)
			},
			jiexi(fileId) {
				wx.cloud.callFunction({
					name: "excel",
					data: {
						fileID: fileId
					},
					success(res) {
						console.log("jiexi", res)
					},
					fail(res) {
						console.log("jiexi failed", res)
					}
				})
			}
		})
	},

	//跳转到聊天室
	toChat: function (event) {

		let detail = event.currentTarget.dataset.item;
		console.log(event.currentTarget.dataset.item);
		wx.navigateTo({
			url: '../chatgroup/chatgroup?groupId=' + detail, //need to stringify or not?
		})
	}
})
