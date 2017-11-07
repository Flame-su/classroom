<template>
	<div class="page">
		<div class="title video" v-tap="{methods:playVideo,datas}" :class=" { 'wait':!isVPlay} ">
           <video controls x5-playsinline webkit-playsinline playsinline  :src="datas.video" :poster="datas.poster">您的浏览器不支持video属性，请更换浏览器在进行浏览</video>
		</div>
		<div class="content">
			<h3>{{datas.song}}</h3>
			<p>{{datas.slogan}}</p>
            <!--
			<p>
				<span>
					<img src="../../static/image/ren1.png" alt="" />
				</span><b>3976人一起学习</b></p>
-->
		</div>
		<div class="a_sp">

		</div>
		<div class="curriculum">
			<div class="scroll_container">
			<ul>
				<h3>课程目录</h3>
				<li v-for="data,index in page">
					<span></span>
					<div class="list">
						<h3>第{{data.chapter_seq}}课: {{data.chapter_name}}</h3>
						<p v-text="firstTxt[index]"></p>
						<p v-text="secondTxt[index]"></p>
					</div>
					<div style="clear: both;">
					</div>
				</li>
			</ul>
			<div class="award">
				<h3>{{info.title}}</h3>
				<p>完成全部课程后就可以解锁获得{{info.title}}和明星教室颁发的电子证书！快来练习吧~</p>
				<div class="imgContainer">
					<img src="../../static/image/xz.png" alt="" />
				</div>

				</div>
			</div>
		</div>
		<div class="footer">
			<div class="sure" @click="fn()"  v-if="code">
					{{datas.current_chapter==0 &&datas.bought_term==datas.current_term?"即将开课":page[0].done_sections!=0?"继续学习":"开始学习"}}
			</div>
			<div class="sure" @click="buy()" v-if="!code">
				购买课程
			</div>
			<div class="last_mask" v-if="!Lastmask">
					
			</div>
		</div>
	</div>
</template>

<script src="./list.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./list.scss";
</style>
