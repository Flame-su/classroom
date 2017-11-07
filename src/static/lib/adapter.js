(function (window) {

  // 设置初始比例（1：1像素还原）
  var iScale = 1 / window.devicePixelRatio;
  document.write('<meta name="viewport" content="width=device-width,initial-scale=' + iScale + ',minimum-scale=' + iScale + ',maximum-scale=' + iScale + ',user-scalable=no"/>');
  // 动态设置html字体大小
  window.onresize = function () {
    var iWidth = document.documentElement.clientWidth;
    if (window.screen.width > 414 && window.screen.width < 768) {
      iWidth = 540;
    }
    // 判断手机端与Pad端不同比例
    var ratio = window.screen.width >= 768 ? 16 : 15;
    document.getElementsByTagName('html')[0].style.fontSize = iWidth / ratio + 'px';

  }
  window.onresize();

})(window);
