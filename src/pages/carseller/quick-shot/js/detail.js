$(function () {
    var headerSwiper,
        env = common.getQuery().env,
        carId = common.getQuery().carId,
        supplierId = common.getStorage('userId'),
        InterValObj = null,
        newPriceBase = 100,
        newBidStarPrice = 0,
        newMaximumPrice = 0

    var envStr = ''
    if (env) {
        envStr = 'env=' + env
    }

    var initModule = {
        init: function () {
            this.loadDatail()
            this.bigImgSwiper()
            this.handleClick()
            this.depositInfo()
        },
        loadDatail: function () {
            var that = this
            common.ajax({
                url: common.erpDomain + '/carDealer/fastUsedCar/detail',
                param: {
                    id: carId
                },
                success: function (res) {
                    console.log(res.result)
                    if (res.code === '1') {
                        let { imageList, bidInfo, title, registerDate, apparentMileage, city, standard, maximumPrice, carInfo, checkInfo } = res.result
                        that.addHeaderSwiper(imageList)
                        that.addBidInfo(bidInfo)
                        that.addCarInfo(title, registerDate, apparentMileage, city, standard)

                        // 拍卖  + (bidInfo.bidStarPrice ? bidInfo.bidStarPrice : 0) +
                        var auctionTtml =
                            '<li style="color: #FA5767;"><span>留</span>¥******</li>' + '<li style="color: #FA5767;"><span>加</span>¥100</li>' + '<li style="color: #FA5767;"><span>保</span>¥1000</li>' + '<li style="color: #FA5767;"><span>延</span>5min</li>'
                        $('.auction-statement .wrapper1 ul').html(auctionTtml)

                        // 最高价
                        var maxPriceHtml = ''
                        if (maximumPrice.price) {
                            newMaximumPrice = Number(maximumPrice.price)

                            maxPriceHtml =
                                // '<div class="flex-center">' +
                                // '<img src="../img/brandImage/11.png" class="user-ava">' +
                                '<div>' + '<p class="user-name">' + maximumPrice.userName + '</p>' + '<p class="time">' + maximumPrice.time + '</p>' + '</div>' + '</div>' + '<div class="price">￥' + maximumPrice.price + '</div>'
                        } else {
                            maxPriceHtml = '<div>暂无出价</div>'
                        }
                        $('.maximum_price_box .maximum_price_user').html(maxPriceHtml)

                        // 基本信息
                        var basicHtml = ''
                        basicHtml =
                            '<ul class="flex-between info-wrapper"><li>' +
                            '<p>VIN</p>' +
                            '<p>' +
                            (carInfo.vinNo ? carInfo.vinNo : '暂无') +
                            '</p>' +
                            '</li>' +
                            '<li>' +
                            '<p>过户次数</p>' +
                            '<p>' +
                            (carInfo.transfersNumber ? carInfo.transfersNumber : '暂无') +
                            '</p>' +
                            '</li></ul>' +
                            '<ul class="flex-between info-wrapper"><li>' +
                            '<p>出厂年月</p>' +
                            '<p>' +
                            (carInfo.factoryDate ? carInfo.factoryDate : '暂无') +
                            '</p>' +
                            '</li>' +
                            '<li>' +
                            '<p>年检到期</p>' +
                            '<p>' +
                            (carInfo.inspectionExpireDate ? carInfo.inspectionExpireDate : '暂无') +
                            '</p>' +
                            '</li>' +
                            '<li>' +
                            '<p>强险到期</p>' +
                            '<p>' +
                            (carInfo.strongRiskExpireDate ? carInfo.strongRiskExpireDate : '暂无') +
                            '</p>' +
                            '</li></ul>'
                        // $('.basic-info .info-wrapper').html(basicHtml);
                        $('.basic-ul').html(basicHtml)
                        $('.more-car-info').data('url', carInfo.carCollocate)

                        // 检测师信息
                        if (checkInfo.evaluateId) {
                            $('.car-detection').removeClass('hide')
                            var detectionUserHtml = ''
                            // ''
                            let imgUrl = '../img/detectionImg.png'
                            if (checkInfo.headImg !== undefined) {
                                imgUrl = checkInfo.headImg
                            }
                            detectionUserHtml = '<div><img src="' + imgUrl + '"></div>' + '<div>' + '<p class="name">' + checkInfo.name + '</p>' + '<p class="desc">4S店专业检测师</p>' + '</div>'
                            $('.car-detection .detectio-user').html(detectionUserHtml)
                            $('.car-detection .detectio-desc').html(checkInfo.evaluate)
                            $('.car-detection .more-btn').data('id', carId)
                        } else {
                            $('.car-detection').addClass('hide')
                        }

                        if (!$('.mask-modal-box').hasClass('hide')) {
                            $('.mask-modal-box .offer-price .price').text('￥' + newMaximumPrice)
                        }
                    }
                }
            })
        },
        addCarInfo: function (title, date, mileage, city, standard) {
            let that = this
            let html = '',
                dateStr = '',
                mileageStr = '',
                cityStr = '',
                standardStr = ''
            if (date) {
                dateStr = date + ' / '
            }
            if (mileage) {
                mileageStr = mileage + '万公里' + ' / '
            }
            if (city) {
                cityStr = city + ' / '
            }
            if (standard) {
                standardStr = standard
            }
            html = '<div class="title">' + title + '</div>' + '<div class="condition">车况：' + dateStr + mileageStr + cityStr + standardStr + '</div>'

            $('.car-info').html(html)
        },
        addBidInfo: function (info) {
            // bidState 0：已下架，1：已拍卖，2：未开始，3：竞拍中，4：已流拍
            console.log('拍卖信息')
            console.log(info)
            let that = this
            let html = ''
            if (info.bidState === 0 || info.bidState === 1 || info.bidState === 4) {
                html = '<div class="car-bid-status bg3">' + '<div>' + that.bidState(info.bidState) + '</div>' + '</div>'
                $('.footer-btn').addClass('hide')
            } else if (info.bidState === 2) {
                $('.footer-btn').removeClass('hide')
                html = '<div class="car-bid-status bg2">' + '<div>起拍价：' + info.bidStarPrice + '</div>' + '<div>' + '<div>' + info.bidStarTime + '</div>' + '<div>开始</div>' + '</div>' + '</div>'
            } else if (info.bidState === 3) {
                $('.footer-btn').removeClass('hide')
                html = '<div class="car-bid-status bg1">' + '<div>' + that.bidState(info.bidState) + '</div>' + '<div class="state-right">' + '<div>距结束</div>' + '<div class="time"></div>' + '</div>' + '</div>'
                var SysSecond = Number(info.endTimestamp) - Number(info.nowTimestamp)
                if (SysSecond > 0) {
                    that.cutDown(info)
                }
            }
            newBidStarPrice = info.bidStarPrice ? Number(info.bidStarPrice) : 0
            $('.bid-info').html(html)
        },
        addHeaderSwiper: function (list) {
            console.log('轮播图')
            console.log(list)
            let that = this
            let html = ''
            list.map(item => {
                html += '<div class="swiper-slide" data-img-url="' + item.url + '" data-img-txt="' + that.imgTypeFormat(item.type) + '">' + '<img src="' + item.url + '" >' + '<div class="car-type">' + that.imgTypeFormat(item.type) + '</div>' + '</div>'
            })
            $('.header-swiper .swiper-wrapper').html(html)

            if (list.length > 0) {
                headerSwiper = new Swiper('.header-swiper', {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction'
                    },
                    autoplay: true, //可选选项，自动滑动
                    delay: 3000
                })
            }
            that.openBigImg()
        },
        // 大图-start
        bigImgSwiper: function () {
            let myBigSwiper = new Swiper('.showBigImgWrap', {
                // pagination: {
                // 	el: '.swiper-pagination',
                // 	type: 'fraction',
                // },
            })
            $('.showBigImg').click(function () {
                $('.showBigImg').css('display', 'none') //显示
            })
        },
        openBigImg: function () {
            var that = this
            var $img = $('.header-swiper .swiper-wrapper .swiper-slide')
            $img.on('click', function () {
                var arr = []
                $img.each(function () {
                    let obj = {
                        name: $(this).data('img-txt'),
                        url: $(this).data('img-url')
                    }
                    arr.push(obj)
                })
                that.bigImgSlide(arr, $img.index(this))
            })
        },
        bigImgSlide: function (scArr, posi) {
            $('.showBigImg').css('display', 'block') //显示
            var str = ''
            for (var i = 0; i < scArr.length; i++) {
                str += '<div class="imgIte swiper-slide" style="color:#fff;text-align:center">' + scArr[i].name + '<img src=' + scArr[i].url + ' alt="" style="height:auto"></div>'
            }
            $('.allImgBox').html(str)
            myBigSwiper.update()
            myBigSwiper.slideTo(posi, 0)
        },
        // 大图-end
        handleClick: function () {
            let that = this
            $('.auction-statement .wrapper1').click(function () {
                layer.open({
                    className: 'auction-layer',
                    type: 1,
                    content:
                        '<div class="auction-wrapper-tip">' +
                        '<div class="title">拍卖说明</div>' +
                        '<ul>' +
                        '<li><span>留</span><span>保留价</span></li>' +
                        '<li><span>加</span><span>每次出价的最低加价幅度</span></li>' +
                        '<li><span>保</span><span>参与拍卖需冻结的保证金金额</span></li>' +
                        '<li><span>延</span><span>弱商品截拍前5分钟内有人出价，截拍时间延长到5分钟</span></li>' +
                        '</ul>' +
                        // '<button>我知道了</button>' +
                        '</div>',
                    anim: 'up',
                    style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; padding:10px 0 0; border:none;',
                    btn: ['我知道了']
                })
            })
            // 刷新出价
            $('.maximum_price_box .refresh-btn').click(function () {
                that.loadDatail()
            })
            // 更多车辆信息
            $('.more-car-info').click(function () {
                let url = $(this).data('url')
                location.href = url
            })
            // 检测报告
            $('.car-detection .more-btn').click(function () {
                let id = $(this).data('id')
                location.href = './test-report.html?carId=' + id + '&' + envStr
            })
            // 缴纳保证金
            $('.footer-btn .payPrice').click(function () {
                location.href = '../caution-money/caution-money.html?' + envStr
            })
            $('.footer-btn .offerPrice').click(function () {
                $('.mask-modal-box').removeClass('hide')
                addNewPriceBase = newPriceBase
                var str = ''
                str =
                    '<div class="offer-price">' +
                    '<p class="title">领先价</p>' +
                    '<p class="price">￥' +
                    (newMaximumPrice ? newMaximumPrice : newBidStarPrice) +
                    '</p>' +
                    '<div class="flex-center">' +
                    '<div class="reduce-btn decrease">-</div>' +
                    '<div class="price-base">￥' +
                    newPriceBase +
                    '</div>' +
                    '<div class="reduce-btn increase">+</div>' +
                    '</div>' +
                    '</div>' +
                    '<button class="btn">确认出价</button>'
                $('.mask-modal-box .mask-modal-content').html(str)
            })
            $('.mask-modal-bg').click(function () {
                $('.mask-modal-box').addClass('hide')
            })
            $('body').on('click', '.mask-modal-box .decrease', function () {
                let price = newPriceBase
                if (addNewPriceBase <= newPriceBase) {
                    return
                }
                addNewPriceBase -= price
                $('.mask-modal-box .price-base').text('￥' + addNewPriceBase)
            })
            $('body').on('click', '.mask-modal-box .increase', function () {
                let price = newPriceBase
                addNewPriceBase += price
                $('.mask-modal-box .price-base').text('￥' + addNewPriceBase)
            })
            $('body').on('click', '.mask-modal-box .btn', function () {
                var layerLoading = layer.open({ type: 2 })
                let max_price = newMaximumPrice ? newMaximumPrice : newBidStarPrice
                let price = max_price + addNewPriceBase

                let param = {
                    id: carId,
                    price: price
                }
                common.ajax({
                    url: common.erpDomain + '/carDealer/fastUsedCar/confirmedBid',
                    param: param,
                    success: function (res) {
                        layer.close(layerLoading)
                        if (res.code === '1' && res.success) {
                            $('.mask-modal-box').addClass('hide')
                            that.loadDatail()
                            that.depositInfo()
                            return
                        }
                        layer.open({
                            content: res.message,
                            skin: 'msg',
                            style: 'top: 0;',
                            time: 2 //2秒后自动关闭
                        })
                        // if (res.code === '-2') {
                        setTimeout(function () {
                            that.loadDatail()
                        }, 1000)
                        $('.mask-modal-box').addClass('hide')
                        // }
                    }
                })
            })
        },
        // 查询保证金信息
        depositInfo: function () {
            let param = {
                id: supplierId
            }
            common.ajax({
                url: common.erpDomain + '/carDealer/deposit/info',
                param: param,
                success: function (res) {
                    if (res.code === '1') {
                        let { useablePrice } = res.result
                        if (Number(useablePrice) >= 0.02) {
                            $('.footer-btn .offerPrice').removeClass('hide')
                            $('.footer-btn .payPrice').addClass('hide')
                        } else {
                            $('.footer-btn .offerPrice').addClass('hide')
                            $('.footer-btn .payPrice').removeClass('hide')
                        }
                    } else {
                        if (res.code == '100004') {
                            location.href = '../user/new_login.html?' + envStr + '&redirect=' + encodeURIComponent(window.location.href)
                        }
                    }
                }
            })
        },
        //倒计时
        cutDown: function (data) {
            window.clearInterval(InterValObj)
            var that = this
            var SysSecond = Number(data.endTimestamp) - Number(data.nowTimestamp)

            $(document).ready(function () {
                InterValObj = window.setInterval(SetRemainTime, 1000) //间隔函数，1秒执行
            })

            function SetRemainTime() {
                if (SysSecond > 0) {
                    SysSecond = SysSecond - 1000
                    var day = that.strFormat(Math.floor(SysSecond / 1000 / 60 / 60 / 24)) //计算天
                    var hour = that.strFormat(Math.floor((SysSecond / 1000 / 60 / 60) % 24)) //计算小时
                    var minite = that.strFormat(Math.floor((SysSecond / 1000 / 60) % 60)) //计算分
                    var second = that.strFormat(Math.floor((SysSecond / 1000) % 60)) // 计算秒
                    var endStr = ''
                    if (day > 0) {
                        endStr = day + ':' + hour + ':' + minite + ':' + second
                    } else if (hour > 0) {
                        endStr = hour + ':' + minite + ':' + second
                    } else if (minite > 0) {
                        endStr = minite + ':' + second
                    } else if (second > 0) {
                        endStr = '00:' + second
                    } else {
                        //倒计时已完成
                    }
                    $('.bid-info .car-bid-status .state-right .time').html(endStr)
                } else {
                    //剩余时间小于或等于0的时候，就停止间隔函数
                    that.init()
                    window.clearInterval(InterValObj)
                }
            }
        },
        strFormat: function (str) {
            return str < 10 ? `0${str}` : str
        },
        imgTypeFormat: function (type) {
            if (type === 1) {
                return '车头'
            } else if (type === 2) {
                return '左侧45度'
            } else if (type === 3) {
                return '车尾'
            } else if (type === 4) {
                return '右侧45度'
            } else if (type === 5) {
                return '前排座椅'
            } else if (type === 6) {
                return '后排座椅'
            } else if (type === 7) {
                return '前部空间全景'
            } else if (type === 8) {
                return '仪表盘'
            } else if (type === 9) {
                return '后备箱全景'
            } else if (type === 10) {
                return '后备箱底板'
            } else if (type === 11) {
                return '发动机舱'
            } else if (type === 12) {
                return '铭牌'
            }
        },
        bidState(type) {
            if (type === 0) {
                return '已下架'
            } else if (type === 1) {
                return '已拍卖'
            } else if (type === 2) {
                return '未开始'
            } else if (type === 3) {
                return '竞拍中'
            } else if (type === 4) {
                return '已流拍'
            }
        },
        /* 获取维保记录 */
        getReport() {
            common.ajax({
                url: common.erpDomain + '/carDealer/fastUsedCar/detail',
                param: {
                    id: carId
                },
                success: function (res) {
                    if (true) {
                        // 有维保记录
                        this.getUserBuyReport()
                    }
                }
            })
        },
        /* 获取用户是否已经购买过报告 */
        getUserBuyReport() {
            common.ajax({
                url: common.erpDomain + '/carDealer/fastUsedCar/detail',
                param: {
                    id: carId
                },
                success: function (res) {
                    //显示模块
                    var reportDom = document.querySelector('.js-report')
                    reportDom.style.display = 'block'

                    if (true) {
                        //购买过
                        var reportDetails = document.querySelector('.js-report-details')
                        reportDetails.style.display = 'block'
                        reportDetails.addEventListener('click', function () {
                            window.location.href = ''
                        })
                    } else {
                        //没有购买过
                        var reportBuy = document.querySelector('.js-report-buy')
                        reportBuy.style.display = 'block'
                    }
                }
            })
        }
    }
    initModule.init()
})
