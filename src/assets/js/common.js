// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
    //author: meizz
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
}

var common = {
    domain: 'https://carmall.car-me.cn',
    signDomain: 'https://zjsinopec.car-me.com',
    carBrandDomain: 'https://carbrand.car-me.com/',
    esDomain: 'https://es.car-me.com',
    imgDomain: 'https://upload.car-me.com',
    erpDomain: 'https://erp.car-me.com',
    reportImgDomain: 'https://bld-erp-prod.oss-cn-shanghai.aliyuncs.com',
    objectRegular: /\[?{.+:.+}+\]?|\[.*\]|{.*}/,
    defaults: {
        car_id: '',
        client_id: 'h5',
        client_token: '9527',
        version: '2.0.1',
        timestamp: new Date().format('yyyy-MM-dd hh:mm:ss')
    },
    isAndroid: function () {
        return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
    },
    isiOS: function () {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },

    initDomain: function () {
        var env = this.getQuery().env
        if (env == 'dev3' || env == 'DEV3') {
            common.domain = 'http://dev3.carmall.car-me.cn'
            common.imgDomain = 'http://dev3.upload.car-me.com'
            common.esDomain = 'http://dev-es.car-me.com'
            common.erpDomain = 'http://dev-erp.car-me.com'
        }
        if (env == 'dev4' || env == 'DEV4') {
            common.domain = 'http://dev4.carmall.car-me.cn'
            common.imgDomain = 'http://dev4.upload.car-me.com'
            common.esDomain = 'http://dev-es.car-me.com'
            common.erpDomain = 'http://dev-erp.car-me.com'
        }
        if (env == 'dev5' || env == 'DEV5') {
            common.domain = 'http://dev5.carmall.car-me.cn'
            common.imgDomain = 'http://dev5.upload.car-me.com'
            common.esDomain = 'http://dev-es.car-me.com'
            common.erpDomain = 'http://dev-erp.car-me.com'
        }
        if (env == 'cte2' || env == 'CTE2') {
            common.domain = 'https://cte2-carmall.car-me.cn'
            common.imgDomain = 'https://cte2-upload.car-me.com'
            common.esDomain = 'https://cte2-es.car-me.com'
            common.erpDomain = 'https://cte2-erp.car-me.com'
            common.reportImgDomain = 'https://bld-erp-pic.oss-cn-shanghai.aliyuncs.com'
        }
        if (env == 'ste' || env == 'STE') {
            common.domain = 'https://ste-carmall.car-me.cn'
            common.imgDomain = 'https://ste-upload.car-me.com'
            common.esDomain = 'https://ste-es.car-me.com'
            common.erpDomain = 'https://ste-erp.car-me.com'
            common.reportImgDomain = 'https://bld-erp-ste.oss-cn-shanghai.aliyuncs.com'
        }
        if (env == 'ste2' || env == 'STE2') {
            common.domain = 'https://ste2-carmall.car-me.cn'
            common.imgDomain = 'https://ste-upload.car-me.com'
            common.esDomain = 'https://ste-es.car-me.com'
            common.erpDomain = 'https://ste-erp.car-me.com'
        }
    },

    getCarId: function () {
        var carId = common.getQuery().carId
        if (carId) {
            common.setStorage('carId', carId)
        } else {
            carId = common.getStorage('carId')
        }
        return carId
    },

    getUserToken: function () {
        var userToken = common.getQuery().appUserToken
        if (userToken) {
            // TODO，核实是否需要转化 decodeURIComponent(appUserToken.replace(/%20/g, '+'))
            common.setStorage('userToken', userToken)
        } else {
            userToken = common.getStorage('userToken')
        }
        return userToken
    },

    getAdminToken: function () {
        var adminToken = common.getQuery().adminToken
        if (adminToken) {
            // TODO，核实是否需要转化 decodeURIComponent(appUserToken.replace(/%20/g, '+'))
            common.setStorage('adminToken', adminToken)
        } else {
            adminToken = common.getStorage('adminToken')
        }
        return adminToken
    },

    getLatitude: function () {
        var latitude = common.getQuery().latitude
        if (latitude) {
            common.setStorage('latitude', latitude)
        } else {
            latitude = common.getStorage('latitude')
        }
        return latitude
    },

    getLongitude: function () {
        var longitude = common.getQuery().longitude
        if (longitude) {
            common.setStorage('longitude', longitude)
        } else {
            longitude = common.getStorage('longitude')
        }
        return longitude
    },

    get4SId: function () {
        var ssssId = common.getQuery().ssssId
        if (ssssId) {
            // TODO，核实是否需要转化 decodeURIComponent(appUserToken.replace(/%20/g, '+'))
            common.setStorage('ssssId', ssssId)
        } else {
            ssssId = common.getStorage('ssssId')
        }
        return ssssId
    },

    // 设置默认公参
    setDefaultParam: function () {
        var isApp = !!common.device().isCarmeApp || common.getQuery().activityFromApp == '1'
        this.defaults.car_id = this.getCarId()
        this.defaults.user_token = this.getUserToken()
        this.defaults.ssss_id = this.get4SId()
        var device = this.device()
        // 设置默认值
        var clientId = 'h5'
        if (device.isAndroid && isApp) {
            clientId = 'android'
        }
        if (device.isIphone && isApp) {
            clientId = 'ios'
        }
        this.defaults.client_id = clientId
    },

    ajax: function (obj) {
        if (obj.hasSign) {
            this.setDefaultParam() // 设置默认公参
            obj.param = $.extend(true, {}, this.defaults, obj.param || {})
            obj = obj || {}
            //加签
            var signUrl = 'https://zjsinopec.car-me.com/sign/Sign.php?_=' + +new Date() + '&callback=' + location.href // 签名地址
            var signParam = JSON.stringify(obj.param)
            var that = this
            $.ajax({
                url: signUrl,
                type: 'post',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: signParam,
                success: function (data) {
                    obj.param.sign = data.result.signature
                    that._signSuccess(obj)
                },
                error: function (error) {
                    that._signSuccess(obj)
                }
            })
        } else {
            obj = obj || {}
            var adminToken = this.getAdminToken()
            var userToken = this.getUserToken()
            if (userToken && obj.param) {
                obj.param.userToken = userToken
            }
            var type = obj.method ? obj.method : 'post'
            $.ajax({
                url: obj.url,
                type: type,
                dataType: 'json',
                data: JSON.stringify(obj.param),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    adminToken: adminToken
                },
                success: function (data) {
                    if (data) {
                        if (data.code == 2) {
                            if (!!common.device().isCarmeApp || common.getQuery().activityFromApp == '1') {
                                window.appBridgeNoEvent({
                                    flag: 'login'
                                })
                            } else {
                                location.href = '/src/pages/user/login.html?env=' + common.getQuery().env + '&ssssId=' + common.getQuery().ssssId
                            }
                        } else {
                            obj.success && obj.success(data)
                        }
                    }
                },
                error: function (error) {
                    obj.error && obj.error()
                }
            })
        }
    },

    _signSuccess: function (obj) {
        var type = obj.method ? obj.method : 'post'
        $.ajax({
            url: obj.url,
            type: type,
            dataType: 'json',
            data: JSON.stringify(obj.param),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            success: function (data) {
                if (data) {
                    obj.success && obj.success(data)
                }
            },
            error: function (error) {
                obj.error && obj.error()
            }
        })
    },

    m2km: function (value) {
        if (value < 1000) return value + 'm'
        else if (value >= 1000 && value <= 20000) return (value / 1000).toFixed(1) + 'km'
        else if (value >= 2000) return '>20km'
        return value
    },

    // 设置 cookie
    setCookie: function (name, value, hours) {
        var str = name + '=' + this._json2string(value)
        if (hours && hours > 0) {
            var date = new Date()
            date.setTime(date.getTime() + hours * 3600 * 1000)
            str += '; expires=' + date.toUTCString()
        }
        document.cookie = str
    },

    // 获取 cookie
    getCookie: function (name) {
        var rs = ''
        var name = name + '='
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) != -1) {
                rs = this._string2json(c.substring(name.length, c.length))
            }
        }
        return rs
    },

    // 清除 cookie
    delCookie: function (name) {
        var date = new Date()
        date.setTime(date.getTime() - 10000)
        document.cookie = name + '=a; expires=' + date.toGMTString()
    },

    // 获取 localStorage 中指定的变量
    getStorage: function (name) {
        return this._string2json(window.localStorage[name])
    },

    // 设置或添加localStorage中指定的变量
    setStorage: function (name, value) {
        window.localStorage[name] = this._json2string(value)
    },

    // 删除localStorage中指定的变量
    delStorage: function (name) {
        window.localStorage.removeItem(name)
    },

    // json转string
    _json2string: function (value) {
        var strVal = JSON.stringify(value)
        return this.objectRegular.test(strVal) ? strVal : value
    },

    // string转json
    _string2json: function (value) {
        return this.objectRegular.test(value) ? JSON.parse(value) : value
    },
    /**
     * 获取App信息
     */
    detectApp: function () {
        var ua = navigator.userAgent
        //RegExp.$1; RegExp.$2; RegExp.$3;
        //var info = ua.match(/(CarmeApp)\s*[v]*(\d+\.\d+\.\d+)\s*\/\s*(IOS|Android)/i)
        ua.match(/(CarmeApp)\s*[v]*(\d+\.\d+\.\d+)\s*\/\s*(IOS|Android)/i)
        return {
            appName: RegExp.$1,
            appVersion: RegExp.$2,
            appOS: RegExp.$3
        }
    },

    //解析url参数
    getQuery: function () {
        var query = window.location.search.split('?')
        query = query.length > 1 ? query[1].split('&') : []

        var json = {}
        for (var i = 0, len = query.length; i < len; i++) {
            var key = query[i].split('=')[0],
                index = query[i].indexOf('='),
                value = query[i].substr(index + 1)
            json[key] = value
        }
        return json
    },
    //登录态判断
    isLogin: function (appUserToken, hasLogin, notLogin) {
        if (appUserToken) {
            //判断是否过期
            this.ajax({
                url: this.domain + '/rest/user/checkLogin.json',
                hasSign: true,
                data: {
                    type: '1',
                    user_token: appUserToken
                },
                success: function (data) {
                    if (data.result && data.result.is_expired == '0') {
                        hasLogin && hasLogin()
                    } else {
                        //过期去登录
                        notLogin && notLogin()
                    }
                }
            })
        } else {
            //去登录
            notLogin && notLogin()
        }
    },
    // ios版本判断 <9返回false
    isIOS9: function () {
        //获取固件版本
        var getOsv = function () {
            var reg = /OS ((\d+_?){2,3})\s/
            if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
                var osv = reg.exec(navigator.userAgent)
                if (osv.length > 0) {
                    return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.')
                }
            }
            return ''
        }
        var osv = getOsv()
        var osvArr = osv.split('.')
        //初始化显示ios9引导
        if (osvArr && osvArr.length > 0) {
            if (parseInt(osvArr[0]) >= 9) {
                return true
            }
        }
        return false
    },

    // 兼容适配小机型
    adaptSmallModel: function (callback) {
        if (!this.isIOS9()) {
            $('meta[name=viewport]').attr('content', 'user-scalable=no,width=225,initial-scale=1,maximum-scale=1.0')
            callback && callback()
        }
    },

    /**
        @desc：只能输入浮点数
        @param {fixed} number 保留小数位
    **/
    formatFloat: function (value, max, fixed) {
        if (value) {
            fixed = fixed || 2
            var regular1 = new RegExp('^(\\d+(\\.\\d{' + (fixed - 1) + ',' + fixed + '})?)$')
            var regular2 = new RegExp('^(\\d+(.\\d{0,' + fixed + '})?\\d{0,' + (fixed - 1) + '}?)')
            if (!regular1.test(value)) {
                var mths = regular2.exec(value)
                value = mths == null ? null : mths[0]
                if (value && value.length >= 1) {
                    if (!/^[0-9.]*$/.test(value)) {
                        value = value.substr(0, value.length - 1)
                    }
                }
            }
            if (max && value > max) {
                value = max
            }
        }
        return value
    },

    controlValue: function (value, max, min) {
        if (max && value > max) {
            value = max
        }
        if (min && value < min) {
            value = min
        }
        return value
    },

    isEmptyObject: function (obj) {
        var name
        for (name in obj) {
            return false
        }
        return true
    },

    // 获取设备类型
    device: function () {
        var ua = navigator.userAgent
        return {
            isChrome: ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            isAndroid: ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            isIphone: ua.indexOf('iPhone') != -1,
            isWeixin: ua.match(/MicroMessenger/i),
            isCarmeApp: ua.match(/CarmeApp/i)
        }
    },

    // 设置title
    setTitle: function (title) {
        var device = this.device()
        if (device.isIphone && device.isWeixin) {
            document.title = title
            var i = document.createElement('iframe')
            i.src = '/favicon.ico'
            i.style.display = 'none'
            i.onload = function () {
                setTimeout(function () {
                    i.remove()
                }, 9)
            }
            document.body.appendChild(i)
        } else {
            document.title = title
        }
    },

    getUuid: function () {
        var uuid = common.getStorage('uuid')
        if (!uuid) {
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
            common.setStorage('uuid', uuid)
        }
        return uuid
    },
    /* 防抖函数 用法举例
		function success(){
			console.log('提交成功');
		}
		let aaa = debounce(success,500)
		let btn = document.querySelector('.btn')
		btn.addEventListener('click',aaa)
	*/
    debounce: function (fn, delay) {
        /*         var timer = null
        return () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn()
            }, delay)
        } */
    },
    // iphone 刘海屏 初始化导航栏高度 header 类名  headerH 头部高度 box 主题内容类名
    initHeader: function (header, headerH, box, pt) {
        // iPhone X、iPhone XS
        var isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812
        // iPhone XS Max
        var isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896
        // iPhone XR
        var isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896

        if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) {
            $(header).css('paddingTop', '20px !important')
            var headerHeight = $(headerH).css('height')
            console.log($(headerH))
            $(box).css('paddingTop', headerHeight + '!important')
        }
    }
}

common.initDomain()
