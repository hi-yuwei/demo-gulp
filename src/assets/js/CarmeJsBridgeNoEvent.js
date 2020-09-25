(function() {
    var ua = navigator.userAgent;
    var device = {
        isChrome: ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        isAndroid: ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        isIphone: ua.indexOf('iPhone') != -1,
        isWeixin: ua.match(/MicroMessenger/i)
    }

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

    var appBridge = function(options) {
        var defaults = {
            eleid: 'bridgeBtn',
            flag: 'sy',
            bridgeUrl: '//static.car-me.com/static/bridge.html?json=',
            bindEvent: 'touchend.click',
            preExec:function(){},
            extra: {}
        };
        var params = extend({}, defaults, options || {});
        var appobj = {
            flag: params.flag,
            extra: params.extra
        };
        var __jsonstr = JSON.stringify(appobj);
        __jsonstr = encodeURIComponent(__jsonstr);
        var __iosurl = params.bridgeUrl + __jsonstr;

        // var selectorEle = document.querySelector("#"+params.eleid);
        //Internet Explorer/Edge ≤ 8

        function callCarmeAppBridge() {
            // e.preventDefault();
            // e.stopPropagation();
            params.preExec()
            if (/Android/i.test(navigator.userAgent)) {
            if (typeof(window.CarmeAppNotify) == "undefined") {
                document.location.href = __iosurl;
            } else {
                window.CarmeAppNotify.carmeJsBridge(__jsonstr);
            }
            } else {
                document.location.href = __iosurl;
            }
        }

        callCarmeAppBridge();
    }

    window.appBridgeNoEvent = appBridge
}())