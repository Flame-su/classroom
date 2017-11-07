import AjaxLRC from '../../services/song/lrc'; //歌词接口
import AjaxChapter from '../../services/chapter/chapter'; //章节接口
import AjaxSigan from '../../services/config/config'; //微信授权配置
import AjaxUserInfo from '../../services/users/user'; //用户信息

import MusicAnimat from '../../components/MusicAnimat.vue'; //引入音频动画组件
import DelayTime from '../../components/delayTime/delayTime.vue';
import Popup from '../popup.vue'; //引入弹框
import Vue from 'vue';
import audioExtend from './AudioExtend'; //音乐扩展方法
import CommonMethods from '../../CommonJS/init'; //公共初始化方法
import CommonVoice from '../../CommonJS/voice'; //公共音乐方法
import CommonLrc from '../../CommonJS/lrc'; //公共歌词逐字方法

export default {
  data() {
    return {
      DelayTime: 3,
      data: {}, //一般章节信息获取数据
      LrcData: {}, //独立歌词接口获取数据
      userinfo: '',
      TAvatar: window.localStorage.getItem('teacher_avatar'),
      curChapter: '',
      Tips: '', //全局tips      
      allLrcData: [], //歌词解析后全部数据
      AudioSrc: '', //当前原声源地址
      TapeSrc: '', //当前录音源地址
      MusicSrc: '', //当前背景音乐源地址
      GTime: 0,
      isPlay: false,
      isTape: false,
      curId: -1,
      curTxtId: 0,
      curLineTimer: null,
      isShow: false,
      isDelay: true, //当前是否开启延迟，默认延迟为3s
      isDelayShow: false,
      isTapePlay: false,
      isShowTips: false, //是否弹出提示
      isShowTips2: false, //完成练习弹出提示
      isUpload: false,
      PauseTime: 0,
      localId: '',
      chapterid: 1, //章节ID
      sectionid: '', //片段ID
      localIds: [],
      serverIds: [],
      playTapeIndex: 0,
      waitTimer: null,
      loopRecord: [],
      offset: 0, //音频时间偏移
      lrcUrl: '', //动态歌词地址
      TipsTxt: '', //tips文本内容
      isPopupShow: false, //是否弹出弹框
      finishStatus: 0, //当前完成状态
      nextSection: ''
    }
  },
  components: {
    MusicAnimat,
    DelayTime,
    Popup
  },
  created() {
    this.sectionid = this.$route.query.sectionid;
    this.getChapter();
    this.getUser();
    this._initWXConfig();
  },
  mounted() {
    setTimeout(() => {
      this.musicEvent();
      this.printCover();
      this.$refs.player.load();
      this.$refs.playerTape.load();
    }, 500);
  },
  beforeDestroy() {
    this._initDestroy();
  },
  //格式过滤
  filters: {
    //歌词过滤
    formatTrc(lrc) {
      return lrc.replace(/(\[(.*?)\])|(\((.*?)\))/g, '');
    }
  },
  computed: {
    _TipsTxt() {
      if (Vue.isAndroid()) {
        return !this.isTape ? '点击按钮 开始录音' : '点击波纹 结束录音'
      } else {
        return !this.isTape ? '点击按钮 开始练习' : '点击波纹 结束练习'
      }
    }
  },
  methods: {
    ...audioExtend,
    ...CommonMethods,
    ...CommonVoice,
    ...CommonLrc,
    //获取章节信息
    getChapter() {
      AjaxChapter.getChapterInfo(res => {
        if (res.code == 0) {
          this.data = res.data;
          for (var i = 0; i < res.data.section_list.length; i++) {
            var v = res.data.section_list[i];
            console.log(this.sectionid);
            if (v.sectionid == this.sectionid) {
              this.curChapter = v; //获取当前进入章节信息
              document.title = v.section_info.name;
              this.AudioSrc = v.section_info.audio; //原唱
              this.TapeSrc = v.section_info.taping; //用户录音
              this.MusicSrc = v.section_info.audio1; //背景音乐
              this.nextSection = res.data.section_list[0]; //初始值
              //拿到下一课片段ID,查找未完成卡片
              // if (res.data.section_list[i + 1]) {
              //   this.nextSection = res.data.section_list[i + 1];
              // } else {
              //   for (let j = 0; j < this.data.section_list.length; j++) {
              //     let v2 = this.data.section_list[j];
              //     if (v2.section_info.done_times < v2.section_info.times && (v2.section_type == 1 || v2.section_type == 2 || v2.section_type == 3)) {
              //       this.nextSection = v2;
              //       break;
              //     }
              //   }
              // }
              break;
            }
          }
          //如果lrcs为空则通过URL请求歌词
          if (!this.curChapter.section_info.lrc.url) {
            this.allLrcData = this._lrcInfoFormat(this.curChapter.section_info.lrc.lrcs);
            //划分分组GROUP_SUM
          } else {
            //这里发请求获取歌词
            this.getLrcData(this.curChapter.section_info.lrc.url);
            // this.getLrcData('../../../static/active.1.json');
          }
        } else {
          Vue.toast(res.msg);
        }
      }, {
        chapterid: this.$route.query.chapterid
      });
    },
    //获取歌词
    getLrcData(lrcUrl) {
      //获取动态歌词方法
      AjaxLRC.getWebLrc(res => {
        if (res.code == 0) {
          this.LrcData = res.data;
          this.allLrcData = this._lrcInfoFormat(res.data.lrcs);
        } else {
          Vue.toast(res.msg);
        }
      }, {}, lrcUrl)
    },
    //绘制扇形
    printCover() {
      var deg = parseInt((this.curChapter.section_info.done_times / this.curChapter.section_info.times).toFixed(2) * 360);
      var allCover = this.$refs.wp;
      var shape1 = allCover.getElementsByClassName('shape1')[0];
      var shape2 = allCover.getElementsByClassName('shape2')[0];
      var shape3 = allCover.getElementsByClassName('shape3')[0];
      var shape4 = allCover.getElementsByClassName('shape4')[0];
      shape1.style.transform = "rotate(90deg) skew(" + (90 - deg > 0 ? 90 - deg : 0) + "deg)";
      shape1.style.display = "block";
      if (deg > 90) {
        deg = deg - 90;
        shape2.style.transform = "rotate(180deg) skew(" + (90 - deg > 0 ? 90 - deg : 0) + "deg)"
        shape2.style.display = "block";
        if (deg > 90) {
          deg = deg - 90;
          shape3.style.transform = "rotate(270deg) skew(" + (90 - deg > 0 ? 90 - deg : 0) + "deg)";
          shape3.style.display = "block";
          if (deg > 90) {
            deg = deg - 90;
            shape4.style.transform = "rotate(360deg) skew(" + (90 - deg > 0 ? 90 - deg : 0) + "deg)";
            shape4.style.display = "block";
          }
        }
      }
    }
  }

}
