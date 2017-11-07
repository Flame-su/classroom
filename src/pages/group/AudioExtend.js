import Vue from 'vue';
export default {
  //录制开始
  TapeStart() {
    this.isTape = !this.isTape;
    this.localIds = [];
    this.serverIds = [];
    var TapePlayer = this.$refs.playerTape; //录音
    var Player = this.$refs.player; //老师先音频
    var playerOrg = this.$refs.playerOrg; //学生先音频
    TapePlayer.pause();
    Player.pause();
    playerOrg.pause();
    TapePlayer.currentTime = 0;
    Player.currentTime = 0;
    playerOrg.currentTime = 0;
    wx.stopVoice({
      localId: this.localIds[this.playTapeIndex]
    });
    // if (this.isFirstToady) {
    //   this.voiceToast = true;
    //   return;
    // }
    //延时设置
    if (this.teacherFirst == '1') { //无倒计时开始录音
      if (Vue.isAndroid()) this.loopStartTape();
      Player.play();
      this.isTape = true;
    } else {
      if (this.isDelayShow) return;
      if (this.LrcData.offset == this.allLrcData[0].s_time) {
        //非片头无前奏        
        this.isDelayShow = true;
        if (Vue.isAndroid()) this.loopStartTape();
        this.OutTimer = setInterval(() => {
          this.DelayTime--;
          if (this.DelayTime <= 0) {
            clearInterval(this.OutTimer);
            playerOrg.play();
          }
        }, 1000);
      } else {
        if (Vue.isAndroid()) this.loopStartTape();
        playerOrg.play();
        this.waitTimer = setInterval(() => {
          //获取当前时间点开启倒计时
          if (playerOrg.currentTime * 1000 + this.LrcData.offset >= this.allLrcData[0].s_time - 3000) {
            clearInterval(this.waitTimer);
            this.isDelayShow = true;
            this.OutTimer = setInterval(() => {
              this.DelayTime--;
              if (this.DelayTime <= 0) {
                clearInterval(this.OutTimer);
                this.isDelayShow = false;
              }
            }, 1000);
          }
        }, 100);
      }

    }
  },
  //播放器事件注册
  musicEvent() {
    var thisVue = this;
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
    //老师先音频播放
    this.$refs.player.onplay = function () {
      console.log('老师先音频播放');
    }
    //学生先音频开始
    this.$refs.playerOrg.onplay = function () {
      console.log('学生先音频开始');
    }
    this.$refs.playerTape.onpause = () => {
      console.log('录音暂停');
      this.isTapePlay = false;
    }
    //老师先音频暂停
    this.$refs.player.onpause = this.MusicPause;
    //学生先音频暂停
    this.$refs.playerOrg.onpause = this.MusicPause;
    //老师先音频播放改变位置
    this.$refs.player.ontimeupdate = this.MusicUpdat;
    //学生先音频播放改变位置
    this.$refs.playerOrg.ontimeupdate = this.MusicUpdat;
  },
  //音乐更新方法
  MusicUpdat(even) {
    var curTime = parseInt(even.target.currentTime * 1000) + this.LrcData.offset;
    var liHeight = this.$refs.lis[0].offsetHeight; //获取顶部偏移
    var allGroup = this.allGroupLrc; //全分组歌词信息
    var lineID = 0; //每行全局ID
    var lineID_g = 0; //当前组索引


    //检测当前播发音乐行位置
    for (var j = 0; j < this.allLrcData.length; j++) {
      var t = this.allLrcData[j];
      if (curTime > t.s_time && curTime < (t.s_time + t.s_long)) {
        lineID = this.curId = j;
      }
    }
    //遍历所有已经分组的歌词，定位组
    var Index = 0;
    for (var key in allGroup) {
      if (allGroup.hasOwnProperty(key)) {
        let v = allGroup[key];
        //检测播放当前音组阶段
        if (curTime >= v[0].s_time && curTime < (v[v.length - 1].s_time + v[v.length - 1].s_long)) {
          this.curGroupI = lineID_g = Index; //设置当前音频位于第几组
          //当前时间线到达播放位置歌词开始移动
          this.scroll.scrollTo(0, -liHeight * Index, 1000);
          break;
        }
        Index++;
      }
    }

    if (this.curId != -1) {
      var curWidth = this.$refs.curLrc[lineID].offsetWidth; //最大位移宽度
      //计算歌词高亮移动位置
      this.musicLrcMove(curTime, curWidth, lineID, this.curGroupI);
    }
  },
  //音乐暂停方法
  MusicPause(even) {
    this._initLrcColor();
    this.scroll.scrollTo(0, 0, 1000);
    //音频结束下一次学生先唱
    if (even.target.currentTime >= even.target.duration * .9) {
      this.teacherFirst = this.teacherFirst == '0' ? '1' : '0';
      window.localStorage.setItem('teacherFirst' + this.$route.query.sectionid, this.teacherFirst);
      this.isTape = false;
      //================发布真实录音 =========发布播放录音记录
      Vue.isAndroid() ? this.StopRecord() : this.uploadTape('ios');
      return;
    } else {
      wx.stopRecord();
      Vue.toast('无效练习');
    }
  }

}
