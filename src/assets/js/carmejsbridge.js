(function(win) {

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

	var appBridge = function(options){
        var defaults = {
            eleid: 'bridgeBtn',
            selectorType: 0, //0:id  1:class
            flag: 'sy',
            bridgeUrl: '//static.car-me.com/static/bridge.html?json=',
			bindEvent: 'touchend.click',
            extra: {}
        };
        var params = extend({}, defaults, options || {});
		var appobj = {flag:params.flag,extra:params.extra};
		var __jsonstr = JSON.stringify( appobj );
		//__jsonstr = encodeURI(__jsonstr);
		__jsonstr = encodeURIComponent(__jsonstr);
		var __iosurl = params.bridgeUrl + __jsonstr;

		var selectorEle = params.selectorType ? document.querySelectorAll("." + params.eleid) : document.querySelector("#" + params.eleid);
		//Internet Explorer/Edge ≤ 8
		if (document.all && !document.addEventListener) {
			if (params.selectorType) {
                for(var i=0,len = selectorEle.length;i<len;i++){
                    selectorEle[i].attachEvent("onclick", function(e) {
                        document.location.href = __iosurl;
                    });
                };
            } else {
                if (selectorEle) {
                    selectorEle.attachEvent("onclick", function(e) {
                        document.location.href = __iosurl;
                    });
                }
            }
		} else {
			function callCarmeAppBridge(e){
				e.preventDefault();
				e.stopPropagation();
				if (/Android/i.test(navigator.userAgent)) {
					if (typeof(win.CarmeAppNotify) == "undefined") {
						document.location.href = __iosurl;
					} else {
						win.CarmeAppNotify.carmeJsBridge(__jsonstr);
					}
				} else {
					document.location.href = __iosurl;
				}
			}
			if (params.selectorType) {
                for(var i=0,len = selectorEle.length;i<len;i++){
                    if (/touchend/i.test(params.bindEvent)) selectorEle[i].addEventListener("touchend", callCarmeAppBridge);
                    if (/click/i.test(params.bindEvent)) selectorEle[i].addEventListener("click", callCarmeAppBridge);
                };
            } else {
                if (selectorEle) {
                    if (/touchend/i.test(params.bindEvent)) selectorEle.addEventListener("touchend", callCarmeAppBridge);
                    if (/click/i.test(params.bindEvent)) selectorEle.addEventListener("click", callCarmeAppBridge);
                }
            }
		}
	}

	win.appBridge = appBridge;
})(window);