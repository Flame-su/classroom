<template>
	<div class="class_home">
		<div class="banner">
			<div class="content">
				<div class="photo">
					<img :src="datas.avatar" alt="" />
				</div>
				<div class="introduce">
					<h3 ref="abc">{{datas.teacher}}</h3>
					<p>{{datas.slogan}}</p>
				</div>
				<div style="clear: both;"></div>
				<p class="over">完成关卡
					<b>{{datas.done_chapters}}</b>/<span>{{datas.total_chapters}}</span>
				</p>
			</div>
		</div>
		<div class="classContent swiper-container">
			<ul class="swiper-wrapper" style="transition-duration: 0ms; transform: translate3d(58.3333px, 0px, 0px)">
				<li class="swiper-slide">
					<router-link :to="{name:'List'}">

						<img :src="datas.img" />
						<div class="box">
							<h3>课程目录</h3>
							<div class="lists">
								<ul>
									<li v-for="list in page">
										<span></span>{{list.chapter_name}}
									</li>
								</ul>
							</div>
						</div>
					</router-link>
				</li>
				<!--<li v-for="list,index in page" class="swiper-slide" v-if="index>=datas.current_chapter?0:1">-->
				<li v-for="list,index in page" class="swiper-slide" v-if="index>=datas.current_chapter&&datas.bought_term==datas.current_term?0:1">
					<div class="mask" v-if="index>=datas.done_chapters+1?1:0"></div>
					<!--  章节类型:1:分段 2:整首-->
					<router-link tag="div" :to="{name:list.chapter_type==2?'Whole':'Singing',query:{chapterid:list.chapterid}}">
						<img :src="list.chapter_img" alt="" />
						<div class="box-last">
                        <h3>第{{list.chapter_seq}}课</h3>
							<h3>{{list.chapter_name}}</h3>
							<p v-if="index>=datas.done_chapters+1?1:0" class="close">完成上一节课解锁
								<span><img src="../../static/image/suo.vue.png" alt="" /></span>
							</p>
							<div v-if="list.done_sections==0&&index==datas.done_chapters?1:0" class="chapter_intro">
								<h4>
									<span></span>训练重点</h4>
								<p v-text="firstTxt[index]"></p>
								<p v-text="secondTxt[index]"></p>
								
							</div>
							<div v-if="index>=datas.done_chapters+1?0:1" class="plan">
								<p>本节课完成进度
									<b>{{list.done_sections>list.total_sections?list.total_sections:list.done_sections}}</b>/
									<span>{{list.total_sections}}</span>
								</p>
								
							</div>
						</div>
					</router-link>
				</li>
				<li class="swiper-slide lastInfo" :style="{background:graduation_info.bgcolor}" v-if="lastInfo">
					<router-link :to="{name:'Finish'}">
					
						<img :src="graduation_info.medal" style="width: 100%;height: auto;"/>
						<div class="lastText">
							<h3>{{graduation_info.title}}</h3>
							<p>{{datas.slogan}}</p>						
						</div>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="footer">
			<!--<router-link :to="{name:datas.done_chapters==0&&this.page[0].done_sections==0?'Singing':'Whole'}">-->
			<div class="sure" @click="fn()" v-if="code">
				{{datas.current_chapter==0 &&datas.bought_term==datas.current_term?"即将开课":page[0].done_sections!=0?"继续学习":"开始学习"}}
			</div>
			<div class="sure" @click="buy()" v-if="!code">
				购买课程
			</div>
			<div class="last_mask" v-if="!Lastmask">
					
			</div>
			<!--</router-link>-->
		</div>
	</div>
</template>

<script src="./home.js"></script>

<style scoped lang="scss">
@import "./home.scss";
</style>
