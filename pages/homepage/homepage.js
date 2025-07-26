// pages/homepage/homepage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gridData: [{
                id: 1,
                iconUrl: '/pages/res/icons/qrcode.png',
                text: '二维码生成',
                url: '/pages/tools/qrcode'
            },
            {
                id: 2,
                iconUrl: '/pages/res/icons/random.png',
                text: '随机数生成',
                url: '/pages/tools/random'
            },
            {
                id: 3,
                iconUrl: '/pages/res/icons/code.png',
                text: 'xml/json格式化',
                url: '/pages/tools/code'
            },
            {
                id: 4,
                iconUrl: '/pages/res/icons/convert.png',
                text: '进制转换',
                url: '/pages/tools/convert'
            },
            {
                id: 5,
                iconUrl: '/pages/res/icons/colorring.png',
                text: 'RGB颜色代码',
                url: '/pages/tools/colorring'
            },
            {
                id: 6,
                iconUrl: '/pages/res/icons/regex.png',
                text: '正则表达式',
                url: '/pages/tools/regex'
            },
            {
                id: 7,
                iconUrl: '/pages/res/icons/base64.png',
                text: '编码转换',
                url: '/pages/tools/base64'
            },
            {
                id: 8,
                iconUrl: '/pages/res/icons/hash.png',
                text: '哈希加密',
                url: '/pages/tools/hash'
            },
        ]
    },

    navigateToPage: function (e) {
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