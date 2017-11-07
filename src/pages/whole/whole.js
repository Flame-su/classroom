import AjaxWhole from '../../services/whole/whole'; //数据连接

import Vue from 'vue';
	export default {
  data() {
    return {
     	datas:{},
     	percentum:33.3,
     	lists:[{"section_info":""}],
     	info:{},
      TAvatar: window.localStorage.getItem('teacher_avatar'),
		chapterid:"",//章节ID
    }
  },
  methods: {
  	//获取id
	getId(){
	    this.chapterid = this.$route.query.chapterid;
	},
  	getWholeData() {
  	  AjaxWhole.getWhole(res => {
  	    this.datas = res.data;
  	    this.lists=res.data.section_list
  	     document.title = res.data.name
  	    console.log(this.lists[0].section_info.intro)
  	  },{"chapterid":this.chapterid});
  	},
  	fns(){
  		var that=this
  		for(var i=1;i<this.lists.length;i++){
  			var listTime = this.lists[i];
  			if (listTime.section_info.done_times == 0 && (listTime.section_type == 1 || listTime.section_type == 2)) {
	          Vue.toast('您还有未完成练习任务，还不能去课后作业');
	          return;
	        }
  		}
  		   this.$router.push({
	        path: '/Homework',
	        query: {
	          chapterid: this.chapterid
	        }
	      })
  	}
  },
  created() {
  	this.getId()
  	this.getWholeData()
  },
  mounted() {
  	
  }
}