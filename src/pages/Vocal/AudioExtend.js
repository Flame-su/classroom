import Vue from 'vue';
export default {
  musicEvent() {
    var thisVue = this;
    var lrcBox = this.$refs.lrcBox;
    //播放中
    this.$refs.player.onplay = function () {
      this.isPlay = true;
      console.log('播放中');
    }
    this.$refs.playerTape.onpause = () => {
      console.log('录音暂停');
      this.isTapePlay = false;
    }
    //暂停后
    this.$refs.player.onpause = this.MusicPause;
    //改变位置
    this.$refs.player.ontimeupdate = function () {
      var curTime = parseInt(this.currentTime * 1000) + thisVue.LrcData.offset;
      var lists = thisVue.allLrcData;
      var liHeight = lrcBox.getElementsByClassName('item')[0].offsetHeight;
      //当前时间线到达播放位置歌词开始移动
      for (let i = 0; i < lists.length; i++) {
        if (curTime >= lists[i].s_time && curTime < (lists[i].s_time + lists[i].s_long)) {
          thisVue.curId = i;
          lrcBox.style.transform = 'translateY(' + -i * liHeight + 'px)';
          break;
        }
      }
      if (thisVue.curId != -1) {
        var curWidth = thisVue.$refs.curLrc[thisVue.curId].offsetWidth; //最大位移宽度
        //计算歌词高亮移动位置
        thisVue.musicLrcMove(curTime, curWidth);
      }
      thisVue.ToastTips(curTime);
    }
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: function (res) {
        var localId = res.localId;
        thisVue.localIds.push(localId);
        //录音成功获取微信serverID
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            thisVue.serverIds.push(res.serverId); // 返回音频的服务器端ID
            thisVue.uploadTape('android', thisVue.serverIds.join(','));
          }
        });
      }
    });
  },
  //音乐暂停方法
  MusicPause(even) {
    console.log('暂停伴唱');
    var cTime = even.target.currentTime; //当前暂停时间点
    var dTime = even.target.duration; //该音频总时长
    this.$refs.lrcBox.style.transform = 'translateY(0)';
    this._initLrcColor();
    this.isTape = false;
    this.isPlay = false;
    //当前时段小于标准时长90%为无效不进行上传记录
    if (cTime <= dTime * .9) {
      Vue.toast('该练习无效');
      wx.stopRecord();
      return;
    }
    //================发布真实录音 =========发布播放录音记录
    Vue.isAndroid() ? this.StopRecord() : this.uploadTape('ios');
  },
  //开始录制
  TapeStart(e) {
    this.isTape = !this.isTape;
    this.localIds = [];
    this.serverIds = [];
    wx.stopVoice({
      localId: this.localIds[this.playTapeIndex]
    });
    var TapePlayer = this.$refs.playerTape; //录音
    var Player = this.$refs.player;
    TapePlayer.pause();
    Player.pause();
    TapePlayer.currentTime = 0;
    Player.currentTime = 0;

    // if (this.isFirstToady) {
    //   this.voiceToast = true;
    //   return;
    // }
    //延时设置
    if (!this.isDelay) { //无倒计时开始录音
      if (Vue.isAndroid()) this.loopStartTape();
      Player.play();
      this.isPlay = false;
      this.isTape = true;
    } else {
      this.DelayTime = 3;
      //无前奏
      if (this.LrcData.offset == this.allLrcData[0].s_time) {
        this.isDelayShow = true;
        if (Vue.isAndroid()) this.loopStartTape();
        this.OutTimer = setInterval(() => {
          this.DelayTime--;
          if (this.DelayTime <= 0) {
            clearInterval(this.OutTimer);
            Player.play();
          }
        }, 1000);
      } else {
        if (Vue.isAndroid()) this.loopStartTape();
        Player.play();
        this.waitTimer = setInterval(() => {
          //获取当前时间点开启倒计时
          if (Player.currentTime * 1000 + this.LrcData.offset >= this.allLrcData[0].s_time - 3000) {
            this.isDelayShow = true;
            clearInterval(this.waitTimer);
            this.OutTimer = setInterval(() => {
              this.DelayTime--;
              if (this.DelayTime <= 0) {
                clearInterval(this.OutTimer);
              }
            }, 1000);
          }
        }, 100);
      }
    }
  },
  //重新播放
  reset() {
    var Player = this.$refs.player;
    this.$refs.lrcBox.style.transform = 'translateY(0)';
    Player.currentTime = 0; //重置播放
    Player.play();
    this.localIds = [];
    this.serverIds = [];
    this.loopRecord = [];
    this.loopEndTape();
    this.TapePause();
    this.TapeEnd();
  },
  //弹出提示文字
  ToastTips(currentTime) {
    for (var key in this.LrcData.tips) {
      if (currentTime >= +key && currentTime <= +key + 6000) {
        this.TipsTxt = this.LrcData.tips[key];
        this.isShowTips = true;
        break;
      } else {
        this.isShowTips = false;
      }
    }
  }
}
