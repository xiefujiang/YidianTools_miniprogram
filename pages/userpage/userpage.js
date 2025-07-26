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
                id: 2,
                text: '关于小程序',
                url: '/pages/userpage/menupage/about'
            },
            {
                id: 1,
                text: '联系作者',
                url: '/pages/userpage/menupage/contact'
            },
            {
                id: 3,
                text: '更新日志',
                url: '/pages/userpage/menupage/updatelog'
            },
            {
                id: 4,
                text: '用户协议与隐私政策',
                url: '/pages/userpage/menupage/policy'
            },
            {
                id: 'share', // 特别标识为分享项
                text: '邀请好友',
                url: ''
            }
        ]
    },


    gotoUsersettingPage() {
        wx.showToast({
            title: '设置功能敬请期待',
            duration: 1000,
            icon: 'none'
        });
        return;

        wx.navigateTo({
            url: '/pages/userpage/usersetting',
            fail: function (err) {
                console.error('页面跳转失败：', err);
            }
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
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"亿点Tools"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"亿点Tools"',
            path: '/pages/homepage/homepage',
        };
    },

    handleShare() {
        wx.showModal({
            title: '分享提示',
            content: '请点击屏幕右上角的"···"按钮，选择"发送给朋友"',
            showCancel: false
        });
    },
});