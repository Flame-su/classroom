<template>
	<div class="homework">
		<div v-title>课后作业</div>
		<audio ref="player" class="player" :src="music">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>

		<div class="title">
			<img :src="datas.task_img" />
			<div class="title-name">
				<h3>课后作业</h3>
				<p v-html="datas.task_intro"></p>
			</div>
			<div class="bg-music">
				<img src="../../static/image/n-stop.png" @click="playBgMisic" v-show="!Bgmusic" />
				<img src="../../static/image/n-play.png" @click="playBgMisic" v-show="Bgmusic" />
				<p>点击播放示范演唱</p>
			</div>
		</div>

		<div class="blank">

		</div>
		<div class="content">
			<p class="all">已提交
				<span>{{datas.total_works=""?0:datas.total_works}} </span>份作业</p>
			<ul>
				<li v-for="list,index in lists">
					<div class="message">
						<img :src="list.avatar" alt="" class="headsho" />
						<div class="work-music">
							<h4 class="name">{{user.uid==lists[0].uid&&index==0?"我的作业":list.nickname}}</h4>
							<p class="time">{{list.addtime | time}}</p>
							<div class="mask" v-if="mask"></div>
							<div class="play" @click="playUserVoice(index,list.audio)" :class="{'active':curItem == index}">
								<img :src="('http://static.tianyinculture.com/classroom/img/1/work_icon'+(list.workid%6+1)+'.png')" alt="" />
								<i :class="isPlayUser && curItem == index?'isplay':'ispause'"></i>

								<div class="work-content">
									<p>{{list.chapter_name}}</p>
								</div>
								<!--<audio ref="player" class="player " :src="list.audio">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>-->
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
				</li>
			</ul>
		</div>
		<!--<audio :src="datas.audio" ref="bgmusic"></audio>-->
		<!--迷你播放器-->
		<!--<div class="BTMusic" v-if="BTMusic">
			<div>
				<img :src="BTphoto" alt="" v-if="BTphoto==''?0:1"/>
				<img src="../../static/image/one.png" alt="" v-if="BTphoto==''?1:0"/>
			<p>课后作业示范演唱</p></div>
			<div><img src="../../static/image/n-play.png" alt="" @click="AllPlay" v-show="Allmusic"/><img src="../../static/image/n-stop.png" alt="" v-show="!Allmusic" @click="AllPlay"/></div>
		</div>-->
		<div class="footer">
			
			<!--<router-link :to="{name:'Task',query:{chapterid:chapterid,lrcUrl:datas.lrc,music:datas.bg_audio}}">-->
			<div class="sure" @click="ToTask">
				开始挑战
			</div>
			<!--</router-link>-->
		</div>
	</div>
</template>

<script src="./homework.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./homework.scss";
</style>
