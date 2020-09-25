(function(window, $) {
	//#var appid = 'wx63cc0cae01f0b64b';

    var carmeWxShare = function(options){
        var defaults = {
            title: '',
            imgUrl: '',
            desc: '',
            source: '',
            link: window.location.href
        };
        var params = $.extend({}, defaults, options || {});
		common.ajax({
			url: common.erpDomain + "/weixin/getWeixinJsConfig?s=" + params.source + '&wxurl=' + encodeURIComponent(params.link),
			param:{
				// s: params.source,  // 来源 比心二手车公众号
				// wxurl: params.link
			},
			success: function(res){
				console.log(res)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId:res.result.appId, // 必填，公众号的唯一标识
					timestamp: res.result.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
					signature: res.result.signature,// 必填，签名
					jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareWeibo','onMenuShareQQ']
				})
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
					}
					wx.onMenuShareTimeline(shareData);
					wx.onMenuShareAppMessage(shareData);
					wx.onMenuShareQQ(shareData);
					wx.onMenuShareWeibo(shareData);
					
					// wx.updateAppMessageShareData({ 
					//     title: '', // 分享标题
					//     desc: '', // 分享描述
					//     link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					//     imgUrl: '', // 分享图标
					//     success: function () {
					//       // 设置成功
					//     }
					// })
					
				});
				wx.error(function(res){
				  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				});
			}
		})
		console.log(params)

        // $.ajax({
        //     url: common.erpDomain + "/weixin/getWeixinJsConfig?s="+params.source,
        //     dataType: "json",
        //     data:{
        //         wxurl: params.link
        //     },
        //     type: "post",
        //     success: function(data){
        //         wx.config({
        //             //debug: true,
        //             appId: data.appId,
        //             timestamp: data.timestamp,
        //             nonceStr: data.nonceStr,
        //             signature: data.signature,
        //             jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareWeibo','onMenuShareQQ']
        //         });
        //         wx.ready(function(){
        //             var shareData = {
        //                 title: params.title,
        //                 desc:  params.desc,
        //                 link:  params.link,
        //                 imgUrl:  params.imgUrl,
        //                 success: function () {
        //                 },
        //                 cancel: function () {
        //                 }
        //             };

        //             wx.onMenuShareTimeline(shareData);
        //             wx.onMenuShareAppMessage(shareData);
        //             wx.onMenuShareQQ(shareData);
        //             wx.onMenuShareWeibo(shareData);

        //             /*
        //             wx.onMenuShareAppMessage({
        //                 title: params.title,
        //                 desc:  params.desc,
        //                 link:  params.link,
        //                 imgUrl:  params.imgUrl,
        //                 type: 'link',
        //                 dataUrl: '',
        //                 success: function () {},
        //                 cancel: function () {}
        //             });
        //             */
        //         });
        //     }
        // });
    };

    window.carmeWxShare = carmeWxShare;
})(window, Zepto);
