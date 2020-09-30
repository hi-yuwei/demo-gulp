window.$(function () {
    var mescroll,
        type = window.$('.js-tab li.selected').data('id'),
        // supplierId = window.common.getQuery().supplierId,
        env = window.common.getQuery().env,
        addressCode = '',
        brandCode = ''

    window.common.setStorage('userToken', 'a2b1712huyoo2wcfwh6ygpym')

    var initModule = {
        init: function () {
            this.loadMescroll()
            this.handleClick()
            this.getCityAddress()
        },
        loadMescroll: function () {
            var self = this
            mescroll = new window.MeScroll('mescroll', {
                down: {
                    callback: self.refresh
                },
                up: {
                    callback: self.loadData,
                    page: {
                        num: 0,
                        size: 20
                    },
                    htmlNodata: '<p class="upwarp-nodata">没有更多数据了</p>'
                }
            })
        },
        refresh: function () {
            window.$('.js-list ul').html('')
            mescroll.resetUpScroll()
        },
        loadData: function (page) {
            var param = {
                pageNo: page.num,
                pageSize: page.size,
                type: type,
                // supplierId: supplierId,
                cityCode: addressCode,
                brandId: brandCode
            }

            window.common.ajax({
                url: window.common.erpDomain + '/carDealer/fastUsedCar/list',
                param: param,
                success: function (res) {
                    if (res.code === '1' && res.result.items) {
                        window.$('#error-container').addClass('hide')
                        window.$('#mescroll ul').removeClass('hide')
                        initModule.addHtml(res.result.items)
                        var hasNext = page.size == res.result.items.length
                        mescroll.endSuccess(page.size, hasNext)
                    } else {
                        mescroll.endErr()
                        window.$('#mescroll ul').addClass('hide')
                        window.$('#error-container').removeClass('hide')
                        if (res.code == '100004') {
                            var str = ''
                            if (env) {
                                str += 'env=' + env
                            }
                            location.href = '../user/new_login.html?' + str + '&redirect=' + encodeURIComponent(window.location.href)
                        }
                    }
                },
                error: function () {
                    mescroll.endErr()
                    window.$('#mescroll').addClass('hide')
                    window.$('#error-container').removeClass('hide')
                }
            })
        },
        addHtml: function (list) {
            var listHtml = ''
            list.map(item => {
                var timeTxtHtml = '',
                    priceHtml = '',
                    myQuotePriceHtml = ''
                // 状态（1：已结束，2：待拍卖，3：拍卖中，4：已流拍）
                if (item.fastState === 4) {
                    timeTxtHtml = '<div class="time bg1">已流拍</div>'
                    // priceHtml = '<div class="price">保留价：' + item.reservePrice + '元</div>';//已流拍车辆不显示保留价具体金额
                    priceHtml = '<div class="price">未到保留价</div>'
                } else if (item.fastState === 1) {
                    timeTxtHtml = '<div class="time bg1">已结束</div>'
                    priceHtml = '<div class="price">成交价：' + item.transactionPrice + '元</div>'
                } else if (item.fastState === 3) {
                    timeTxtHtml = '<div class="time bg1">距结束 ' + item.auctionEndTime + '</div>'
                    priceHtml = '<div class="price">领先价：' + (item.leadPrice ? item.leadPrice : 0) + '元</div>'
                } else if (item.fastState === 2) {
                    timeTxtHtml = '<div class="time bg2">' + item.auctionStartTime + ' 开始</div>'
                    priceHtml = '<div class="price">起拍价：' + (item.leadPrice ? item.leadPrice : 0) + '元</div>'
                }

                // 出价状态
                var quoteStateTxt = ''
                if (item.quoteState === 0) {
                    quoteStateTxt = '【失败】'
                } else if (item.quoteState === 1) {
                    quoteStateTxt = '【领先】'
                }
                if (item.quotePrice) {
                    myQuotePriceHtml = '<div class="price">我的出价：' + item.quotePrice + '元' + quoteStateTxt + '</div>'
                }

                listHtml +=
                    '<li data-car-id=' +
                    item.id +
                    '>' +
                    '<div class="img-box">' +
                    '<img src="' +
                    item.carImage +
                    '" >' +
                    timeTxtHtml +
                    '</div>' +
                    '<div class="info">' +
                    '<div class="name">' +
                    item.carName +
                    '</div>' +
                    priceHtml +
                    myQuotePriceHtml +
                    '</div>' +
                    '</li>'
            })
            window.$('#mescroll ul').append(listHtml)

            window.$('#mescroll ul li').on('click', function () {
                var str = '',
                    car_id = window.$(this).data('car-id')
                if (car_id) str += 'carId=' + car_id
                if (env) str += '&env=' + env
                location.href = 'detail.html?' + str
            })
        },
        handleClick: function () {
            // 2：竞拍中，1：已成功，0：未成功
            window.$('.js-tab ul li').on('click', function () {
                type = window.$(this).data('id')
                window.$(this).addClass('selected').siblings('li').removeClass('selected')
                window.$('#mescroll ul').html('')
                mescroll.resetUpScroll()
                window.scrollTo(0, 0)
                window.$('.sift-box div').removeClass('select')
                window.$('.address-box').css('display', 'none')
                window.$('.brand-box').css('display', 'none')
            })
            // 全部品牌 全部地区
            window.$('.sift-box div').on('click', function () {
                var id = window.$(this).data('id')
                if (id === 1) {
                    if (addressCode === '') {
                        window.$('.address-box ul li:nth-of-type(1)').css('color', '#1967B5')
                    }
                    if (window.$(this).hasClass('select')) {
                        window.$('.address-box').css('display', 'none')
                        window.$('.brand-box').css('display', 'none')
                        window.$(this).removeClass('select')
                    } else {
                        window.$('.address-box').css('display', 'block')
                        window.$('.brand-box').css('display', 'none')
                        window.$(this).addClass('select').siblings('div').removeClass('select')
                    }
                } else {
                    if (brandCode === '') {
                        window.$('.brand-box .brand-content .allBrand span').css('color', '#1967B5')
                    } else {
                        window.$('.brand-box .brand-content .allBrand span').css('color', '#999999')
                    }
                    if (window.$(this).hasClass('select')) {
                        window.$('.brand-box').css('display', 'none')
                        window.$('.address-box').css('display', 'none')
                        window.$(this).removeClass('select')
                    } else {
                        window.$('.brand-box').css('display', 'block')
                        window.$('.address-box').css('display', 'none')
                        window.$(this).addClass('select').siblings('div').removeClass('select')
                    }
                }
            })
        },
        getCityAddress: function () {
            // 区域
            window.common.ajax({
                url: window.common.erpDomain + '/carDealer/fastUsedCar/getUsedCarCityList',
                success: function (res) {
                    if (res.code === '1' && res.result) {
                        initModule.addCityHtml(res.result)
                    }
                }
            })
            // 热门品牌
            window.common.ajax({
                url: window.common.erpDomain + '/carInfo/hotBrand',
                success: function (res) {
                    if (res.code === '1' && res.result.brands) {
                        initModule.addHotBrandHtml(res.result.brands)
                    }
                }
            })
            // 品牌
            window.common.ajax({
                url: window.common.erpDomain + '/carInfo/brand',
                success: function (res) {
                    if (res.code === '1' && res.result.brands) {
                        var tagArr = new Array()
                        res.result.brands.forEach(element => {
                            var tag = element.firstLetter
                            if (Object.prototype.hasOwnProperty.call(tagArr, tag)) {
                                tagArr[tag].push(element)
                            } else {
                                var itemArr = new Array()
                                itemArr.push(element)
                                tagArr[tag] = itemArr
                            }
                        })
                        initModule.addBrandHtml(tagArr)
                    }
                }
            })
        },
        addCityHtml: function (list) {
            var cityHtml = ''
            list.map(item => {
                cityHtml += '<li data-city-code="' + item.code + '">' + item.name + '</li>'
            })
            window.$('.address-box ul').html(cityHtml)

            initModule.handleCity()
        },
        addHotBrandHtml: function (list) {
            var hotHtml = ''
            list.map(item => {
                hotHtml +=
                    '<li data-id="' +
                    item.id +
                    '" data-name="' +
                    item.name +
                    '">' +
                    // '<img src="../img/brandImage/' + item.id + '.png" >' +
                    '<span>' +
                    item.name +
                    '</span>' +
                    '</li>'
            })
            window.$('.brand-box .brand-content .brand-list .brand-header ul').html(hotHtml)
            initModule.handleHotBrand()
        },
        addBrandHtml: function (list) {
            var brandHtml = ''
            for (var key in list) {
                var itemArr = list[key]
                var lihtml = ''
                itemArr.map(item => {
                    lihtml +=
                        '<li data-id="' +
                        item.brandId +
                        '" data-name="' +
                        item.name +
                        '">' +
                        // '<img src="../img/brandImage/'+item.brandId+'.png" >'+
                        '<span>' +
                        item.name +
                        '</span>' +
                        '</li>'
                })
                brandHtml += '<ul>' + '<div class="brand-tag">' + key + '</div>' + lihtml
                ;('</ul>')
            }
            window.$('.brand-box .brand-content .brand-list .brand-item').html(brandHtml)
            initModule.handleBrand()
        },
        // 全部地区点击
        handleCity: function () {
            window.$('.address-box ul li').on('click', function () {
                var code = window.$(this).data('city-code')
                var name = window.$(this).html()
                console.log(code, name)
                window.$('.address-box').css('display', 'none')
                window.$('.sift-box div:nth-of-type(1) span').html(name)
                window.$('.sift-box div:nth-of-type(1)').removeClass('select')
                addressCode = code
                window.$('#mescroll ul').html('')
                mescroll.resetUpScroll()
                window.scrollTo(0, 0)
            })
        },
        // 热门品牌点击
        handleHotBrand: function () {
            window.$('.brand-box .brand-content .brand-list .brand-header ul li').on('click', function () {
                var id = window.$(this).data('id')
                var name = window.$(this).data('name')
                console.log(id, name)
                window.$('.brand-box').css('display', 'none')
                window.$('.sift-box div:nth-of-type(2) span').html(name)
                window.$('.sift-box div:nth-of-type(2)').removeClass('select')
                brandCode = id
                window.$('#mescroll ul').html('')
                mescroll.resetUpScroll()
                window.scrollTo(0, 0)
            })
        },
        // 品牌点击
        handleBrand: function () {
            window.$('.brand-box .brand-content .brand-list .brand-item ul li').on('click', function () {
                var id = window.$(this).data('id')
                var name = window.$(this).data('name')
                window.$('.brand-box').css('display', 'none')
                window.$('.sift-box div:nth-of-type(2) span').html(name)
                window.$('.sift-box div:nth-of-type(2)').removeClass('select')
                brandCode = id
                window.$('#mescroll ul').html('')
                mescroll.resetUpScroll()
                window.scrollTo(0, 0)
            })

            window.$('.allBrand').on('click', function () {
                window.$('.brand-box').css('display', 'none')
                window.$('.sift-box div:nth-of-type(2) span').html('全部品牌')
                window.$('.sift-box div:nth-of-type(2)').removeClass('select')
                brandCode = ''
                window.$('#mescroll ul').html('')
                mescroll.resetUpScroll()
                window.scrollTo(0, 0)
            })
        }
        // 全部品牌点击
    }
    initModule.init()
})
