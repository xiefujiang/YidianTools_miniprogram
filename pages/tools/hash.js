// 引入crypto-js
const CryptoJS = require('crypto-js');

Page({
    data: {
        inputText: '',
        algorithmIndex: 0,
        algorithms: [{
                name: 'MD5',
                func: CryptoJS.MD5
            },
            {
                name: 'SHA1',
                func: CryptoJS.SHA1
            },
            {
                name: 'SHA256',
                func: CryptoJS.SHA256
            },
            {
                name: 'SHA512',
                func: CryptoJS.SHA512
            },
            {
                name: 'SHA3',
                func: CryptoJS.SHA3
            },
            {
                name: 'RIPEMD160',
                func: CryptoJS.RIPEMD160
            }
        ],
        result: ''
    },

    onInputChange(e) {
        this.setData({
            inputText: e.detail.value
        });
    },

    onAlgorithmChange(e) {
        this.setData({
            algorithmIndex: e.detail.value
        });
    },

    onEncrypt() {
        if (!this.data.inputText.trim()) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none'
            });
            return;
        }

        const algorithm = this.data.algorithms[this.data.algorithmIndex];
        const hash = algorithm.func(this.data.inputText).toString();

        this.setData({
            result: hash
        });
    },

    onCopy() {
        if (!this.data.result) return;

        wx.setClipboardData({
            data: this.data.result,
            success() {
                wx.showToast({
                    title: '复制成功'
                });
            }
        });
    },

    onSave() {
        // 收藏功能的实现
        wx.showToast({
            title: '收藏功能待实现',
            icon: 'none'
        });
    },

    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"哈希加密工具"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"哈希加密工具"',
            path: '/pages/tools/hash',
        };
    },

});