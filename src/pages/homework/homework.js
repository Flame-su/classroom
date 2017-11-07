import Vue from 'vue'
import AjaxHomework from '../../services/homework/homework'; //课后作业接口
import AjaxUser from '../../services/users/user'; //用户信息
import AjaxSigan from '../../services/config/config'; //微信授权配置
import AjaxIndex from '../../services/index/index'; //接口
import AjaxChapter from '../../services/chapter/chapter'; //章节接口


Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText
    el.remove()
  }
})
//过滤时间戳
Vue.filter('time', function (value) {
  /* * 月-日 时:分，月和日不补零。
   *不是今年的显示年份后两位.
   *如当天  14:32
   *当年：8-3 18:31
   * 往年：2017-6-23 17:41*/
  //获取时间戳 
  var curDate = new Date(parseInt(value) * 1000);
  var year = curDate.getFullYear();
  var mouth = curDate.getMonth() + 1;
  var day = curDate.getDate();
  var hours = curDate.getHours() >= 10 ? curDate.getHours() : "0" + curDate.getHours();
  var minutes = curDate.getMinutes() >= 10 ? curDate.getMinutes() : "0" + curDate.getMinutes();
  //当下时间戳
  var nowData = new Date()
  var nowyear = nowData.getFullYear();
  var nowmouth = nowData.getMonth() + 1;
  var nowday = nowData.getDate();
  if (nowyear == year) {
    //当年
    if (nowday == day) {
      return (hours + ":" + minutes)
    } else {
      return (mouth + '-' + day + " " + hours + ":" + minutes)
    }

  } else {
    return (year + '-' + mouth + '-' + day + " " + hours + ":" + minutes)
  }

})

