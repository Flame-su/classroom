import Vue from 'vue';
export default {
  //播放
  musicPlay() {
    var Player = this.$refs.player;
    this.isPlay = true;
    Player.load();
    Player.play();
  },
  //暂停
  musicPause() {
    this.isPlay = false;
    this.$refs.player.pause(); //暂停
  },
  //停止录音方法
  StopRecord() {
    var thisVue = this;
    wx.stopRecord({
      success: function (res) {
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
    console.log(this.localIds);
    console.log(this.serverIds);
  },
  //循环开启录音
  loopStartTape() {
    wx.startRecord();
    var thisVue = this;
    if (this.LrcData.split && this.LrcData.split.length > 0) {
      //测试循环添加定时器
      for (var j = 0; j < thisVue.LrcData.split.length; j++) {
        var element = thisVue.LrcData.split[j] - 2100;
        var timer = setTimeout(function () {
          wx.stopRecord({
            success: (res) => {
              var localId = res.localId;
              thisVue.localIds.push(localId);
              //录音成功获取微信serverID
              wx.uploadVoice({
                localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: (res) => {
                  thisVue.serverIds.push(res.serverId); // 返回音频的服务器端ID
                  wx.startRecord();
                }
              });
            }
          });
        }, element);
        this.loopRecord.push(timer);
      }
    }

  },
  //循环清理录音定时器
  loopEndTape() {
    if (this.loopRecord.length > 0) {
      for (var i = 0; i < this.loopRecord.length; i++) {
        var element = this.loopRecord[i];
        clearTimeout(element);
      }
    }
  },
  //录制结束
  TapeEnd(e) {
    var playerOrg = this.$refs.playerOrg;
    var Player = this.$refs.player;
    this.isTape = false;
    this.isPlay = false;
    this.DelayTime = 3;
    this.isDelayShow = false;
    clearInterval(this.OutTimer);
    if (playerOrg) playerOrg.pause();
    if (Player) Player.pause();
  },
  //开始播放录音
  TapePlay(e) {
    var TapePlayer = this.$refs.playerTape;
    var Player = this.$refs.player;
    if (this.localIds.length > 0) {
      this.playTapeIndex = 0;
      wx.playVoice({
        localId: this.localIds[0] // 需要播放的音频的本地ID，由stopRecord接口获得
      });
      wx.onVoicePlayEnd({
        success: (res) => {
          this.playTapeIndex++;
          if (this.playTapeIndex <= this.localIds.length - 1) {
            wx.playVoice({
              localId: this.localIds[this.playTapeIndex]
            });
          } else {
            this.isTapePlay = false;
            this.playTapeIndex = 0;
            return;
          }
          // var localId = res.localId; // 返回音频的本地ID
        }
      });

      this.isTapePlay = true;

    } else if (this.curChapter.section_info.taping) {
      this.isTapePlay = true;
      Player.pause();
      TapePlayer.play();
    } else {

      Vue.toast('亲，你还没有录音啊');
    }

  },
  //暂停播放录音
  TapePause(e) {
    this.isTapePlay = false;
    //如果是播放本地有localid
    if (this.localIds.length > 0) {
      wx.stopVoice({
        localId: this.localIds[this.playTapeIndex]
      });
    } else {
      //否则播放之前mp3
      this.$refs.playerTape.pause();
    }
  }
}
