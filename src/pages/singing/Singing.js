import AjaxLRC from '../../services/song/lrc'; //歌词接口
import AjaxChapter from '../../services/chapter/chapter'; //章节接口
import AjaxVoice from '../../services/voice/voice'; //
import Vue from 'vue';
import BScroll from 'better-scroll';
import MusicAnimat from '../../components/MusicAnimat.vue'; //引入音频动画组件
import DelayTime from '../../components/delayTime/delayTime.vue';
import voiceToast from '../../pages/action.vue'; //录音提示
import audioExtend from './AudioExtend'; //音乐扩展方法
import CommonMethods from '../../CommonJS/init'; //公共初始化方法
import CommonLrc from '../../CommonJS/lrc'; //公共歌词逐字方法
export default {
  data() {
    return {
      data: {},
      userinfo: {},
      curLrcData: [],
      TAvatar: window.localStorage.getItem('teacher_avatar'),
      GTime: 0,
      AudioSrc: '', //当前原声源地址
      TapeSrc: '', //当前录音源地址
      MusicSrc: '', //当前背景音乐源地址
      isPlay: false, //当前是否播放
      isDelay: true, //当前是否开启延迟，默认延迟为3s
      isDelayShow: false, //显示延迟点
      isTape: false, //当前是否录音
      isVPlay: false, //当前是否播放视屏
      isFirstToady: false, //当天第一次录音
      voiceToast: false, //录音提示
      isTapePlay: false,
      curId: -1,
      moveTop: 0,
      OutTimer: null, //录音开始倒计时
      curGroup: [],
      curItems: '',
      curSectionType: '1',
      DelayTime: 3, //延迟时间
      curGroupID: 0,
      scroll: '',
      PauseTime: 0, //暂停时间
      localId: {}, //音频的本地ID
      serviceId: {}, //微信服务端ID
      localIndex: 0, //全局音频索引定位片段音频
      chapterid: 1, //章节ID
      sectionid: 0, //片段id
      tapeTimer: null, //分段录音定时器
      curPlayTimer: null, //当前录音时长记录定时器
      offset: 0, //音频偏移 
      count: 0
    }
  },
  components: {
    MusicAnimat,
    DelayTime,
    voiceToast
  },
  beforeRouteEnter: (to, from, next) => {
    //首页传参:1==哼唱，2==演唱，3==整首
    next(vm => {
      vm.chapterid = vm.$route.query.chapterid;
    })
  },
  beforeDestroy() {
    console.log('销毁先执行');
    clearInterval(this.OutTimer);
  },
  created() {
    this.getChapter();
    this._initWXConfig();
    this.getUser();
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
      this.musicEvent();
    }, 500);
    setTimeout(() => {
      this.printCover();
    }, 600);
  },
  methods: {
    ...audioExtend,
    ...CommonMethods,
    ...CommonLrc,
    //  //获取章节信息
    //section_type卡 类型: 1.伴唱 2:对唱 3.读词 4.提示 5.视频
    getChapter() {
      AjaxChapter.getChapterInfo(res => {
        if (res.code == 0) {
          this.data = res.data; //全部章节信息
          document.title = this.data.name
          for (var i = 0; i < res.data.section_list.length; i++) {
            var v = res.data.section_list[i];
            if (v.section_type == 1 || v.section_type == 2 || v.section_type == 3) {
              this.AudioSrc = v.section_info.audio; //原唱
              this.TapeSrc = v.section_info.taping; //用户录音
              this.MusicSrc = v.section_info.audio1; //背景音乐
              if (v.section_info.lrc.lrcs.length > 0) {
                this.curGroupID = i;
                this.curLrcData = this._lrcInfoFormat(v.section_info.lrc.lrcs);
                this.offset = this.curLrcData[0].s_time;
              } else {
                //请求外部歌词地址
              }
              this.curItems = v;
              break;
            }
            //如果视频首个片段隐藏
            if (v.section_type == 5) {
              this.curGroupID = -1;
            }
          }
        } else {
          Vue.toast(res.msg);
        }
      }, {
        chapterid: this.$route.query.chapterid
      });
    },

    //切换播放视频
    playVideo(e) {
      this._initSectionData(); //初始化片段
      this._initLrcColor(); //初始化歌词逐行
      this.isVPlay = !this.isVPlay;
      var videos = document.getElementsByTagName('video');
      for (var i = 0; i < videos.length; i++) {
        videos[i].pause();
      }
      var VPlayer = this.$refs['video' + e.item.sectionid][0];
      this.isVPlay ? VPlayer.play() : VPlayer.pause();
    },
    //切换播放组
    toggleGroup(e) {
      var i = e.index;
      var item = this.curItems = e.item;
      var songBox = this.$refs.song;
      var step = 0;
      this.curSectionType = item.section_type; //当前片段类型
      this.AudioSrc = item.section_info.audio; //切换原唱播放地址
      this.MusicSrc = item.section_info.audio1; //切换伴唱播放地址
      this.TapeSrc = item.section_info.taping; //用户录音
      this.$refs.player.load(); //原唱重载
      this.$refs.playerTape.load(); //录音文件重载
      this.$refs.playerOrg.load(); //背景音乐重载
      //跳转到对应高度
      setTimeout(() => {
        var lis = songBox.getElementsByClassName('items');
        for (var j = 0; j < i; j++) {
          var H = lis[j].offsetHeight;
          step += H;
        }
        this.scroll.scrollTo(0, -step, 0);
        this.musicPlay();

      }, 200);
      //解析对应组歌词
      this.curLrcData = this._lrcInfoFormat(item.section_info.lrc.lrcs);
      this.offset = this.curLrcData[0].s_time;
      if (this.curGroupID != i) {
        this._initScroll();
        this.curGroupID = i;
        this.PauseTime = 0; //重置暂停时间
        this.curId = 0; //播放完毕词行重置0
      }
      //切换停止录音
      if (this.isTape) {
        wx.stopRecord({
          success: function (res) {
            Vue.toast('无效录音');
            var localId = res.localId;
          }
        });
      }
      this._initSectionData();
      setTimeout(() => {
        this.printCover();
      }, 100);
    },
    toWork() {
      //判断当前章节片段是否全部完成
      for (var i = 0; i < this.data.section_list.length; i++) {
        var element = this.data.section_list[i];
        if (element.section_info.done_times == 0 && (element.section_type == 1 || element.section_type == 2 || element.section_type == 3)) {
          Vue.toast('您还有未完成片段，暂时不能去课后作业');
          return;
        }
      }

      this.$router.push({
        path: '/Homework',
        query: {
          chapterid: this.chapterid
        }
      })
    },
    //scroll初始化
    _initScroll() {
      let wrapper = this.$refs.wrapper;
      this.scroll = new BScroll(wrapper, {
        bounce: true,
        probeType: 3
      });

    },
    //扇形
    printCover() {
      var allCover = this.$refs.wp[0];
      var deg = parseInt((this.curItems.section_info.done_times / this.curItems.section_info.times).toFixed(2) * 360);
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
      return lrc.replace(/(\[(.*?)\])|(\((.*?)\))/g, '')
    }
  },
  computed: {
    TipsTxt() {
      if (Vue.isAndroid()) {
        return !this.isTape ? '点击按钮 开始录音' : '点击波纹 结束录音'
      } else {
        return !this.isTape ? '点击按钮 开始练习' : '点击波纹 结束练习'
      }
    }
  }
}