export default {

  name: 'homework',
  swiper: null,
  className: '',
  data() {
    return {
      datas: {},
      lists: [{
        "audio": "",
        "uid": "",
        "avatar": ""
      }], //过滤集合
      user: {},
      mask: false, //点击遮道层
      chapterid: "", //章节ID
      arr: [],
      index: "999",
      sum: false,
      // Allmusic: true, //总控音乐
      Bgmusic: true, //背景音乐 老师音乐
      UserMusic: "",
      music: '', //用户音乐集合
      stops: '', //用户暂停集合
      BTphoto: '', //播放器头像
      curItem: -1,
      isPlayUser: false
    }
  },
  methods: {
    //获取id
    getId() {
      this.chapterid = this.$route.query.chapterid;
    },
    //获取用户信息
    getUserData() {
      AjaxUser.getUserInfo(res => {
        if (res.code == 0) {
          this.user = res.data
        } else {
          Vue.toast(res.msg);
        }
      });
    },

    //滚动条触发事件
    menu() {
      /*	this.scroll = document.documentElement.scrollTop;
      	var that=this
      	if(this.scroll>=280){
      		console.log(1)
      		that.BTMusic=true
      	}else{
      		that.BTMusic=false
      	}*/
      var body = document.getElementById("app")
      body.touchstart = function (e) {
        alert()
        var touch = e.targetTouches[0];
        startPos = {
          x: touch.pageX,
          y: touch.pageY,
          time: +new Date
        }; //取第一个touch的坐标值
        //console.log(startPos)　
      }
    },

    //获取数据
    getHomeworkData() {
      AjaxHomework.getHomework(res => {
        if (res.code == 0) {
          this.datas = res.data;
          this.music = this.datas.model_audio;
          var chapter_num = transNum(this.datas.chapter_seq)
          if (chapter_num != undefined) {
            document.title = "第" + chapter_num + "课课后作业"
          }
          var that = this
          var arr = []
          for (var i = 0; i < res.data.work_list.length; i++) {
            if (res.data.work_list[i].audio != "") {
              arr.push(res.data.work_list[i])
            }
          }
          this.lists = arr
          //this.random()
          //this.one()
          var stop = []
          //	console.log()
          stop = document.getElementsByClassName("stop")
          this.stops = stop
        } else if (res.code == 106) {
          //跳转授权
          window.location.href = res.url;
        } else {

        }
        //判断有没有录音
      }, {
        "chapterid": this.chapterid
      });
    },
    //背景随机数
    random() {
      var arr = []
      for (var i = 0; i < this.lists.length; i++) {
        var m = Math.ceil(Math.random() * 6)
        arr.push(m)
      }
      this.arr = arr
    },

    //用户单一播放器(停用)
    // plays(index, bool) {
    //   //头像
    //   this.BTphoto = this.lists[index].avatar
    //   this.Allmusic = true
    //   //this.index=index
    //   //var that=this
    //   this.Bgmusic = true
    //   var music = []
    //   for (var i = 0; i < this.lists.length; i++) {
    //     //console.log(this.lists[i].audio)
    //     music.push(this.lists[i].audio)
    //   }
    //   //				console.log(music)
    //   //				console.log(index)
    //   this.music = music[index];
    //   //				console.log(this.music)
    //   //				var stop=[]
    //   this.allStop(index, bool)

    //   //				for(var m=0;m<stop.length;m++){
    //   //					stop[m].className="Imgstop"
    //   //				}
    //   //this.stops[index].className="Imgplay"
    //   //				console.log(stop)
    //   //				console.log(index)
    // },
    //背景音乐
    playBgMisic() {
      var Player = this.$refs.player;
      Player.load();
      this.music = this.datas.model_audio;
      this.Bgmusic = !this.Bgmusic;
      this.isPlayUser = false;
      setTimeout(() => {
        this.Bgmusic ? Player.pause() : Player.play();
      }, 200);
      // stop = document.getElementsByClassName("stop");
      // for (var m = 0; m < stop.length; m++) {
      //   stop[m].style.background = this.Iplay
      //   stop[m].style.backgroundSize = "cover"
      //   //stop[index].className="Imgplay"
      // }
      // //this.allStop()
    },
    //播放用户录音
    playUserVoice(index, audio) {
      var Player = this.$refs.player;
      Player.load();
      this.Bgmusic = true;
      this.music = audio;
      if (this.curItem != index) {
        this.isPlayUser = true;
      } else {
        this.isPlayUser = !this.isPlayUser;
      }
      this.curItem = index;
      setTimeout(() => {
        this.isPlayUser ? Player.play() : Player.pause();
      }, 200);
    },
    //总控音乐播放(停用)
    // AllPlay() {
    //   this.Allmusic = !this.Allmusic
    //   //this.$refs.player.pause()
    // },
    //公共用户状态(停用)
    // allStop(index, bool) {
    //   var that = this;
    //   if (this.index == index) {} else {
    //     bool = true
    //   }
    //   var stop = document.getElementsByClassName("stop");
    //   for (var m = 0; m < stop.length; m++) {
    //     if (!bool) {
    //       stop[m].style.background = that.Iplay;
    //       stop[m].style.backgroundSize = "cover";
    //       this.$refs.player.pause();
    //     }
    //     if (index == m) {
    //       stop[index].style.background = that.Istop;
    //       stop[index].style.backgroundSize = "cover";
    //       this.$refs.player.pause();

    //     } else {
    //       stop[m].style.background = that.Iplay;
    //       stop[m].style.backgroundSize = "cover";
    //       that.$refs.player.load();
    //       that.$refs.player.play();
    //     }

    //   }
    //   this.index = index;
    // },

    //音乐播放完毕
    pushwork() {
      this.$refs.player.addEventListener('ended', () => {
        this.Bgmusic = true;
        this.isPlayUser = false;
      }, false);
    },

    //跳转
    ToTask() {
      AjaxIndex.getIndex(res => {
        if (res.code == 0) {
          //获取当前章节
          AjaxChapter.getChapterInfo(res => {
            if (res.code == 0) {
              for (var i = 0; i < res.data.section_list.length; i++) {
                var element = res.data.section_list[i];
                if (element.section_info.done_times == 0 && (element.section_type == 1 || element.section_type == 2 || element.section_type == 3)) {
                  Vue.toast('您还未完成前面的课程，请完成后再来挑战。前往课程页面继续学习吧');
                  return;
                }
              }
              this.$router.push({
                path: '/Task',
                query: {
                  //章节id
                  chapterid: this.chapterid,
                  lrcUrl: this.datas.lrc,
                  music: this.datas.bg_audio
                }
              })
            } else {
              Vue.toast(res.msg);
            }
          }, {
            chapterid: this.$route.query.chapterid
          });


        } else if (res.code == 1209) {
          alert("您还未购买课程，请先购买课程，再来挑战。买了的都觉的课程很棒。")
          window.location.href = "http://classroom.tianyinculture.com/presell";
        } else {
          Vue.toast(res.msg);
        }
      }, {
        "courseid": 1
      });
    },
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
              'onMenuShareTimeline',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(() => {
            var song = window.localStorage.getItem("song_name")
            wx.onMenuShareAppMessage({
              title: '我已在明星教室提交了今天的作业，小伙伴们快来听听我唱的' + (song == "" ? "歌曲" : song) + '吧！', // 分享标题
              desc: '百万人在这里学会了唱歌', // 分享描述
              link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://static.tianyinculture.com/classroom/img/1/mxjs-logo.jpg', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });

            wx.onMenuShareTimeline({
              title: '我已在明星教室提交了今天的作业，小伙伴们快来听听我唱的' + (song == "" ? "歌曲" : song) + '吧！', // 分享标题
              desc: '百万人在这里学会了唱歌', // 分享描述
              link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://static.tianyinculture.com/classroom/img/1/mxjs-logo.jpg', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });

            console.log('config 配置成功');
          });
          wx.error(function (res) {
            console.log(res);
          });
        } else {
          Vue.toast(res.msg);
        }

      });
    }
  },

  mounted() {
    this.menu();
    this.getId();
    this.getUserData();
    this.getHomeworkData();
    window.addEventListener('scroll', this.menu);
    this.$nextTick(() => {
      this.pushwork();
      this.$refs.player.load();
    })
  },
  created() {
    this._initWXConfig();
  },
  updated() {},
  watch: {}
}

function transNum(num) {
  switch (num) {
    case "1":
      return '一'
      break;
    case "2":
      return '二'
      break;
    case "3":
      return '三'
      break;
    case "4":
      return '四'
      break;
    case "5":
      return '五'
      break;
    default:
      return num
  }
  return num
}
