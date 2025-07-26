Page({
    /**
     * 页面的初始数据
     */
    data: {
        inputContent: '', // 输入的内容
        outputContent: '', // 输出的内容
        inputFormat: 'json', // 输入格式：xml 或 json
        outputFormat: 'json', // 输出格式：xml 或 json
        errorMessage: '', // 错误信息
        resultStatus: '' // 结果状态：success, error, 空
    },

    /**
     * 设置输入格式
     */
    setInputFormat(e) {
        const format = e.currentTarget.dataset.format;
        this.setData({
            inputFormat: format,
            outputFormat: format,
            errorMessage: '',
            resultStatus: ''
        });
    },

    /**
     * 输入内容变化时触发
     */
    onInputChange(e) {
        this.setData({
            inputContent: e.detail.value,
            errorMessage: '',
            resultStatus: ''
        });
    },

    /**
     * 清空输入
     */
    clearInput() {
        this.setData({
            inputContent: '',
            outputContent: '',
            errorMessage: '',
            resultStatus: ''
        });
    },

    /**
     * 解析内容
     */
    parseContent() {
        const {
            inputContent,
            inputFormat
        } = this.data;

        if (!inputContent.trim()) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        try {
            let result = '';

            if (inputFormat === 'json') {
                // 解析JSON并格式化
                const jsonObj = JSON.parse(inputContent);
                result = JSON.stringify(jsonObj, null, 2);
                this.setData({
                    outputContent: result,
                    outputFormat: 'json',
                    errorMessage: '',
                    resultStatus: 'success'
                });
            } else {
                // 解析XML并格式化（简单实现）
                result = this.formatXml(inputContent);
                this.setData({
                    outputContent: result,
                    outputFormat: 'xml',
                    errorMessage: '',
                    resultStatus: 'success'
                });
            }
        } catch (err) {
            this.setData({
                outputContent: '',
                errorMessage: `解析错误: ${err.message}`,
                resultStatus: 'error'
            });
        }
    },

    /**
     * 转换格式（XML <-> JSON）
     */
    convertFormat() {
        const {
            inputContent,
            inputFormat
        } = this.data;

        if (!inputContent.trim()) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        try {
            let result = '';

            if (inputFormat === 'json') {
                // JSON转XML
                const jsonObj = JSON.parse(inputContent);
                result = this.jsonToXml(jsonObj);
                this.setData({
                    outputContent: result,
                    outputFormat: 'xml',
                    errorMessage: '',
                    resultStatus: 'success'
                });
            } else {
                // XML转JSON
                const jsonObj = this.xmlToJson(inputContent);
                result = JSON.stringify(jsonObj, null, 2);
                this.setData({
                    outputContent: result,
                    outputFormat: 'json',
                    errorMessage: '',
                    resultStatus: 'success'
                });
            }
        } catch (err) {
            this.setData({
                outputContent: '',
                errorMessage: `转换错误: ${err.message}`,
                resultStatus: 'error'
            });
        }
    },

    /**
     * 复制结果到剪贴板
     */
    copyResult() {
        const {
            outputContent
        } = this.data;

        if (!outputContent) {
            wx.showToast({
                title: '没有可复制的内容',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        wx.setClipboardData({
            data: outputContent,
            success() {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 1500
                });
            },
            fail() {
                wx.showToast({
                    title: '复制失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    },

    /**
     * 格式化XML
     * 简单实现，处理基本的缩进
     */
    formatXml(xml) {
        let formatted = '';
        let indent = '';
        const indentSize = 2;
        let inComment = false;

        // 替换换行符并分割
        const lines = xml.replace(/>\s*</g, '>\n<').split('\n');

        lines.forEach(line => {
            let trimLine = line.trim();

            // 处理注释
            if (trimLine.startsWith('<!--')) {
                inComment = true;
            }
            if (inComment) {
                formatted += indent + line + '\n';
                if (trimLine.includes('-->')) {
                    inComment = false;
                }
                return;
            }

            // 自闭合标签
            if (trimLine.startsWith('<') && trimLine.endsWith('/>')) {
                formatted += indent + trimLine + '\n';
                return;
            }

            // 结束标签
            if (trimLine.startsWith('</')) {
                indent = indent.substring(indentSize);
                formatted += indent + trimLine + '\n';
                return;
            }

            // 开始标签
            if (trimLine.startsWith('<')) {
                formatted += indent + trimLine + '\n';
                indent += ' '.repeat(indentSize);
                return;
            }

            // 文本内容
            formatted += indent + trimLine + '\n';
        });

        return formatted;
    },

    /**
     * XML转JSON
     * 简单实现，处理基本的XML结构
     */
    xmlToJson(xml) {
        // 移除XML声明
        xml = xml.replace(/<\?xml.*?\?>/g, '').trim();

        // 匹配根元素
        const rootMatch = xml.match(/<([^>\s]+)([^>]*)>([\s\S]*?)<\/\1>/);
        if (!rootMatch) {
            throw new Error('无效的XML结构');
        }

        const rootName = rootMatch[1];
        const rootAttrs = this.parseAttributes(rootMatch[2]);
        const rootContent = rootMatch[3].trim();

        const result = {
            [rootName]: {
                ...rootAttrs
            }
        };

        // 解析子元素
        const children = this.parseXmlChildren(rootContent);
        if (children.length > 0) {
            children.forEach(child => {
                const name = Object.keys(child)[0];
                if (result[rootName][name]) {
                    // 如果已有相同名称的属性，转为数组
                    if (!Array.isArray(result[rootName][name])) {
                        result[rootName][name] = [result[rootName][name]];
                    }
                    result[rootName][name].push(child[name]);
                } else {
                    result[rootName][name] = child[name];
                }
            });
        } else if (rootContent) {
            // 如果没有子元素但有文本内容
            result[rootName]['#text'] = rootContent;
        }

        return result;
    },

    /**
     * 解析XML属性
     */
    parseAttributes(attrString) {
        const attrs = {};
        const attrMatch = attrString.match(/(\w+)=["']([^"']*)["']/g);

        if (attrMatch) {
            attrMatch.forEach(attr => {
                const [name, value] = attr.split(/=["']/);
                attrs[name] = value.replace(/["']$/, '');
            });
        }

        return attrs;
    },

    /**
     * 解析XML子元素
     */
    parseXmlChildren(content) {
        const children = [];
        const regex = /<([^>\s]+)([^>]*)>([\s\S]*?)<\/\1>/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const name = match[1];
            const attrs = this.parseAttributes(match[2]);
            const childContent = match[3].trim();

            const child = {
                [name]: {
                    ...attrs
                }
            };

            // 检查是否有嵌套子元素
            const nestedChildren = this.parseXmlChildren(childContent);
            if (nestedChildren.length > 0) {
                nestedChildren.forEach(nested => {
                    const nestedName = Object.keys(nested)[0];
                    if (child[name][nestedName]) {
                        if (!Array.isArray(child[name][nestedName])) {
                            child[name][nestedName] = [child[name][nestedName]];
                        }
                        child[name][nestedName].push(nested[nestedName]);
                    } else {
                        child[name][nestedName] = nested[nestedName];
                    }
                });
            } else if (childContent) {
                child[name]['#text'] = childContent;
            }

            children.push(child);
            // 调整正则的最后索引，处理重叠匹配
            regex.lastIndex = match.index + match[0].length;
        }

        return children;
    },

    /**
     * JSON转XML
     * 简单实现，处理基本的JSON结构
     */
    jsonToXml(json, indent = '', isRoot = true) {
        let xml = '';
        const indentSize = 2;
        const newIndent = indent + ' '.repeat(indentSize);

        // 处理根对象
        if (isRoot) {
            const rootName = Object.keys(json)[0];
            if (!rootName) {
                throw new Error('JSON必须有一个根元素');
            }

            xml += `<${rootName}>\n`;
            xml += this.jsonToXml(json[rootName], newIndent, false);
            xml += `${indent}</${rootName}>`;
            return xml;
        }

        // 处理对象
        if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
            Object.keys(json).forEach(key => {
                // 处理文本内容
                if (key === '#text') {
                    xml += `${newIndent}${json[key]}\n`;
                    return;
                }

                const value = json[key];

                // 如果值是数组
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        xml += `${newIndent}<${key}>\n`;
                        xml += this.jsonToXml(item, newIndent + ' '.repeat(indentSize), false);
                        xml += `${newIndent}</${key}>\n`;
                    });
                }
                // 如果值是对象
                else if (typeof value === 'object' && value !== null) {
                    xml += `${newIndent}<${key}>\n`;
                    xml += this.jsonToXml(value, newIndent + ' '.repeat(indentSize), false);
                    xml += `${newIndent}</${key}>\n`;
                }
                // 基本类型值
                else {
                    xml += `${newIndent}<${key}>${value}</${key}>\n`;
                }
            });
        }
        // 处理基本类型
        else if (json !== undefined && json !== null) {
            xml += `${newIndent}${json}\n`;
        }

        return xml;
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: 'XML/JSON解析工具',
            path: '/pages/parser/parser'
        };
    }
})