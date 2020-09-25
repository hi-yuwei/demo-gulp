(function(window, $) {
	//#var appid = 'wx63cc0cae01f0b64b';

    var carmeWxShare = function(options){
        var defaults = {
            title: '卡咪.生活不仅于此',
            imgUrl: 'http://www.car-me.com/img/wx.jpg',
            desc: '卡咪.高端品质生活服务标准制定者',
            source: 'carme',
            link: window.location.href
        };
        var params = $.extend({}, defaults, options || {});

        $.ajax({
            url: "https://zjsinopec.car-me.com/sign/weixinSDKConfig.php?s="+params.source,
            dataType: "json",
            data:{
                wxurl: params.link
            },
            type: "post",
            success: function(data){
                wx.config({
                    //debug: true,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareWeibo','onMenuShareQQ']
                });
                wx.ready(function(){
                    var shareData = {
                        title: params.title,
                        desc:  params.desc,
                        link:  params.link,
                        imgUrl:  params.imgUrl,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    };

                    wx.onMenuShareTimeline(shareData);
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareQQ(shareData);
                    wx.onMenuShareWeibo(shareData);

                    /*
                    wx.onMenuShareAppMessage({
                        title: params.title,
                        desc:  params.desc,
                        link:  params.link,
                        imgUrl:  params.imgUrl,
                        type: 'link',
                        dataUrl: '',
                        success: function () {},
                        cancel: function () {}
                    });
                    */
                });
            }
        });
    };

    window.carmeWxShare = carmeWxShare;
})(window, Zepto);
