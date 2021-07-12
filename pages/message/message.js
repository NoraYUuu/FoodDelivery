
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
		groups: [] //store groupId, groupname, groupphoto
	},

	onShow() {
		let self = this;
		let userInfo = wx.getStorageSync('userinfo');
		if (userInfo) {
			let openid = wx.getStorageSync('info').openid;
			db.collection("user_info").where({ _openid: openid }).get({
				success: async res => {
					let groupid = res.data[0].groupid;
					this.setData({
						groupId: groupid
					})
					var group = [];
					for (var i = 0, len = groupid.length; i < len; i++) {
						const p = await new Promise((resolve, reject) => {
							db.collection("tasks").doc(groupid[i]).get({
								success: res => {
									console.log(res);
									/* let info = res.data;
									group.push({
										groupId: info._id,
										restaurant: info.restaurant,
										photo: info.image
									}) */
									resolve(res)
								},
								fail(res) {
									reject(res)
								}
							})
						},
						)
						//console.log(p)
						let info = p.data;
						group.push({
							groupId: info._id,
							restaurant: info.restaurant,
							photo: info.image,
							managerId: info._openid
						})
						//console.log(group)
						//console.log(self.data.groups)
					}

					self.setData({
						groups: group
					})
					console.log(self.data.groups)
				},
				fail: res => {
					console.log(res)
				}
			})
			self.setData({
				yourname: userInfo.nickName,
				openId: openid,
			})
		}

		//let groupid = wx.getStorageSync('userDetails').groupid;
		//console.log(groupid);
		if (!userInfo) {
			wx.showToast({
				title: '请先登录',
				duration: 1000,
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

	/* uploadExcel(path) {
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
	}, */

	//跳转到聊天室
	toChat: function (event) {

		let detail = event.currentTarget.dataset.item;//.groupId;
		console.log(event.currentTarget.dataset.item.groupId);
		wx.navigateTo({
			url: '../chatgroup/chatgroup?groupInfo=' + JSON.stringify(detail), //need to stringify or not?
		})
	}
})
