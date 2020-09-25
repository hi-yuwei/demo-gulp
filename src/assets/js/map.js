var geolocation;

var mapModule = {
    getCity: function(obj) {
        $.ajax({
            url: common.signDomain + '/geocoder/v2/?ak=3CQdtnDG1kYCx5LST2vnKzh2Q74VkwpV&callback=renderReverse&location=' + obj.gpsStr + '&output=json&pois=1',
            type: 'get',
            dataType: 'jsonp',
            jsonpCallback: 'callback',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            success: function(data) {
                if (data) { obj.success && obj.success(data) }
            },
            error: function(error) {
                obj.error && obj.error()
            }
        })
    },

	setPosition: function(onComplete, onError) {
		map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'LB',
            buttonDom:'<div class="marker-route marker-marker-bus-from"></div>'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        onComplete && AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        onError && AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
	}
}