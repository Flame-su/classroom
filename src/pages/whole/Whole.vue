<template>
    <div class="whole">
    	 <div class="tips">
            <p>
            	 <div class="d-tips">
                 
		<span class="title-img"><img :src="TAvatar" alt=""></span>
             
                    <h6> {{lists[0].section_info.intro}}</h6>
                </div>
               
            </p>
        </div>
        <ul class="content" >
        	<!--索引从一开始-->
       	<router-link :to="{name:data.section_type==1?'vocal':'Group',query:{chapterid,sectionid:data.sectionid,section_type:data.section_type,index:index,lrcUrl:data.section_info.lrc.url}}" v-for="data,index in lists" v-if="data.section_type<3?1:0">
        	<li >
        		<div class="content-img">
        			<!--图片完成显现-->
                    <img :src="data.section_info.img" />
	     			<div class="mask" v-show="data.section_info.done_times>=data.section_info.times?true:false">
	     			</div>
        			<img src="../../static/image/over.png" alt=""  v-show="data.section_info.done_times>=data.section_info.times?true:false"/>
        		</div>
        		<div class="content-txt" >
        			<h3>{{data.section_info.name}}</h3>
        			<!--进度条-->
        			<div class="icons" v-show="data.section_info.done_times==0?false:true"><i :style="{width:(data.section_info.done_times>data.section_info.times?data.section_info.times:data.section_info.done_times)/data.section_info.times*100+'%'}"></i></div>
        			<p>练习任务：<i ref="choose"  v-bind:style="{'color':data.section_info.done_times>=data.section_info.times?'':'#FA5857'}" v-show="data.section_info.done_times==0?false:true">
        				{{data.section_info.done_times>=data.section_info.times?data.section_info.times:data.section_info.done_times}}
        			</i><span v-show="data.section_info.done_times==0?false:true">/</span>{{data.section_info.times}}次</p>
        		</div>
        	</li>
        		</router-link>
        </ul>
    	<div class="footer" >
    	 	<div @click="fns()">
				<div class="sure" >
					展示学习成果
				</div>
			</div>
		</div>   
    </div>
</template>
<script src="./whole.js">
	

</script>
<style lang="scss">
@import "./whole.scss";
</style>
