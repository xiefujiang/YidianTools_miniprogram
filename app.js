// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        this.initStorage();
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 检查是否有默认转换类型设置
        const defaultConverter = wx.getStorageSync('defaultConverter') || 'url';
        this.globalData.defaultConverter = defaultConverter;

        // 检查深色模式设置
        const darkMode = wx.getStorageSync('darkMode') || false;
        this.globalData.darkMode = darkMode;

        // 监听深色模式变化
        wx.onThemeChange((res) => {
            this.globalData.systemDarkMode = res.theme === 'dark';
            this.updateDarkMode();
        });
    },

    initStorage() {
        // 初始化历史记录
        if (!wx.getStorageSync('conversionHistory')) {
            wx.setStorageSync('conversionHistory', []);
        }

        // 初始化设置
        if (!wx.getStorageSync('settings')) {
            wx.setStorageSync('settings', {
                realtimeConversion: true,
                defaultConverter: 'url',
                darkMode: false,
                maxHistoryCount: 20
            });
        }
    },

    updateDarkMode() {
        const settings = wx.getStorageSync('settings');
        const darkMode = settings.darkMode === 'system' ?
            this.globalData.systemDarkMode :
            settings.darkMode;

        this.globalData.darkMode = darkMode;

        // 通知所有页面更新主题
        if (this.themeChangedCallback) {
            this.themeChangedCallback(darkMode);
        }
    },

    // 保存转换记录
    saveHistory(record) {
        const history = wx.getStorageSync('conversionHistory') || [];
        const settings = wx.getStorageSync('settings');
        const maxCount = settings.maxHistoryCount || 20;

        // 添加新记录到开头
        history.unshift({
            ...record,
            timestamp: new Date().getTime()
        });

        // 限制记录数量
        if (history.length > maxCount) {
            history.splice(maxCount);
        }

        wx.setStorageSync('conversionHistory', history);

        // 如果有历史页面监听，通知更新
        if (this.historyUpdatedCallback) {
            this.historyUpdatedCallback(history);
        }
    },

    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        const userInfo = wx.getStorageSync('userInfo');

        if (token && userInfo) {
            // 已登录，验证token有效性
            this.verifyToken(token);
        } else {
            // 未登录，调用登录流程
            this.login();
        }
    },

    login() {
        wx.login({
            success: res => {
                if (res.code) {
                    // 发送code到后端换取openid和session_key
                    wx.request({
                        url: 'https://w1ldptr11.xyz/api/login',
                        method: 'POST',
                        data: {
                            code: res.code
                        },
                        success: result => {
                            if (result.data.success) {
                                const {
                                    token,
                                    isNewUser
                                } = result.data.data;
                                wx.setStorageSync('token', token);

                                if (isNewUser) {
                                    // 首次登录，引导用户授权并填写信息
                                    wx.navigateTo({
                                        url: '/pages/register/register'
                                    });
                                } else {
                                    // 非首次登录，获取用户信息
                                    this.getUserInfo(token);
                                }
                            } else {
                                wx.showToast({
                                    title: '登录失败',
                                    icon: 'none'
                                });
                            }
                        }
                    });
                } else {
                    wx.showToast({
                        title: '登录码获取失败',
                        icon: 'none'
                    });
                }
            }
        });
    },

    globalData: {
        userInfo: null,
        darkMode: false,
        systemDarkMode: false,
        defaultConverter: 'url'
    }
})