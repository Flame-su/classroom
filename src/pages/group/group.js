import AjaxLRC from '../../services/song/lrc'; //歌词接口
import AjaxChapter from '../../services/chapter/chapter'; //章节接口
import MusicAnimat from '../../components/MusicAnimat.vue'; //引入音频动画组件
import DelayTime from '../../components/delayTime/delayTime.vue';
import AjaxVoice from '../../services/voice/voice'; //
import AjaxUserInfo from '../../services/users/user'; //用户信息
import AjaxSigan from '../../services/config/config'; //微信授权配置
import Popup from '../popup.vue'; //引入弹框

import BScroll from 'better-scroll';
import audioExtend from './AudioExtend'; //音乐扩展方法
import CommonMethods from '../../CommonJS/init'; //公共初始化方法
import CommonVoice from '../../CommonJS/voice'; //公共音乐方法
import CommonLrc from '../../CommonJS/lrc'; //公共歌词逐字方法

import Vue from 'vue';
export default {
  data() {
    return {
      DelayTime: 3,
      data: {},
      LrcData: '',
      TAvatar: window.localStorage.getItem('teacher_avatar'),
      curChapter: {},
      allGroupLrc: {},
      allLrcData: [],
      userinfo: '',
      AudioSrc: '', //当前原声源地址
      TapeSrc: '', //当前录音源地址
      MusicSrc: '', //当前背景音乐源地址
      GTime: 0,
      isPlay: false, //当前是否播放
      isDelay: false, //当前是否开启延迟，默认延迟为3s
      isDelayShow: false, //显示延迟点
      isTape: false, //当前是否录音
      isFirstToady: false, //当天第一次录音
      isTapePlay: false,
      teacherFirst: localStorage.getItem('teacherFirst' + this.$route.query.sectionid) ? localStorage.getItem('teacherFirst' + this.$route.query.sectionid) : '1', //1=>老师先，0=>学生先
      curId: -1, //行ID
      curGroupI: 0, //组ID
      curTxtId: 0,
      scroll: '',
      PauseTime: 0,
      localIds: [],
      serverIds: [],
      playTapeIndex: 0,
      waitTimer: null,
      loopRecord: [],
      chapterid: 1, //章节ID
      sectionid: 0, //练习片段id
      GROUP_SUM: 2, //定义组的划分，2句一组！
      offset: 1000, //音频时间偏移
      isPopupShow: false, //是否弹出弹框
      finishStatus: 0, //当前完成状态
      nextSection: '',
      isShowTips2: false, //完成练习弹出提示

    }
  },
  components: {
    MusicAnimat,
    DelayTime,
    Popup
  },

  created() {
    this.sectionid = this.$route.query.sectionid; //获取片段ID
    this.getChapter();
    this.getUser();
    this._initWXConfig();

  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
      this.musicEvent();
      this.printCover();
      this.$refs.player.load();
      this.$refs.playerTape.load();
    }, 500);
  },
  beforeDestroy() {
    this._initDestroy();
  },
  computed: {
    TipsTxt() {
      if (Vue.isAndroid()) {
        return !this.isTape ? '点击按钮 开始录音' : '点击波纹 结束录音';
      } else {
        return !this.isTape ? '点击按钮 开始练习' : '点击波纹 结束练习';
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
            this.setGroup();
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
    //歌词获取
    getLrcData(url) {
      // 获取动态歌词方法
      AjaxLRC.getWebLrc(res => {
        if (res.code == 0) {
          this.LrcData = res.data;
          this.allLrcData = this._lrcInfoFormat(res.data.lrcs);
          //划分分组GROUP_SUM
          this.setGroup();
        } else {
          Vue.toast(res.msg);
        }
      }, {}, url);
    },
    //划分分组GROUP_SUM
    setGroup() {
      var step = Math.ceil(this.allLrcData.length / this.GROUP_SUM);
      var j = 0;
      for (var i = 0; i < step; i++) {
        var v1 = this.allLrcData[j];
        var v2 = this.allLrcData[j + 1];
        Vue.set(this.allGroupLrc, 'g' + i, []); //触发双向绑定
        this.allGroupLrc['g' + i].push(v1);
        this.allGroupLrc['g' + i].push(v2);
        j += 2;
      }
    },
    //重置
    reset() {
      this.localIds = [];
      this.serverIds = [];
      this.loopRecord = [];
      this.TapeEnd();
      this.loopEndTape();
      clearInterval(this.OutTimer);
      this.scroll.scrollTo(0, 0, 1000);
    },
    //scroll初始化
    _initScroll() {
      let wrapper = this.$refs.wrapper;
      var lis = this.$refs.lis;
      for (let i = 0; i < lis.length; i++) {
        let v = lis[i];
        v.style.height = wrapper.offsetHeight / 2 + 'px';
      }
      //分组高度初始化
      setTimeout(() => {
        this.scroll = new BScroll(wrapper, {
          bounce: true,
          probeType: 3,
          HWCompositing: true
        });

      }, 200);
    },
    printCover() {
      var allCover = this.$refs.wp;
      var deg = parseInt((this.curChapter.section_info.done_times / this.curChapter.section_info.times).toFixed(2) * 360);
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
  },
  //格式过滤
  filters: {
    //歌词过滤
    formatTrc(lrc) {
      return lrc.replace(/(\[(.*?)\])|(\((.*?)\))/g, '');
    }
  }

}
