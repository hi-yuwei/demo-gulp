(function(win) {

    var ua = navigator.userAgent;
    var device = {
            isChrome: ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            isAndroid: ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            isIphone: ua.indexOf('iPhone') != -1,
            isWeixin: ua.match(/MicroMessenger/i)
        }
        //app下载
    var mobileAppInstall = (function() {
        var loadIframe;

        function getIntentIframe() {
            alert(loadIframe)
            if (!loadIframe) {
                var iframe = document.createElement("iframe");
                iframe.style.cssText = "display:none;width:0px;height:0px;";
                document.body.appendChild(iframe);
                loadIframe = iframe;
            }
            return loadIframe;
        }


        var appInstall = {

            timeout: 1000,
            // *
            //  * 尝试跳转appurl,如果跳转失败，进入h5url
            //  * @param {Object} appurl 应用地址
            //  * @param {Object} h5url  http地址应用宝地址

            open: function(appurl, h5url) {
                var t = Date.now();
                appInstall.openApp(appurl);
                setTimeout(function() {
                    alert(Date.now() - t)
                    if (Date.now() - t < appInstall.timeout + 100) {
                        h5url && appInstall.openH5(h5url);
                    }
                }, appInstall.timeout)
            },
            openApp: function(appurl) {
                alert(appurl)
                if (device.isAndroid) {
                    getIntentIframe().src = 'baolide://com.baolide.me/launch';
                } else if (device.isIphone) {
                    win.location.href = appurl;
                }
            },
            openH5: function(h5url) {
                win.location.href = h5url;
            }
        }

        return appInstall;
    })();

    var extend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    };


    var gotoApp = function(options) {
        var defaults = {
            applicationUrl:'carmeuser://native',
            gotocontext: false,
            tracking: false,
            bindEvent: 'touchend.click',
            appleUrl: 'https://itunes.apple.com/cn/app/id1123301753',
            androidUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.carme.caruser',
            weixinUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.carme.caruser'
        };
        var params = extend({}, defaults, options || {});
        var gotocontext = params.gotocontext,
            appleUrl = params.appleUrl,
            androidUrl = params.androidUrl,
            weixinUrl = params.weixinUrl;

        var url = appleUrl;
        device.isAndroid && (url = androidUrl);
        device.isWeixin && (url = weixinUrl);

        if (gotocontext) {
            ele = document.querySelectorAll(gotocontext);
            for (var i = 0, len = ele.length; i < len; i++) {
                if (/touchend/i.test(params.bindEvent)){
                    ele[i].addEventListener('touchend', function(e) {
                        e.stopPropagation();
                        mobileAppInstall.open(params.applicationUrl, url);
                    });
                }else if(/click/i.test(params.bindEvent)){
                    ele[i].addEventListener('click', function(e) {
                        mobileAppInstall.open(params.applicationUrl, url);
                    });
                }
            }

        } else {
            mobileAppInstall.open(params.applicationUrl, url);
        }

        if (params.tracking){
            if(typeof TDAPP == "object"){
                if (params.trackingId == undefined) params.trackingId = "clickh5download20160922";
                if (params.trackingLabel == undefined) params.trackingLabel = "点击下载";
                TDAPP.onEvent(params.trackingId,params.trackingLabel);
            }
        }
    }

    var gotoSellerApp = function(options) {
        var defaults = {
            gotocontext: false,
            tracking: false,
            bindEvent: 'touchend.click',
            appleUrl: 'https://itunes.apple.com/cn/app/id1123877887',
            androidUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.carme.carmerchant',
            weixinUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.carme.carmerchant'
        };
        var params = extend({}, defaults, options || {});
        var gotocontext = params.gotocontext,
            appleUrl = params.appleUrl,
            androidUrl = params.androidUrl,
            weixinUrl = params.weixinUrl;

        var url = appleUrl;
        device.isAndroid && (url = androidUrl);
        device.isWeixin && (url = weixinUrl);

        if (gotocontext) {
            ele = document.querySelectorAll(gotocontext);
            for (var i = 0, len = ele.length; i < len; i++) {
                if (/touchend/i.test(params.bindEvent)){
                    ele[i].addEventListener('touchend', function(e) {
                        e.stopPropagation();
                        mobileAppInstall.open(params.applicationUrl, url);
                    });
                }else if(/click/i.test(params.bindEvent)){
                    ele[i].addEventListener('click', function(e) {
                        mobileAppInstall.open(params.applicationUrl, url);
                    });
                }
            }

        } else {
            mobileAppInstall.open(params.applicationUrl, url);
        }

        if (params.tracking){
            if(typeof TDAPP == "object"){
                if (params.trackingId == undefined) params.trackingId = "clickh5downloadseller170705";
                if (params.trackingLabel == undefined) params.trackingLabel = "点击下载商家端";
                TDAPP.onEvent(params.trackingId,params.trackingLabel);
            }
        }
    }

    win.gotoApp = gotoApp;
    win.gotoSellerApp = gotoSellerApp;
})(window);