import Vue from 'vue';
import AjaxSigan from '../services/config/config'; //微信授权配置
import AjaxUserInfo from '../services/users/user'; //用户信息
import AjaxVoice from '../services/voice/voice'; //引入录音接口

export default {
  //微信初始化配置
  _initWXConfig() {
    AjaxSigan.getSignature(res => {
      if (res.code == 0) {
        //config
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见附录1
          jsApiList: [
            'onMenuShareAppMessage',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
            'downloadVoice'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(() => {

          console.log('config 配置成功');
        });
        wx.error(function (res) {
          console.log(res);
        });
      } else {
        Vue.toast(res.msg);
      }

    });
  }, //歌词josn格式化
  _lrcInfoFormat(lrcArrs) {
    var newLrcArr = [];
    for (var i = 0; i < lrcArrs.length; i++) {
      let item = lrcArrs[i];
      if (item == '') continue;
      let G_Time = item.match(/([^\[\]]+)(?=\])/g) || 0;
      let G_Step = item.match(/([^\(\)]+)(?=\))/g) || 0;
      let G_Txt = item.replace(/(\[(.*?)\])|(\((.*?)\))/g, '');
      let arr = [];
      for (var j = 0; j < G_Step.length; j++) {
        arr.push(G_Step[j].split(','));
      }
      var newItem = {
        'id': newLrcArr.length,
        'txt': G_Txt || 0,
        's_time': G_Time ? +G_Time[0].split(',')[0] : 0,
        's_long': G_Time ? +G_Time[0].split(',')[1] : 0,
        's_step': arr
      }
      //完整填入
      newLrcArr.push(newItem);
    }
    return newLrcArr;
  }, //初始化逐字
  _initLrcColor() {
    for (var i = 0; i < this.$refs.curLrc.length; i++) {
      var element = this.$refs.curLrc[i];
      element.style.width = 0;
      element.setAttribute('class', 'cur');
    }
  }, //初始化视频播放器
  _initVideos() {
    var videos = document.getElementsByTagName('video');
    for (var i = 0; i < videos.length; i++) {
      videos[i].pause();
    }
    this.isVPlay = false;
  },
  //片段切换初始化
  _initSectionData() {
    this.$refs.playerOrg.load();
    this.$refs.playerTape.load();
    this.$refs.player.load();
    this.isTapePlay = false;
    this.DelayTime = 3;
    this.isTape = false;
    this.isPlay = false;
    clearInterval(this.curPlayTimer);
    this.GTime = 0;
  },
  //获取用户信息
  getUser() {
    AjaxUserInfo.getUserInfo(res => {
      if (res.code == 0) {
        this.userinfo = res.data;
      } else {
        Vue.toast(res.msg);
      }
    });
  },
  //后台静默上传录音
  uploadTape(platform, ServiceId) {
    //发送后台
    AjaxVoice.postPractice(res => {
      if (res.code == 0) {
        // Vue.toast('悄悄的提交录音成功了' + ServiceId);
        for (var i = 0; i < this.data.section_list.length; i++) {
          var v = this.data.section_list[i];
          if (v.sectionid == this.sectionid) {
            v.section_info.done_times += 1;
            if (this.isShowTips2 != undefined && v.section_info.done_times < v.section_info.times) {
              //小于目标使用小提示
              this.isShowTips2 = true;
              setTimeout(() => {
                this.isShowTips2 = false;
              }, 2000);
              return;
            } else {
              if (this.finishStatus != undefined) {
                //需要弹框
                this.isPopupShow = true;

                //超过目标使用弹框提示
                this.finishStatus = 0;
                for (var i = 0; i < this.data.section_list.length; i++) {
                  var element = this.data.section_list[i];
                  if (element.section_info.done_times == 0 && (element.section_type == 1 || element.section_type == 2 || element.section_type == 3)) {
                    return;
                  }
                }
                this.finishStatus = 1;
              }
            }
          }
        }

      } else {
        Vue.toast(res.msg)
      }
    }, {
      sectionid: this.sectionid,
      tapingid: ServiceId,
      platform: platform
    })

  },
  //andriod限制提示
  androidTips() {
    var androidTips = '微信中最长只能录音一分钟，为了你的录音体验，我们在合适的地方开始下一段录音，最后在后台拼接成完整录音。回放略有瑕疵，还请多多谅解。';
    if (!localStorage.getItem('androidTips') && Vue.isAndroid()) {
      Vue.toast(androidTips);
      localStorage.setItem('androidTips', true);
      return true;
    } else {
      return false;
    }
  },
  //ios限制提示
  iosTips(route) {
    var iosTips = '由于iOS系统在微信中的限制，播放伴奏，录音不能同时进行，虽然不能记录下你的录音很遗憾，但是只要你努力练习，一定会学会这首歌哒。';
    if (!localStorage.getItem('iosTips' + route) && !Vue.isAndroid()) {
      Vue.toast(iosTips);
      localStorage.setItem('iosTips' + route, true);
      return true;
    } else {
      return false;
    }
  },
  //组件销毁清除状态
  _initDestroy() {
    console.log('销毁先执行');
    clearInterval(this.OutTimer);
    clearInterval(this.waitTimer);
    this.loopEndTape();
    wx.stopVoice({
      localId: this.localIds[this.playTapeIndex]
    });
    wx.stopRecord();
  },
  closePop() {
    this.isPopupShow = false;
  }
}
