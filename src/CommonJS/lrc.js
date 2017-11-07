import Vue from 'vue';
export default {
  /**
   * 逐字运动
   * 
   * @param {any} curTime 当前音频时刻
   * @param {any} curWidth 当前行之前宽度
   * @param {any} lineID 当前行索引
   */
  musicLrcMove(curTime, curWidth, lineID) {
    var cId = this.curId; //获取当前播放行
    var curLines = this.$refs.curLrc; //所有需要高亮的歌词
    var LRC_DATA = this.curLrcData || this.allLrcData;
    if (lineID == undefined) {
      var curLine = curLines[cId];
    } else {
      var curLine = curLines[lineID]; //当前所在行
    }
    var curLineWidth = curLine.parentNode.offsetWidth; //最大位移宽度
    var curLineStart = LRC_DATA[cId].s_time; //当前行开始时间
    var curTotalTime = LRC_DATA[cId].s_long; //最大位移时间
    var curItemsTime = LRC_DATA[cId].s_step; //每个字的具体时间集

    var speed = Math.ceil((curTotalTime / curLineWidth)); //  单位时间移动像素值
    var curItemWidth = curLineWidth / curItemsTime.length; //单字节距离
    var addTime = 0; //补给时间
    curTime += addTime;
    //初始化高亮状态
    for (let index = 0; index < curLines.length; index++) {
      let element = curLines[index];
      element.style.width = 0;
      element.setAttribute('class', 'cur');
    }
    //遍历所有文字节点定位文字位置
    for (let j = 0; j < curItemsTime.length; j++) {
      let element = curItemsTime[j]; //当前字节区间
      let E0 = Number(element[0]);
      let E1 = Number(element[1]);
      //定位当前字节
      if (curTime >= E0 && curTime < (E0 + E1)) {
        let cur_s = Math.ceil((curTime - E0) / speed);
        let old_s = Math.ceil((curTime - curLineStart) / speed);
        //边界检测
        if (curWidth + cur_s >= curLineWidth) {
          curLine.style.width = curLineWidth + 'px';
          return
        }

        curLine.setAttribute('class', 'cur active');
        curLine.style.width = cur_s + old_s + "px";
        break;
      }

    }

  }
}
