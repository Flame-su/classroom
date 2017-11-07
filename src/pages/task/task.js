import AjaxLRC from '../../services/song/lrc'; //歌词接口
import AjaxChapter from '../../services/chapter/chapter'; //章节接口
import AjaxSigan from '../../services/config/config'; //微信授权配置
import MusicAnimat from '../../components/MusicAnimat.vue'; //引入音频动画组件
import DelayTime from '../../components/delayTime/delayTime.vue'; //延迟
import AjaxVoice from '../../services/voice/voice'; //引入录音接口
import Per from '../../pages/per.vue'; //上传进度状态
import Vue from 'vue';

import CommonMethods from '../../CommonJS/init'; //公共初始化方法
import CommonVoice from '../../CommonJS/voice'; //公共音乐方法
import CommonLrc from '../../CommonJS/lrc'; //公共歌词逐字方法
export default {
  data() {
    return {
      DelayTime: 3,
      data: {}, //一般章节信息获取数据
      LrcData: {}, //独立歌词接口获取数据
      Tips: '', //全局tips      
      allLrcData: [], //歌词解析后全部数据
      GTime: 0,
      isPlay: false,
      isDelay: true, //当前是否开启延迟，默认延迟为3s
      isDelayShow: false, //控制倒计时显隐
      curId: -1,
      curTxtId: 0,
      curLineTimer: null,
      isTape: false,
      isMuiscOver: false,
      isUpload: false,
      PauseTime: 0,
      chapterid: 1, //章节ID
      lrcUrl: '', //动态歌词地址
      mask: true, //遮道层
      localIds: [],
      serverIds: [],
      mockAudioTimer: null, //ISO模拟audio定时器
      waitTimer: null,
      loopRecord: [],
      CurrentTime: 0,

    }
  },
  components: {
    MusicAnimat,
    DelayTime,
    Per
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      //章节id
      vm.chapterid = vm.$route.query.chapterid;
    })
  },
  created() {
    this.getUser();
    this._initWXConfig();
  },
  mounted() {
    this.$nextTick(() => {
      this.musicEvent();
       this.getLrcData(this.$route.query.lrcUrl);
      //this.getLrcData('../../../static/active.1.json');
    })
  },
  beforeDestroy() {
    console.log('销毁先执行');
    clearInterval(this.mockAudioTimer);
    clearInterval(this.OutTimer);
    clearInterval(this.waitTimer);
    this.loopEndTape();
    wx.stopRecord();
  },
  filters: {
    //歌词过滤
    formatTrc(lrc) {
      return lrc.replace(/(\[(.*?)\])|(\((.*?)\))/g, '');
    }
  },
  methods: {
    ...CommonMethods,
    ...CommonVoice,
    ...CommonLrc,
    //获取歌词
    getLrcData(lrcUrl) {
      //获取动态歌词方法
      AjaxLRC.getWebLrc(res => {
        if (res.code == 0) {
          this.LrcData = res.data;
          this.allLrcData = this._lrcInfoFormat(res.data.lrcs);
          //ios重头播放
          if (!Vue.isAndroid()) {
            this.LrcData.offset = this.allLrcData[0].s_time;
          }
        } else {
          Vue.toast(res.msg);
        }
      }, {}, lrcUrl);
    },

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
            }
          });
        }
      });
      //播放中
      this.$refs.player.onplay = function () {};
      //暂停后
      this.$refs.player.onpause = function () {
        console.log('暂停后');
      }
      //改变位置
      this.$refs.player.ontimeupdate = this.MusicUpdate;
    },
    MusicUpdate(even) {
      var lrcBox = this.$refs.lrcBox;
      if (!lrcBox || !lrcBox.getElementsByClassName('item')) return;
      if (even) {
        var curTime = parseInt(even.target.currentTime * 1000) + this.LrcData.offset;
      } else {
        var curTime = parseInt(this.CurrentTime * 100) + this.LrcData.offset;
      }

      var lists = this.allLrcData;
      var liHeight = lrcBox.getElementsByClassName('item')[0].offsetHeight;
      //当前时间线到达播放位置歌词开始移动
      for (let i = 0; i < lists.length; i++) {
        if (curTime >= lists[i].s_time && curTime < (lists[i].s_time + lists[i].s_long)) {
          this.curId = i;
          lrcBox.style.transform = 'translateY(' + -i * liHeight + 'px)';
          break;
        }
      }
      if (this.curId != -1) {
        var curWidth = this.$refs.curLrc[this.curId].offsetWidth; //最大位移宽度
        //计算歌词高亮移动位置
        this.musicLrcMove(curTime, curWidth);
      }
    },
    //录制开始
    TapeStart_loacl() {
      if (this.iosTips(this.$route.name)) return;
      this.isTape = true;
      var Player = this.$refs.player;
      Player.currentTime = 0;
      //延时设置
      this.DelayTime = 3;
      this.localIds = [];
      this.serverIds = [];
      //无前奏
      if (this.LrcData.offset == this.allLrcData[0].s_time) {
        this.isDelayShow = true;
        this.loopStartTape();
        this.OutTimer = setInterval(() => {
          this.DelayTime--;
          if (this.DelayTime <= 0) {
            clearInterval(this.OutTimer);
            Vue.isAndroid() ? Player.play() : this.mockAudio();
          }
        }, 1000);
      } else {
        this.loopStartTape();
        Vue.isAndroid() ? Player.play() : this.mockAudio();
        this.waitTimer = setInterval(() => {
          var CURTime = Vue.isAndroid() ? Player.currentTime * 1000 : this.CurrentTime * 100;
          //获取当前时间点开启倒计时
          if (CURTime + this.LrcData.offset >= this.allLrcData[0].s_time - 3000) {
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
    },
    //结束录音
    TapeEnd_loacl() {
      var Player = this.$refs.player;
      if (Vue.isAndroid()) {
        if (Player.currentTime <= Player.duration / 2) {
          Vue.toast('无效作业');
          wx.stopRecord();
          this.resetStatus();
          return;
        } else {
          this.StopRecord_loacl();
          this.resetStatus();
          this.isMuiscOver = true;
        }
      } else {
        if (this.CurrentTime * 100 <= Player.duration * 1000 / 2) {
          Vue.toast('无效作业');
          wx.stopRecord();
          this.resetStatus();
          return;
        } else {
          this.StopRecord_loacl();
          this.resetStatus();
          this.isMuiscOver = true;

        }
      }
    },
    //停止录音方法
    StopRecord_loacl() {
      var thisVue = this;
      Vue.toast('停止录音');
      wx.stopRecord({
        success: function (res) {
          var localId = res.localId;
          if (localId) {
            thisVue.localIds.push(localId);
          } else {
            return;
          }
          //录音成功获取微信serverID
          wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
              thisVue.serverIds.push(res.serverId); // 返回音频的服务器端ID
            }
          });
        }
      })
    },
    //ios模拟播放器进度
    mockAudio() {
      this.mockAudioTimer = setInterval(() => {
        var amount = this.allLrcData[this.allLrcData.length - 1].s_time + this.allLrcData[this.allLrcData.length - 1].s_long - this.allLrcData[0].s_time;
        if (this.CurrentTime * 100 > this.$refs.player.duration * 1000 + 5000) {
          console.log('自动播放结束');
          clearTimeout(this.mockAudioTimer);
          this.isMuiscOver = !this.isMuiscOver;
          this.StopRecord_loacl();
          this.CurrentTime = 0;
          return;
        }
        this.CurrentTime++;
        this.MusicUpdate();
      }, 100);
    },
    //重新播放
    reset() {
      this.localIds = [];
      this.serverIds = [];
      this.resetStatus();
      wx.stopRecord();
    },
    upload() {
      this.mask = !this.mask; //开启上传状态
      this.isUpload = true; //开启上传动画
      setTimeout(() => {
        AjaxVoice.postWork(res => {
          if (res.code == 0) {
            //提交作业录音
            setTimeout(() => {
              this.isUpload = false;
              Vue.toast("上传成功");
              if (this.$route.query.chapterid == 5) {
                this.$router.push({
                  path: '/Finish'
                })
              } else {
                this.ToHomework()
              }
            }, 5000);
          } else {
            this.isUpload = false;
            this.reset();
            Vue.toast(res.msg);
          }
        }, {
          chapterid: this.chapterid,
          tapingid: this.serverIds.join(",")
        });
      }, 200);

    },
    ToHomework() {
      this.$router.push({
        path: '/Homework',
        query: {
          chapterid: this.chapterid
        }
      })
    },
    //状态重置
    resetStatus() {
      var Player = this.$refs.player;
      Player.pause();
      Player.currentTime = 0;
      clearInterval(this.mockAudioTimer);
      clearInterval(this.OutTimer);
      clearInterval(this.waitTimer);
      this._initLrcColor(); //重置歌词
      this.$refs.lrcBox.style.transform = 'translateY(0)';
      this.isMuiscOver = false;
      this.isTape = false;
      this.CurrentTime = 0;
      this.DelayTime = 3;
      this.isDelayShow = false;
    }
  }

}
