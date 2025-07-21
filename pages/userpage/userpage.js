// pages/userpage/userpage.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const defaultNickname = '微信用户'

Page({
    data: {
        userInfo: {
            userAvatarUrl: defaultAvatarUrl,
            userNickName: defaultNickname
        },
        menuList: [{
                id: 1,
                text: '邀请好友',
                url: '/pages/userpage/menupage/about'
            },
            {
                id: 2,
                text: '历史记录',
                url: '/pages/userpage/menupage/about'
            },
            {
                id: 3,
                text: '设置',
                url: '/pages/userpage/menupage/about'
            },
            {
                id: 4,
                text: '联系作者',
                url: '/pages/userpage/menupage/about'
            },
            {
                id: 5,
                text: '关于小程序',
                url: '/pages/userpage/menupage/about'
            }
        ]
    },

    gotoUsersettingPage() {
        wx.navigateTo({
            url: '/pages/userpage/usersetting',
        })
    },
    gotoMenu: function (e) {
        const url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url,
            fail: function (err) {
                console.error('页面跳转失败:', err);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})