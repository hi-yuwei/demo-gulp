;(function () {
  function setFontSize() {
    var deviceWidth = document.documentElement.clientWidth
    document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px'
  }
  setFontSize()
  // 页面宽度发生变化时动态生成根字体尺寸
  window.onresize = function () {
    setFontSize()
  }
})()
