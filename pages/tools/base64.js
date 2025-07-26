const app = getApp();
const encodingUtil = require('../../utils/encoding.js');

Page({
    data: {
        // 转换类型配置
        converterTypes: [
            'URL编码/解码',
            'Base64编码/解码',
            'HTML实体编码/解码',
            'Unicode编码/解码',
            '字符集转换',
            '十六进制/Hex转换',
            'ASCII转换',
            'Quoted-Printable编码/解码',
            'Base32编码/解码',
            'Base64URL编码/解码'
        ],
        converterValues: [
            'url', 'base64', 'html', 'unicode',
            'charset', 'hex', 'ascii', 'quoted-printable',
            'base32', 'base64url'
        ],
        converterIndex: 0,
        currentConverter: 'url',
        currentDescription: '将普通文本转换为URL安全格式（如空格→%20），或反向解码。适用于处理URL参数、接口请求中的特殊字符。',

        // 转换状态
        isEncoding: true,
        input: '',
        output: '',
        errorMessage: '',

        // 图片相关
        imagePath: '',

        // 批量处理
        isBatchMode: false,
        showBatchTools: true,

        // 设置
        realtimeConversion: true,
        darkMode: false
    },

    onLoad(options) {
        // 从首页选择的转换类型
        if (options.type) {
            const index = this.data.converterValues.indexOf(options.type);
            if (index !== -1) {
                this.setData({
                    converterIndex: index,
                    currentConverter: options.type
                });
            }
        } else {
            // 使用默认转换类型
            const defaultConverter = app.globalData.defaultConverter;
            const index = this.data.converterValues.indexOf(defaultConverter);
            if (index !== -1) {
                this.setData({
                    converterIndex: index,
                    currentConverter: defaultConverter
                });
            }
        }

        // 更新描述信息
        this.updateDescription();

        // 加载设置
        const settings = wx.getStorageSync('settings') || {};
        this.setData({
            realtimeConversion: settings.realtimeConversion !== false,
            darkMode: app.globalData.darkMode
        });

        // 监听主题变化
        app.themeChangedCallback = (darkMode) => {
            this.setData({
                darkMode
            });
        };
    },

    // 更新当前转换类型的描述
    updateDescription() {
        const descriptions = {
            'url': '将普通文本转换为URL安全格式（如空格→%20），或反向解码。适用于处理URL参数、接口请求中的特殊字符。',
            'base64': '文本与Base64格式互转；支持图片文件与Base64字符串互转。常用于图片嵌入网页、简单数据加密传输。',
            'html': '将特殊字符（如<→&lt;）与普通文本互转。适用于网页开发中处理HTML内容，避免XSS注入。',
            'unicode': '普通文本与Unicode编码（如"中"→\\u4E2D）互转；支持全角/半角字符转换。',
            'charset': '支持UTF-8、GBK、GB2312等常见字符集互转。适用于老系统数据迁移。',
            'hex': '文本与十六进制字符串互转（如"abc"→616263）。常用于硬件通信、二进制数据处理。',
            'ascii': 'ASCII码与字符互转（如65→A）。适用于字符编码调试。',
            'quoted-printable': '邮件内容编码格式的编码与解码。常用于邮件解析。',
            'base32': 'Base32编码与解码，一种基于32个可打印字符的编码方式。',
            'base64url': 'URL安全的Base64变体编码与解码，常用于OAuth2.0等协议。'
        };

        this.setData({
            currentDescription: descriptions[this.data.currentConverter] || ''
        });
    },

    // 切换转换类型
    onConverterChange(e) {
        const index = e.detail.value;
        this.setData({
            converterIndex: index,
            currentConverter: this.data.converterValues[index],
            input: '',
            output: '',
            errorMessage: '',
            imagePath: ''
        });
        this.updateDescription();
    },

    // 切换编码/解码模式
    toggleConversionType() {
        this.setData({
            isEncoding: !this.data.isEncoding,
            output: '',
            errorMessage: ''
        });

        // 如果有输入内容，立即转换
        if (this.data.input && this.data.realtimeConversion) {
            this.convertText();
        }
    },

    // 输入内容变化
    onInputChange(e) {
        const input = e.detail.value;
        this.setData({
            input,
            errorMessage: ''
        });

        // 实时转换
        if (this.data.realtimeConversion && input) {
            this.convertText();
        } else if (!input) {
            this.setData({
                output: ''
            });
        }
    },

    // 执行转换
    convertText() {
        const {
            currentConverter,
            input,
            isEncoding
        } = this.data;

        if (!input.trim()) {
            this.setData({
                output: '',
                errorMessage: ''
            });
            return;
        }

        try {
            let output;

            // 根据不同转换类型处理
            if (currentConverter === 'url') {
                output = isEncoding ?
                    encodingUtil.urlEncode(input) :
                    encodingUtil.urlDecode(input);
            } else if (currentConverter === 'base64') {
                output = isEncoding ?
                    encodingUtil.base64Encode(input) :
                    encodingUtil.base64Decode(input);
            } else if (currentConverter === 'html') {
                output = isEncoding ?
                    encodingUtil.htmlEncode(input) :
                    encodingUtil.htmlDecode(input);
            } else if (currentConverter === 'unicode') {
                output = isEncoding ?
                    encodingUtil.unicodeEncode(input) :
                    encodingUtil.unicodeDecode(input);
            } else if (currentConverter === 'charset') {
                // 这里简化处理，实际应提供字符集选择
                output = isEncoding ?
                    encodingUtil.convertCharset(input, 'utf8', 'gbk') :
                    encodingUtil.convertCharset(input, 'gbk', 'utf8');
            } else if (currentConverter === 'hex') {
                output = isEncoding ?
                    encodingUtil.hexEncode(input) :
                    encodingUtil.hexDecode(input);
            } else if (currentConverter === 'ascii') {
                output = isEncoding ?
                    encodingUtil.asciiEncode(input) :
                    encodingUtil.asciiDecode(input);
            } else if (currentConverter === 'quoted-printable') {
                output = isEncoding ?
                    encodingUtil.quotedPrintableEncode(input) :
                    encodingUtil.quotedPrintableDecode(input);
            } else if (currentConverter === 'base32') {
                output = isEncoding ?
                    encodingUtil.base32Encode(input) :
                    encodingUtil.base32Decode(input);
            } else if (currentConverter === 'base64url') {
                output = isEncoding ?
                    encodingUtil.base64UrlEncode(input) :
                    encodingUtil.base64UrlDecode(input);
            }

            this.setData({
                output,
                errorMessage: ''
            });

            // 保存历史记录
            app.saveHistory({
                type: currentConverter,
                action: isEncoding ? 'encode' : 'decode',
                input: input,
                output: output,
                title: this.data.converterTypes[this.data.converterIndex] + (isEncoding ? '编码' : '解码')
            });

        } catch (err) {
            this.setData({
                output: '',
                errorMessage: err.message || '转换失败，请检查输入内容'
            });
        }
    },


    // 清空输入
    clearInput() {
        this.setData({
            input: '',
            output: '',
            errorMessage: '',
            imagePath: ''
        });
    },

    // 清空输出
    clearOutput() {
        this.setData({
            output: ''
        });
    },

    // 复制结果
    copyOutput() {
        const {
            output
        } = this.data;
        if (!output) return;

        wx.setClipboardData({
            data: output,
            success() {
                wx.showToast({
                    title: '已复制',
                    icon: 'success',
                    duration: 1500
                });
            }
        });
    },

    // 选择图片（Base64编码）
    chooseImage() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePath = res.tempFilePaths[0];

                // 显示图片预览
                this.setData({
                    imagePath: tempFilePath,
                    input: '' // 清空文本输入
                });

                // 读取图片并转换为Base64
                wx.getFileSystemManager().readFile({
                    filePath: tempFilePath,
                    encoding: 'base64',
                    success: (res) => {
                        const base64Data = res.data;
                        this.setData({
                            output: base64Data
                        });

                        // 保存历史记录
                        app.saveHistory({
                            type: 'base64',
                            action: 'encode',
                            input: '图片文件',
                            output: base64Data.substring(0, 30) + '...',
                            title: 'Base64编码（图片）'
                        });
                    }
                });
            }
        });
    },

    // 保存图片到相册
    saveImage() {
        const base64Data = this.data.output;
        if (!base64Data) return;

        // 转换Base64为临时文件
        const filePath = wx.env.USER_DATA_PATH + '/base64_image.png';
        const fs = wx.getFileSystemManager();

        try {
            fs.writeFileSync(filePath, base64Data, 'base64');

            // 保存到相册
            wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success() {
                    wx.showToast({
                        title: '图片已保存',
                        icon: 'success',
                        duration: 2000
                    });
                },
                fail(err) {
                    console.error('保存图片失败', err);
                    wx.showToast({
                        title: '保存失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        } catch (err) {
            console.error('处理图片失败', err);
            wx.showToast({
                title: '处理图片失败',
                icon: 'none',
                duration: 2000
            });
        }
    },

    // 切换批量模式
    toggleBatchMode() {
        this.setData({
            isBatchMode: !this.data.isBatchMode,
            input: '',
            output: ''
        });
    },

    // 选择文本文件
    chooseTextFile() {
        wx.chooseMessageFile({
            count: 1,
            type: 'text',
            success: (res) => {
                const tempFilePath = res.tempFiles[0].path;

                // 检查文件大小（限制1MB）
                if (res.tempFiles[0].size > 1024 * 1024) {
                    wx.showToast({
                        title: '文件过大，请选择1MB以内的文件',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }

                // 读取文件内容
                wx.getFileSystemManager().readFile({
                    filePath: tempFilePath,
                    encoding: 'utf8',
                    success: (res) => {
                        this.setData({
                            input: res.data
                        });

                        // 自动转换
                        if (this.data.realtimeConversion) {
                            this.convertText();
                        }
                    },
                    fail: (err) => {
                        console.error('读取文件失败', err);
                        wx.showToast({
                            title: '读取文件失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                });
            }
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
            title: '邀请你一起使用"编码转换"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"编码转换"',
            path: '/pages/tools/base64',
        };
    },

    saveResult() {
        wx.showToast({
            title: '收藏功能待实现',
            duration: 1500,
            icon: 'none'
        })
    }
});