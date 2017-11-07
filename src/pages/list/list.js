import Vue from 'vue'
import AjaxIndex from '../../services/index/index'; //接口

export default {

	name: 'homework',
	swiper: null,
	data() {
		return {
            isVPlay: false, //当前是否播放视屏
			datas: {},
			page: [{
				"done_sections": ""
			}],
			info: {},
			Lastmask:true,
			firstTxt:"",
			secondTxt:"",
			code:true //购买过
		}
	},
	methods: {
        //切换播放视频
        playVideo(e) {
            this.isVPlay = !this.isVPlay;
            var video = document.getElementsByTagName('video')[0];
            this.isVPlay ? video.play() : video.pause();
        },
        getIndexData() {
			AjaxIndex.getIndex(res => {
				if(res.code == 0&&res.data.ispay) {
					this.datas = res.data
         			document.title = res.data.name;
					this.page = res.data.chapter_list
					this.info = res.data.graduation_info
					this.word()
                    for(var i in this.page) {
                        this.page[i].chapter_seq = transNum(this.page[i].chapter_seq)
                    }
                } else if(res.code == 106) {
					alert(JSON.stringify(res));
					//授权跳转
					window.location.href = res.data.url;
				}  else if (!res.data.ispay) {
		        		this.datas=res.data
		        		this.page = res.data.chapter_list;
		        		res.data.current_chapter=0
		        		this.code=false //没有购买
		        		this.word()
		        		this.datas.bought_term = this.datas.current_term
		           		 for(var i in this.page) {
	                        this.page[i].chapter_seq = transNum(this.page[i].chapter_seq)
	                        console.log(this.page[i].chapter_seq)
	                    }	
		//          window.location.href = "http://classroom.tianyinculture.com/presell";
		        }else {
					Vue.toast(res.msg);
				}
			}, {
				"courseid": 1
			});
		},
		
		word(){
			var that=this
	    	if(this.datas.current_chapter==0&&this.datas.bought_term==this.datas.current_term){
	    		this.Lastmask=false
	    	}
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
			//console.log(this.text)
		},
		//没有购买课程
	    buy(){
	    	window.location.href = "http://classroom.tianyinculture.com/presell";
	    },
	    //购买课程
		fn(){
    	var that=this
    		if(this.datas.done_chapters<this.datas.total_chapters-1){
    		if(that.datas.current_chapter==that.datas.done_chapters){
    			var chapter=that.datas.done_chapters-1
    			if(chapter<0){
    				chapter=0
    			}else{
    				if(that.datas.bought_term==that.datas.current_term){
    					chapter=that.datas.done_chapters-1
    				}else{
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
    	}else if(this.datas.total_chapters==this.datas.done_chapters){
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
	    }
	},
	mounted() {
		this.getIndexData()
	},
	updated() {},
	watch: {}
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
