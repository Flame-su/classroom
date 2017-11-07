import Vue from 'vue'
import AjaxSigan from '../../services/config/config'; //微信授权配置
import AjaxIndex from '../../services/index/index'; //接口
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText
    el.remove()
  }
})

export default {

  name: 'home',
  swiper: null,
  data() {
    return {
      datas: {},
      Lastmask:true,//即将开课
      page: [{
        "done_sections": ""
      }],
      done_chapters:"",
      learning_days:1,
      firstTxt:"",
			secondTxt:"",
			graduation_info:"",//勋章信息
    	lastInfo:false,
    	sum:"",//定位
    	code:true //购买过
    }
  },
  methods: {
    getScroll() {
      let that = this
      this.scroll = document.body.scrollTop;
      if (this.scroll >= 200) {
        that.isShow = true
      } else {
        that.isShow = false
      }
    },
    getIndexData() {
    	
      AjaxIndex.getIndex(res => {
        if (res.code == 0&&res.data.ispay) {
          this.datas = res.data;
          this.page = res.data.chapter_list;
          for(var i in this.page) {
              this.page[i].chapter_seq = transNum(this.page[i].chapter_seq)
          }
          document.title = res.data.name
          this.graduation_info=res.data.graduation_info //勋章信息
          this.done_chapters=res.data.done_chapters//完成第几课
          this.learning_days=res.data.learning_days //学习几天
        	//alert( res.data.current_chapter)
        	this.work()//换行词
         	this.fns()//定位
         window.localStorage.setItem("song_name", this.datas.song)
				 window.localStorage.setItem("teacher_avatar", this.datas.avatar);
         this._initWXConfig();
        } else if (!res.data.ispay) {
        		this.datas=res.data
        		 this.page = res.data.chapter_list;
        		 res.data.current_chapter=0
        		 this.code=false //没有购买
        		 this.datas.bought_term = this.datas.current_term
            console.log()	
//          window.location.href = "http://classroom.tianyinculture.com/presell";
        } else {
          Vue.toast(res.msg);
        }
      }, {
				"courseid": 1
			});
    },
    //没有购买课程
    buy(){
    	window.location.href = "http://classroom.tianyinculture.com/presell";
    },
    //购买课程
    fn(){
			console.log(this.code)
    	var that=this
    	//完成的课程是否小于总课程-1，定位到练习页
    	if(this.datas.done_chapters<this.datas.total_chapters-1){
    		//开课和完成课相同，定位到完成课程
    		if(that.datas.current_chapter==that.datas.done_chapters){
    			var chapter=that.datas.done_chapters-1
    			if(chapter<0){
    				chapter=0
    			}else{
    				if(that.datas.bought_term==that.datas.current_term){
							//新生定位到本课
							chapter=that.datas.done_chapters-1
    				}else{
    					//老生定位下一课
    					chapter=that.datas.done_chapters
    				}
    			}
    			that.$router.push({
		        path: '/Singing',
		      	query: {
		      		//章节id
		          chapterid: that.page[chapter].chapterid
		        }
		     })
    		}else{
	    		that.$router.push({
		        path: '/Singing',
		      	query: {
		      		//章节id
		          chapterid: that.page[that.datas.done_chapters].chapterid
		        }
		     })
    		}
    	}else if(this.datas.total_chapters==this.datas.done_chapters){//总课程==完成课程定位到整首页
    			that.$router.push({
	        path: '/Whole',
	      	query: {
	          chapterid: that.page[that.datas.done_chapters-1].chapterid
	        }
	      })
    	}else{
    			if(that.datas.current_chapter==that.datas.done_chapters&&that.datas.bought_term==that.datas.current_term){
    				that.$router.push({
			        path: '/Singing',
			      	query: {
			      		//章节id
			          chapterid: that.page[that.datas.done_chapters-1].chapterid
			        }
			     })
    			}else{
    				that.$router.push({
			        path: '/Whole',
			      	query: {
			          chapterid: that.page[that.datas.done_chapters].chapterid
			        }
			      })
    				
    			}
    	}
    }, 
    work(){
    	var arr=[]
			var brr=[]
			for(var i=0;i<this.page.length;i++){
				
				var text=this.page[i].chapter_intro.split("\n")
				arr.push(text[0])
				brr.push(text[1])
				//console.log(text)
			}
			this.firstTxt=arr
			this.secondTxt=brr
    },
    //定位到完成课程
    fns(){	
    	//即将开课
    	var that=this
    	
    	console.log(that.page[0].chapterid)
    	if(this.datas.current_chapter==0&&this.datas.bought_term==this.datas.current_term){
    		this.Lastmask=false
    	}
 
   	//var arr=document.getElementsByClassName("swiper-wrapper")[0]

   	var brr=[]
   	for(var i=0;i<this.page.length;i++){
   		var sum=this.page[i].done_sections
   		console.log(sum)
   		if(sum>0){
   			brr.push(sum)
   		}
   	}
	 	//arr.style.transform=""
// 	var course=["one","two","three","four","five","six","seven"]
	  	if(this.datas.total_chapters==this.datas.done_chapters){
	  		that.lastInfo=true
	  		that.sum=that.datas.total_chapters+1
	  	}else{
	  		//定位到下一张
	  		if(that.datas.bought_term==that.datas.current_term){
	  			if(that.datas.current_chapter==that.datas.done_chapters){
	  				that.sum=that.datas.done_chapters
	  			}else{
	  				that.sum=that.datas.done_chapters+1
	  			}
	  		}else{
	  			that.sum=that.datas.done_chapters+1
	  		}
//	  		arr.className=course[brr.length]
	  		
	  	}
	  },
    _initWXConfig(){
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

                  var sharecode = res.data.sharecode

          wx.ready(() => {
              var song = window.localStorage.getItem("song_name")
                  var days = (this.learning_days != undefined && this.learning_days > 1) ? this.learning_days : 1
                  wx.onMenuShareAppMessage({
                  title: '我已在明星教室坚持学习'+days+'天，今天正在练习'+song+'，马上就可以去KTV当麦霸啦！', // 分享标题
                  desc: '百万人在这里学会了唱歌', // 分享描述
                  link: 'http://classroom.tianyinculture.com/classroom?sharecode='+sharecode, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                  title: '我已在明星教室坚持学习'+days+'天，今天正在练习'+song+'，马上就可以去KTV当麦霸啦！', // 分享标题
                  desc: '百万人在这里学会了唱歌', // 分享描述
                  link: 'http://classroom.tianyinculture.com/classroom?sharecode='+sharecode, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
  //轮播
  mounted() {
    this.getIndexData()
     setTimeout(()=>{
     	var that=this
    	this.$options.swiper = new Swiper('.swiper-container', {
	      pagination: '.swiper-pagination',
	      slidesPerView: 1.28,
	      centeredSlides: true,
	      paginationClickable: true,
	      spaceBetween: 35,
	      observer: true,
	      observeParents: true,
	      loop: false,
	      initialSlide:that.sum	
	    })
	    },500)
  
    window.addEventListener('scroll', this.getScroll)
  },
  updated() {},
  watch: {
    datas(val) {
      let that = this
      setTimeout(() => {
        that.$options.swiper.update()
      }, 0)
    }
  },

  created() {
    //this._initWXConfig();
  },
}
function transNum(num) {
    switch(num) {
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
