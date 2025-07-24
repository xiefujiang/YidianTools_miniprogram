Page({
    data: {
        config: {
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: false,
            custom: false,
            customChars: '',
            length: 16
        },
        resultText: '',
        saveBtnText: '保存结果',
        saveBtnIcon: 'fa-save',
        saveBtnBg: '',
        saveBtnColor: '',
        saveBtnBorderColor: ''
    },

    onLoad() {
        // 初始化
    },

    toggleOption(e) {
        const option = e.currentTarget.dataset.option;
        const newConfig = {
            ...this.data.config
        };
        newConfig[option] = !newConfig[option];
        this.setData({
            config: newConfig
        });

        // 如果选择了自定义，聚焦到自定义输入框 - 修复版本
        if (option === 'custom' && newConfig[option]) {
            // 使用setTimeout确保DOM已更新
            setTimeout(() => {
                wx.createSelectorQuery().select('#customChars').fields({
                    node: true,
                    size: true
                }, res => {
                    if (res.node) {
                        // 存在输入框节点才执行聚焦
                        res.node.focus();
                    }
                }).exec();
            }, 0);
        }
    },

    onLengthChange(e) {
        const newConfig = {
            ...this.data.config
        };
        newConfig.length = e.detail.value;
        this.setData({
            config: newConfig
        });
    },

    onCustomCharsInput(e) {
        const newConfig = {
            ...this.data.config
        };
        newConfig.customChars = e.detail.value;

        // 如果用户输入了自定义字符，自动选中自定义选项
        if (newConfig.customChars.trim() !== '') {
            newConfig.custom = true;
        }

        this.setData({
            config: newConfig
        });
    },

    generateRandomString() {
        const {
            config
        } = this.data;
        let charPool = '';

        if (config.numbers) charPool += '0123456789';
        if (config.lowercase) charPool += 'abcdefghijklmnopqrstuvwxyz';
        if (config.uppercase) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (config.symbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?~';
        if (config.custom && config.customChars) charPool += config.customChars;

        if (!charPool) {
            wx.showToast({
                title: '请至少选择一种字符类型',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        let result = '';
        for (let i = 0; i < config.length; i++) {
            result += charPool.charAt(Math.floor(Math.random() * charPool.length));
        }

        this.setData({
            resultText: result
        });
    },

    saveResult() {
        if (!this.data.resultText.trim()) {
            wx.showToast({
                title: '请先生成随机字符串',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        // 保存到剪贴板
        wx.setClipboardData({
            data: this.data.resultText,
            success: () => {
                // 更新按钮状态
                this.setData({
                    saveBtnText: '已保存',
                    saveBtnIcon: 'fa-check',
                    saveBtnBg: '#4CAF50',
                    saveBtnColor: 'white',
                    saveBtnBorderColor: '#4CAF50'
                });

                wx.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success',
                    duration: 2000
                });

                setTimeout(() => {
                    this.setData({
                        saveBtnText: '保存结果',
                        saveBtnIcon: 'fa-save',
                        saveBtnBg: '',
                        saveBtnColor: '',
                        saveBtnBorderColor: ''
                    });
                }, 2000);
            }
        });
    },

    onLengthChange(e) {
        const newConfig = {
            ...this.data.config
        };
        newConfig.length = e.detail.value;
        this.setData({
            config: newConfig
        });
    },

    onLengthConfirm(e) {
        let value = parseInt(e.detail.value);
        // 纠错逻辑
        if (isNaN(value)) value = 16;
        if (value < 4) value = 4;
        if (value > 64) value = 64;

        const newConfig = {
            ...this.data.config
        };
        newConfig.length = value;
        // 关键：通过setData更新config.length，滑块会自动同步（因为滑块value绑定了config.length）
        this.setData({
            config: newConfig
        });
    },

    onResultTextChange(e) {
        const value = e.detail.value;
        this.setData({
            resultText: value
        });

        // 当用户修改结果时，自动启用自定义选项
        if (value.trim() !== '') {
            const newConfig = {
                ...this.data.config
            };
            newConfig.custom = true;
            newConfig.customChars = value;
            this.setData({
                config: newConfig
            });
        }
    }
});