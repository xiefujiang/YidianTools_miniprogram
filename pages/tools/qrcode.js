// pages/tools/qrcode.js
import drawQrcode from 'weapp-qrcode';

Page({
    data: {
        inputValue: '',
        qrcodeUrl: '',
        qrcodeCanvasId: 'myQrcode',
        showQrcode: false,
        canvasSize: 0,
        isLoading: false,
        errorMsg: '',
        retryCount: 0
    },

    collectQrcode() {
        // 收藏功能待实现
        wx.showToast({
            title: '收藏功能待实现',
            icon: 'none'
        });
    },


    // 检查并申请相机权限（在 scanQrcode 中调用）
    checkCameraPermission() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (settingRes) => {
                    // 检查是否有相机权限
                    if (!settingRes.authSetting['scope.camera']) {
                        // 无权限，申请权限
                        wx.authorize({
                            scope: 'scope.camera',
                            success: () => resolve(true), // 授权成功
                            fail: () => {
                                // 授权失败，引导用户去设置页开启
                                wx.showModal({
                                    title: '需要相机权限',
                                    content: '请在设置中开启相机权限以使用扫码功能',
                                    confirmText: '去设置',
                                    success: (modalRes) => {
                                        if (modalRes.confirm) {
                                            // 打开小程序设置页
                                            wx.openSetting({
                                                success: (openRes) => {
                                                    resolve(openRes.authSetting['scope.camera'] || false);
                                                }
                                            });
                                        } else {
                                            resolve(false);
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        // 已有权限
                        resolve(true);
                    }
                }
            });
        });
    },

    // 修改后的扫码方法（加入权限检查）
    async scanQrcode() {
        // 先检查相机权限
        const hasPermission = await this.checkCameraPermission();
        if (!hasPermission) {
            wx.showToast({
                title: '未获得相机权限，无法扫码',
                icon: 'none'
            });
            return;
        }

        // 权限通过，调用扫码接口（同上的 wx.scanCode 逻辑）
        wx.scanCode({
            onlyFromCamera: false, // 是否只能从相机扫码（false 支持相册选择）
            scanType: ['qrCode', 'barCode'], // 支持的扫码类型（二维码、条形码）
            success: (res) => {
                // 扫码成功，res 包含解析结果
                console.log('扫码结果：', res);

                // 展示扫码结果（可根据需求处理，如跳转链接、填充到输入框等）
                wx.showModal({
                    title: '扫码成功',
                    content: '解析内容：${res.result}\n类型：${res.scanType}\n内容已复制到剪贴板',
                    showCancel: false
                });

                this.setData({
                    inputValue: res.result,
                    showQrcode: false
                });
            },
            fail: (err) => {
                // 扫码失败（如用户取消、无权限等）
                console.error('扫码失败：', err);

                // 排除用户主动取消的情况（不提示错误）
                if (err.errMsg !== 'scanCode:fail cancel') {
                    wx.showToast({
                        title: '扫码失败，请重试',
                        icon: 'none'
                    });
                }
            }
        });
    },

    preview() {
        if (!this.data.qrcodeUrl) {
            wx.showToast({
                title: '请先生成二维码',
                icon: 'none'
            });
            return;
        }

        wx.previewImage({
            current: this.data.qrcodeUrl,
            urls: [this.data.qrcodeUrl],
            success: () => {
                console.log('图片预览预览成功');
            },
            fail: (err) => {
                console.error('图片预览失败:', err);
                wx.showToast({
                    title: '预览失败',
                    icon: 'none'
                });
            }
        });
    },

    onLoad() {
        console.log('drawQrcode 类型:', typeof drawQrcode);

        if (typeof drawQrcode !== 'function') {
            this.setData({
                errorMsg: '二维码库加载失败，请检查npm构建'
            });
            return;
        }

        const windowInfo = wx.getWindowInfo();
        this.setData({
            canvasSize: windowInfo.windowWidth * 0.7
        });

        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"二维码生成器"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"二维码生成器"',
            path: '/pages/tools/qrcode',
        };
    },

    onInputChange(e) {
        const value = e.detail.value || '';
        console.log('输入内容:', value);

        this.setData({
            inputValue: value
        }, () => {
            console.log('更新后 inputValue:', this.data.inputValue);
        });
    },

    generateQrcode() {
        if (this.data.isLoading) return;

        const content = this.data.inputValue;
        const isValid = content && content.trim().length > 0;

        console.log('输入内容验证:', {
            content,
            isValid
        });

        if (!isValid) {
            wx.showToast({
                title: '请输入有效内容',
                icon: 'none'
            });
            return;
        }

        this.setData({
            isLoading: true,
            errorMsg: '',
            retryCount: 0,
            qrcodeUrl: ''
        });

        wx.showLoading({
            title: '生成中...',
            mask: true
        });

        try {
            console.log('开始生成二维码，内容长度:', content.length);

            drawQrcode({
                width: this.data.canvasSize,
                height: this.data.canvasSize,
                canvasId: this.data.qrcodeCanvasId,
                text: content
            });

            this.setData({
                showQrcode: true
            });
            this.tryConvertCanvasToImage();

        } catch (error) {
            this.handleError('生成失败', error);
        }
    },

    tryConvertCanvasToImage() {
        const {
            retryCount
        } = this.data;

        console.log(`尝试转换canvas为图片，第${retryCount + 1}次尝试`);

        wx.canvasToTempFilePath({
            canvasId: this.data.qrcodeCanvasId,
            success: (res) => {
                console.log('canvas转图片成功:', res);

                this.setData({
                    qrcodeUrl: res.tempFilePath,
                    isLoading: false
                });

                wx.hideLoading();
                wx.showToast({
                    title: '生成成功',
                    icon: 'success'
                });
            },
            fail: (err) => {
                console.error('canvas转图片失败:', err);

                if (retryCount < 3) {
                    this.setData({
                        retryCount: retryCount + 1
                    });

                    const delay = 200 * Math.pow(2, retryCount);
                    console.log(`将在${delay}ms后重试`);

                    setTimeout(() => {
                        this.tryConvertCanvasToImage();
                    }, delay);

                    return;
                }

                this.setData({
                    showQrcode: false,
                    isLoading: false,
                    errorMsg: '图片转换失败'
                });

                this.handleError('转换失败', err);
            }
        });
    },

    saveQrcode() {
        if (!this.data.qrcodeUrl) return;

        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: this.saveImageToPhotosAlbum.bind(this),
                        fail: () => wx.showToast({
                            title: '需要相册权限',
                            icon: 'none'
                        })
                    });
                } else {
                    this.saveImageToPhotosAlbum();
                }
            }
        });
    },

    saveImageToPhotosAlbum() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.qrcodeUrl,
            success: () => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
            },
            fail: (err) => {
                this.handleError('保存失败', err);
            }
        });
    },

    handleError(title, error) {
        wx.hideLoading();

        // 显示详细错误信息（开发环境）
        const errorMsg = typeof error === 'string' ?
            error :
            JSON.stringify(error, null, 2);

        this.setData({
            errorMsg
        });

        // 显示用户友好提示
        wx.showToast({
            title,
            icon: 'none',
            duration: 3000
        });

        console.error(`${title}：`, error);
    },

    onUnload() {
        // 清理资源
        this.setData({
            isLoading: false
        });
    }
});