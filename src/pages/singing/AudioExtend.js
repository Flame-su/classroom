import Vue from 'vue';

export default {
  //播放原唱音频
  musicPlay() {
    var Player = this.$refs.player;
    var TapePlayer = this.$refs.playerTape;
    var playerOrg = this.$refs.playerOrg;
    Player.load();
    TapePlayer.load();
    playerOrg.load();
    clearInterval(this.OutTimer);
    this.isPlay = true;
    this.isTapePlay = false;
    this.isDelayShow = false;
    //设置原唱地址
    this._initVideos();
    Player.play(); //播放    
  },
  //暂停原唱音频
  musicPause() {
    this.isPlay = false;
    this.$refs.player.pause(); //暂停
  },
  //录制开始
  TapeStart(e) {
    if (this.androidTips()) return;
    var TapePlayer = this.$refs.playerTape;
    var Player = this.$refs.player;
    var playerOrg = this.$refs.playerOrg;
    this.sectionid = e.item.sectionid; //sectionid=>片段ID定位音频片段
    Player.pause(); //原唱重载
    TapePlayer.pause(); //录音文件重载
    playerOrg.pause(); //背景音乐重载
    this._initVideos();
    this.TapePause();
    this._initLrcColor();
    this.DelayTime = 3;
    //延时设置读词不需要倒计时
    if (!this.isDelay || this.curSectionType == 3) { //无倒计时开始录音
      //android和读词开启录音
      if (Vue.isAndroid() || e.item.section_type == 3) wx.startRecord();
      // wx.startRecord();

      if (e.item.section_type == 3) {
        this.curPlayTimer = setInterval(() => {
          this.GTime++;
          //超出时间停止录音
          if (this.GTime > Player.duration * 100) {
            this.StopRecord(this.sectionid);
            this._initSectionData();
          }
        }, 10)
      } else {
        setTimeout(function () {
          playerOrg.currentTime = 0;
          playerOrg.play();
        }, 200);
      }
      this.isPlay = false;
      this.isTape = true;
    } else {
      if (this.isDelayShow) return;
      this.isDelayShow = true;
      this.OutTimer = setInterval(() => {
        this.DelayTime--;
        if (this.DelayTime <= 0) {
          clearInterval(this.OutTimer);
          //iphone不开启录音
          if (Vue.isAndroid() || e.item.section_type == 3) wx.startRecord();
          // wx.startRecord();
          this.isDelayShow = false;
          this.isTape = true;
          this.isPlay = true;
          if (e.item.section_type == 3) {
            this.curPlayTimer = setInterval(() => {
              this.GTime++;
            }, 10)
          } else {
            setTimeout(function () {
              playerOrg.currentTime = 0;
              playerOrg.play();
            }, 200);

          }
        }
      }, 1000);

    };

  },
  //录制结束
  TapeEnd(e) {
    var TapePlayer = this.$refs.playerTape;
    var playerOrg = this.$refs.playerOrg;
    var Player = this.$refs.player;
    this.sectionid = e.item.sectionid; //sectionid=>片段ID定位音频片段   
    this.isTape = false;
    this.isPlay = false;
    if (e.item.section_type == 3) {
      // 取当前片段音频长度,小于一半就视为无效
      if (this.GTime < Player.duration * 100 / 2) {
        Vue.toast('无效练习');
        wx.stopRecord();
      } else {
        this.StopRecord(this.sectionid);
      }
      clearInterval(this.curPlayTimer);
      this.GTime = 0;
      this._initSectionData();
      return;
    }
    playerOrg.pause();
  },
  //停止录音方法
  StopRecord(s_id) {
    var thisVue = this;
    wx.stopRecord({
      success: function (res) {
        var localId = res.localId;
        thisVue.localId[s_id] = localId;
        // Vue.toast('成功停止录音' + localId);
        //录音成功获取微信serverID
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            var serverId = res.serverId; // 返回音频的服务器端ID
            thisVue.uploadTape('android', serverId);
          }
        });
      }
    });

    this._initSectionData();
  },
  //开始播放录音
  TapePlay(e) {
    if (this.iosTips(this.$route.name)) return;
    var TapePlayer = this.$refs.playerTape;
    var Player = this.$refs.player;
    this._initVideos();
    this.sectionid = e.item.sectionid; //sectionid=>片段ID定位音频片段      
    this.localIndex = 0; //播放前初始化片段ID
    if (this.localId[this.sectionid]) {
      Player.pause();
      wx.playVoice({
        localId: this.localId[this.sectionid] // 需要播放的音频的本地ID，由stopRecord接口获得
      });
      this.isTapePlay = true;
    } else if (this.TapeSrc) {
      Player.pause();
      TapePlayer.play();
      this.isTapePlay = true;
    } else {
      Vue.toast('亲，你还没有录音啊');
    }
  },
  //暂停播放录音
  TapePause(e) {
    var TapePlayer = this.$refs.playerTape;
    //如果是播放本地有localid
    if (this.localId[this.sectionid]) {
      wx.stopVoice({
        localId: this.localId[this.sectionid] // 需要停止的音频的本地ID，由stopRecord接口获得
      });
    } else {
      //否则暂停播放之前mp3
      TapePlayer.load();
    }
    this.isTapePlay = false;
  },
  musicEvent() {
    var thisVue = this;
    //监听录音自动停止接口
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: (res) => {
        this.isTape = false;
        wx.uploadVoice({
          localId: res.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: (res) => {
            var serverId = res.serverId; // 返回音频的服务器端ID
            this.uploadTape('android', serverId);
          }
        });
      }
    });
    //监听语音播放完毕接口
    wx.onVoicePlayEnd({
      success: (res) => {
        var localId = res.localId; //返回音频的本地ID
        this.isTapePlay = false; //播放录音结束
      }
    });
    //录音暂停
    this.$refs.playerTape.onpause = function () {
      console.log('录音暂停后');
      thisVue.isTapePlay = false;
    } //背景音乐开始
    this.$refs.playerOrg.onplay = () => {
      console.log('背景音乐开始');
      //初始化高亮状态
      this._initLrcColor();
    } //背景音乐暂停
    this.$refs.playerOrg.onpause = function () {
      var cTime = this.currentTime; //当前暂停时间点
      var dTime = this.duration; //该音频总时长
      console.log('背景音乐暂停');
      setTimeout(() => {
        thisVue.printCover();
      }, 100);
      //初始化高亮状态
      thisVue._initLrcColor();
      //录音暂停
      // this.rotate();
      thisVue.isTape = false;
      thisVue.isPlay = false;
      //当前时段小于标准时长90%为无效不进行上传记录
      if (cTime <= dTime * .9) {
        Vue.toast('该练习无效');
        wx.stopRecord();
        thisVue._initSectionData();
        return;
      }
      if (Vue.isAndroid()) {
        //发布真实录音
        thisVue.StopRecord(thisVue.sectionid);
      } else {
        //发布播放录音记录
        thisVue.uploadTape('ios');
      }
    }
    //播放中
    this.$refs.player.onplay = () => {
      this.isPlay = true;
      console.log('音乐播放中');
    }
    //暂停后
    this.$refs.player.onpause = function () {
      console.log('音乐暂停后');
      thisVue.isPlay = false;
      thisVue.curId = -1; //播放完毕词行重置0
      //初始化高亮状态
      thisVue._initLrcColor();
    }
    //背景音也改变位置
    this.$refs.playerOrg.ontimeupdate = updateMuisc;
    //原唱改变位置
    this.$refs.player.ontimeupdate = updateMuisc;
    //原唱改变位置
    function updateMuisc() {
      var curTime = parseInt(this.currentTime * 1000) + thisVue.offset;
      let curGroup = thisVue.curLrcData;
      //片段3，读词不进行逐行跟踪
      if (thisVue.curSectionType == '3') return;
      //当前时间线到达播放位置歌词开始移动
      for (let i = 0; i < curGroup.length; i++) {
        var last_long = curGroup[i].s_step.length;
        var last_txt = curGroup[i].s_step[last_long - 1]; //当前行最后一个字
        //播放当前音组阶段检测
        if (curTime >= curGroup[i].s_time && curTime < (Number(last_txt[0]) + Number(last_txt[1]))) {
          thisVue.curId = i;
          break;
        }
      }

      if (thisVue.curId == -1) {
        //初始化高亮状态
        thisVue._initLrcColor();
      } else {
        var curWidth = thisVue.$refs.curLrc[thisVue.curId].offsetWidth; //最大位移宽度
        //计算歌词高亮移动位置
        thisVue.musicLrcMove(curTime, curWidth);
      }

    }
  },

  //计算当前歌词播放段落时长
  curMusicLong() {
    var long = 0;
    for (var i = 0; i < this.curLrcData.length; i++) {
      var v = this.curLrcData[i];
      long += v.s_long;
    }
    return long;
  }
}
